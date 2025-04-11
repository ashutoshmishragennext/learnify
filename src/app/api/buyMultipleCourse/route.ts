import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import connectDB from "@/lib/dbConnect";
import Course from "@/app/models/Course";
import { auth } from "../../../../auth";
import User from "@/app/models/User";
import Publisher from "@/app/models/Publisher";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  const session = await auth();
  const { cId, paymentId } = await request.json();
  
  if (!Array.isArray(cId) || cId.length === 0) {
    return NextResponse.json({ error: "Invalid course IDs." }, { status: 400 });
  }

  await connectDB();

  const user = await User.findOne({ _id: session?.user?.id });
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  try {
    const paymentDetails = await razorpay.payments.fetch(paymentId);
    if (paymentDetails.status !== "captured") {
      return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
    }

    const courses = await Course.find({ courseId: { $in: cId } });
    if (courses.length !== cId.length) {
      return NextResponse.json({ error: "Some courses not found." }, { status: 404 });
    }

    const newCourses = cId.filter((id) => !user.coursesBought.includes(id));
    if (newCourses.length === 0) {
      return NextResponse.json({ message: "All courses already bought." }, { status: 200 });
    }

    await User.updateOne(
      { _id: user._id },
      { $addToSet: { coursesBought: { $each: newCourses } } }
    );

    await Course.updateMany(
      { courseId: { $in: newCourses } },
      { $inc: { studentsEnrolled: 1 } }
    );

    // const publishers = await Publisher.find({
    //   "coursesPublished.publishedCourses": { $in: newCourses }
    // });

    // Update studentsTaught count for each publisher
    await Publisher.updateMany(
      { "coursesPublished.publishedCourses": { $in: newCourses } },
      { $inc: { studentsTaught: 1 } }
    );

    return NextResponse.json(
      { message: `Payment successful. ${newCourses.length} course(s) added.` },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error verifying payment." },
      { status: 500 }
    );
  }
}

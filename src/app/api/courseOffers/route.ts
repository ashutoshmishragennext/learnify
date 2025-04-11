import connectDB from "@/lib/dbConnect";
import Course from "@/app/models/Course";
import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import User from "@/app/models/User";

export async function GET() {
  const session = await auth();
  try {
    await connectDB();

    if(session) {
      const user = await User.findOne({email: session?.user?.email});
      if (user) {
        const courses = await Course.find({
            courseId: { $nin: user.coursesBought },
            "price.discountPercentage": { $gt: 0 },
          }).lean();

        // console.log("Returning courses for user:", courses);
        return NextResponse.json({ success: true, data: courses });
      }
      return NextResponse.json({ success: false, message: "User not found." }, { status: 500 });
    }

    const courses = await Course.find({}).lean();

    return NextResponse.json({ success: true, data: courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch courses." }, { status: 500 });
  }
}

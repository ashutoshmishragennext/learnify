import connectDB from "@/lib/dbConnect";
import Course from "@/app/models/Course";
import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import User from "@/app/models/User";

export async function GET() {
  const session = await auth();
  try {
    await connectDB();

    // Define the fields you want to select
    const selectFields = {
      courseId: 1,
      name: 1,
      image: 1,
      studentsEnrolled: 1,
      shortDescription: 1,
      'price.current': 1,
      'price.original': 1,
      _id: 0 // Exclude the MongoDB _id field
    };

    if(session) {
      const user = await User.findOne({email: session?.user?.email});
      if (user) {
        const courses = await Course.find({
          courseId: { $nin: user.coursesBought },
        }).select(selectFields);
        return NextResponse.json({ success: true, data: courses });
      }
      return NextResponse.json({ success: false, message: "User not found." }, { status: 500 });
    }

    // Fetch courses with only selected fields
    const courses = await Course.find({}).select(selectFields).lean();

    // Return the courses in JSON format
    return NextResponse.json({ success: true, data: courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch courses." }, { status: 500 });
  }
}
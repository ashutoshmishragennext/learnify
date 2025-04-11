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
        });
        return NextResponse.json({ success: true, data: courses });
      }
      return NextResponse.json({ success: false, message: "User not found." }, { status: 500 });
    }

    // Fetch all courses
    const courses = await Course.find({}).lean();

    // Return the courses in JSON format
    return NextResponse.json({ success: true, data: courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch courses." }, { status: 500 });
  }
}

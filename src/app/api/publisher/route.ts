import connectDB from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
// import { auth } from "../../../../auth";
import Publisher from "@/app/models/Publisher";

export async function POST(req: NextRequest) {
//   const session = await auth();
  const {courseId} = await req.json();
  try {
    await connectDB();

    const publisher = await Publisher.findOne({
      "coursesPublished.publishedCourses": { $in: [courseId] }  // Corrected query
    });
    if(!publisher){
      return NextResponse.json({success: false, message: "No Publisher available"}, {status: 404});
    }

    // Return the courses in JSON format
    return NextResponse.json({ success: true, publishers: publisher });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch Publishers." }, { status: 500 });
  }
}

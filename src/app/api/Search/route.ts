// import connectDB from "@/lib/dbConnect";
// import Course from "@/app/models/Course";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);
//     const query = searchParams.get("query");

//     let courses;
//     if (query) {
//       // Case-insensitive search on course name and description
//       courses = await Course.find({
//         $or: [
//           { name: { $regex: query, $options: "i" } },
//           { description: { $regex: query, $options: "i" } },
//         ],
//       }).lean();
//     } else {
//       courses = await Course.find({}).lean(); // Return all courses if no query is provided
//     }

//     return NextResponse.json({ success: true, data: courses });
//   } catch (error) {
//     console.error("Error searching courses:", error);
//     return NextResponse.json(
//       { success: false, message: "Failed to fetch courses." },
//       { status: 500 }
//     );
//   }
// }

import connectDB from "@/lib/dbConnect";
import Course from "@/app/models/Course";
import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import User from "@/app/models/User";

export async function POST(req: Request) {
  const session = await auth();
  try {
    const { query } = await req.json();
    // console.log("This is the query from the backend: ", query);
    await connectDB();

    // const { searchParams } = new URL(req.url);
    // const query = searchParams.get("query");

    let courses;

    if (session) {
      if (query) {
        const user = await User.findOne({ email: session?.user?.email });

        courses = await Course.find({
          $and: [
            {
              $or: [
                { name: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
                { category: { $regex: query, $options: "i" } },
                { tags: { $in: [new RegExp(query, "i")] } },
              ],
            },
            { courseId: { $nin: user?.coursesBought || [] } },
          ],
        })
          .lean()
          .select("_id name image courseId");
      } else {
        const user = await User.findOne({ email: session?.user?.email });

        courses = await Course.find({
          courseId: { $nin: user?.coursesBought || [] }, // Exclude bought courses
        })
          .lean()
          .select("_id name image courseId");
      }
    } else {
      if (query) {
        courses = await Course.find({
          $or: [
            { name: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
            { category: { $regex: query, $options: "i" } },
            { tags: { $in: [new RegExp(query, "i")] } },
          ],
        })
          .lean()
          .select("_id name image courseId");
      } else {
        courses = await Course.find({})
          .lean()
          .select("_id name image courseId");
      }
    }
    return NextResponse.json({ success: true, data: courses });
  } catch (error) {
    console.error("Error searching courses:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch courses." },
      { status: 500 }
    );
  }
}

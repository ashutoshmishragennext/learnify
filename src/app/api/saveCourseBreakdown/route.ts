/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Course from "@/app/models/Course";

export async function POST(req: Request) {
  try {
    await connectDB();

    // Getting the last updated course
    const courseId: number = await Course.countDocuments();
    const rewardsArray: number[] = []; // Changed from let to const

    const data = await req.json();
    // console.log("Data received from frontend inside the backend: ", data);

    // Extract modules and transform to match schema
    const modules = data.map((module: any) => {
      const reward = Number(module.reward);
      rewardsArray.push(reward);

      return {
        moduleNumber: Number(module.number),
        moduleTitle: module.topic,
        moduleDuration: Number(module.duration),
        subModulePart: Number(module.parts),
        reward,
        subModules: module.subModules.map((sub: any) => ({
          sModuleNumber: Number(sub.partNumber),
          sModuleTitle: sub.partName,
          sModuleDuration: Number(sub.duration),
          videoLecture: sub.videoLecture,
        })),
      };
    });

    // console.log("CourseId:", courseId, "modules after destructuring:", modules);
    // console.log("Rewards Array:", rewardsArray);

    // sum up all rewards and storing in one.
    const sumOfRewards: number = rewardsArray.reduce( // Changed from let to const
      (acc, curr) => acc + curr,
      0
    );

    const course = await Course.findOneAndUpdate(
      { courseId: courseId },
      {
        $set: {
          modules,
          rewards: {
            moduleRewards: rewardsArray,
            totalReward: sumOfRewards,
          },
          lastUpdated: new Date(),
        },
      },
      { new: true }
    );

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Course modules updated successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error updating course modules:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
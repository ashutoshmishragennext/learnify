/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Course from "@/app/models/Course";
import { auth } from "../../../../auth";

export async function POST(req: Request) {
  const session = await auth();

  try {
    await connectDB();

    const data = await req.json();
    const courseId = data.courseId;

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    if (!data.modules || !Array.isArray(data.modules)) {
      return NextResponse.json({ error: "Modules data is required and must be an array" }, { status: 400 });
    }

    const existingCourse = await Course.findOne({ courseId });
    if (!existingCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const rewardsArray: number[] = [];
    let totalDuration = 0;

    const modules = data.modules.map((module: any, index: number) => {
      const reward = Number(module.reward) || 0;

      // Module duration in seconds
      const moduleDurationInSeconds =
        (Number(module.duration?.hours || 0) * 3600) +
        (Number(module.duration?.minutes || 0) * 60) +
        (Number(module.duration?.seconds || 0));

      rewardsArray.push(reward);
      totalDuration += moduleDurationInSeconds;

      const subModules = (module.subModules || []).map((sub: any) => {
        const subDurationInSeconds =
          (Number(sub.duration?.minutes || 0) * 60) +
          (Number(sub.duration?.seconds || 0));

        return {
          sModuleNumber: Number(sub.partNumber) || 0,
          sModuleTitle: sub.partName || '',
          sModuleDuration: subDurationInSeconds,
          videoLecture: sub.videoLecture || null,
          videoType: sub.videoType || 'file',
          description: sub.description || '',
          attachedPdf: sub.attachedPdf || '',
        };
      });

      return {
        moduleNumber: index + 1,
        moduleTitle: module.topic || '',
        moduleDuration: moduleDurationInSeconds,
        subModulePart: Number(module.parts) || subModules.length,
        reward: reward,
        description: module.description || '',
        subModules: subModules,
      };
    });

    const totalReward = rewardsArray.reduce((acc, curr) => acc + curr, 0);

    const updatedCourse = await Course.findOneAndUpdate(
      { courseId },
      {
        $set: {
          modules: modules,
          duration: totalDuration,
          rewards: {
            moduleRewards: rewardsArray,
            totalReward: totalReward,
          },
          lastUpdated: new Date(),
        },
      },
      { new: true }
    );

    if (!updatedCourse) {
      return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: "Course modules updated successfully",
        course: {
          courseId: updatedCourse.courseId,
          totalModules: modules.length,
          totalDuration: totalDuration,
          totalReward: totalReward,
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating course modules:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await auth();
  
  try {
    await connectDB();

    const data = await req.json();
    const courseId = data.courseId;

    // Validate required data
    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    // Check if course exists
    const existingCourse = await Course.findOne({ courseId: courseId });
    if (!existingCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const updateData: any = {
      lastUpdated: new Date(),
    };

    // Update modules if provided
    if (data.modules && Array.isArray(data.modules)) {
      const rewardsArray: number[] = [];
      let totalDuration = 0;

      const modules = data.modules.map((module: any, index: number) => {
        const reward = Number(module.reward) || 0;
        const moduleDuration = Number(module.duration) || 0;
        
        rewardsArray.push(reward);
        totalDuration += moduleDuration;

        const subModules = (module.subModules || []).map((sub: any) => ({
          sModuleNumber: Number(sub.partNumber) || 0,
          sModuleTitle: sub.partName || '',
          sModuleDuration: Number(sub.duration) || 0,
          videoLecture: sub.videoLecture || '',
        }));

        return {
          moduleNumber: index + 1,
          moduleTitle: module.topic || '',
          moduleDuration: moduleDuration,
          subModulePart: Number(module.parts) || subModules.length,
          reward: reward,
          subModules: subModules,
        };
      });

      const totalReward = rewardsArray.reduce((acc, curr) => acc + curr, 0);

      updateData.modules = modules;
      updateData.duration = totalDuration;
      updateData.rewards = {
        moduleRewards: rewardsArray,
        totalReward: totalReward,
      };
    }

    // Update individual module if provided
    if (data.moduleNumber && data.moduleUpdate) {
      const moduleNumber = Number(data.moduleNumber);
      const moduleUpdate = data.moduleUpdate;
      
      // Find and update specific module
      const course = await Course.findOne({ courseId: courseId });
      if (course && course.modules) {
        const moduleIndex = course.modules.findIndex((m:any) => m.moduleNumber === moduleNumber);
        if (moduleIndex !== -1) {
          // Update specific fields of the module
          if (moduleUpdate.moduleTitle) course.modules[moduleIndex].moduleTitle = moduleUpdate.moduleTitle;
          if (moduleUpdate.moduleDuration) course.modules[moduleIndex].moduleDuration = Number(moduleUpdate.moduleDuration);
          if (moduleUpdate.reward) course.modules[moduleIndex].reward = Number(moduleUpdate.reward);
          if (moduleUpdate.subModules) course.modules[moduleIndex].subModules = moduleUpdate.subModules;

          updateData.modules = course.modules;
          
          // Recalculate rewards and duration
          const newRewardsArray = course.modules.map((m:any) => m.reward);
          const newTotalDuration = course.modules.reduce((acc:any, m:any) => acc + m.moduleDuration, 0);
          const newTotalReward = newRewardsArray.reduce((acc:any, curr:any) => acc + curr, 0);
          
          updateData.duration = newTotalDuration;
          updateData.rewards = {
            moduleRewards: newRewardsArray,
            totalReward: newTotalReward,
          };
        }
      }
    }

    const updatedCourse = await Course.findOneAndUpdate(
      { courseId: courseId },
      { $set: updateData },
      { new: true }
    );

    return NextResponse.json(
      { 
        message: "Course updated successfully",
        course: {
          courseId: updatedCourse.courseId,
          totalModules: updatedCourse.modules?.length || 0,
          totalDuration: updatedCourse.duration || 0,
          totalReward: updatedCourse.rewards?.totalReward || 0,
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    const course = await Course.findOne({ courseId: courseId }).select('modules rewards duration');
    
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(
      { 
        courseId: course.courseId,
        modules: course.modules,
        rewards: course.rewards,
        duration: course.duration,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching course modules:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    const moduleNumber = searchParams.get('moduleNumber');

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    if (!moduleNumber) {
      return NextResponse.json({ error: "Module number is required" }, { status: 400 });
    }

    const course = await Course.findOne({ courseId: courseId });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Remove the specific module
    const moduleIndex = course.modules.findIndex((m:any) => m.moduleNumber === Number(moduleNumber));
    if (moduleIndex === -1) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    course.modules.splice(moduleIndex, 1);

    // Renumber remaining modules
    course.modules.forEach((module:any, index:number) => {
      module.moduleNumber = index + 1;
    });

    // Recalculate rewards and duration
    const newRewardsArray = course.modules.map((m:any) => m.reward);
    const newTotalDuration = course.modules.reduce((acc:any, m:any) => acc + m.moduleDuration, 0);
    const newTotalReward = newRewardsArray.reduce((acc:any, curr:any) => acc + curr, 0);

    const updatedCourse = await Course.findOneAndUpdate(
      { courseId: courseId },
      {
        $set: {
          modules: course.modules,
          duration: newTotalDuration,
          rewards: {
            moduleRewards: newRewardsArray,
            totalReward: newTotalReward,
          },
          lastUpdated: new Date(),
        },
      },
      { new: true }
    );

    return NextResponse.json(
      { 
        message: "Module deleted successfully",
        course: {
          courseId: updatedCourse.courseId,
          totalModules: updatedCourse.modules?.length || 0,
          totalDuration: updatedCourse.duration || 0,
          totalReward: updatedCourse.rewards?.totalReward || 0,
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting module:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
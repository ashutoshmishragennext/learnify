/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Course from '@/app/models/Course';

export async function GET(req: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Get courseId from query parameters
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    // Find the course by courseId
    const course = await Course.findOne({ courseId });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Transform modules to match the required response format
    const courseBreakdown = course.modules.map((module: any) => {
      // Helper function to convert duration from seconds to hours, minutes, seconds
      const convertDuration = (durationInSeconds: number) => {
        const hours = Math.floor(durationInSeconds / 3600);
        const minutes = Math.floor((durationInSeconds % 3600) / 60);
        const seconds = durationInSeconds % 60;
        return { hours, minutes, seconds };
      };

      // Helper function to convert submodule duration (assuming it's in seconds)
      const convertSubModuleDuration = (durationInSeconds: number) => {
        const minutes = Math.floor(durationInSeconds / 60);
        const seconds = durationInSeconds % 60;
        return { minutes, seconds };
      };

      // Transform submodules
      const subModules = Array.isArray(module.subModules) 
        ? module.subModules.map((subModule: any) => ({
            partNumber: subModule.sModuleNumber || 1,
            partName: subModule.sModuleTitle || "",
            duration: convertSubModuleDuration(subModule.sModuleDuration || 0),
            videoLecture: subModule.videoLecture || null,
          }))
        : []; // Handle case where subModules might be a single object or undefined

      return {
        number: module.moduleNumber || 1,
        topic: module.moduleTitle || "",
        parts: module.subModulePart || subModules.length || 1,
        duration: convertDuration(module.moduleDuration || 0),
        reward: module.reward || 0,
        subModules,
      };
    });

    return NextResponse.json(courseBreakdown, { status: 200 });

  } catch (error) {
    console.error('Error fetching course breakdown:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
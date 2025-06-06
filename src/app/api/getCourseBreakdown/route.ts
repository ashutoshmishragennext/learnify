/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Course from '@/app/models/Course';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    const course = await Course.findOne({ courseId });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Helper to convert hours to { hours, minutes, seconds }
    const convertDuration = (durationInHours: number) => {
      const durationInSeconds = durationInHours * 3600;
      const hours = Math.floor(durationInSeconds / 3600);
      const minutes = Math.floor((durationInSeconds % 3600) / 60);
      const seconds = durationInSeconds % 60;
      return { hours, minutes, seconds };
    };

    // Helper to convert seconds to { minutes, seconds }
    const convertSubModuleDuration = (durationInSeconds: number) => {
      const minutes = Math.floor(durationInSeconds / 60);
      const seconds = durationInSeconds % 60;
      return { minutes, seconds };
    };

    // 🔄 Transform modules
    const courseBreakdown = course.modules.map((module: any) => {
      const subModules = Array.isArray(module.subModules)
        ? module.subModules.map((subModule: any) => ({
            partNumber: subModule.sModuleNumber || 1,
            partName: subModule.sModuleTitle || '',
            duration: convertSubModuleDuration(subModule.sModuleDuration || 0),
            videoLecture: subModule.videoLecture || null,
            description: subModule.description || '',
            attachedPdf: subModule.attachedPdf || '',
          }))
        : [];

      return {
        number: module.moduleNumber || 1,
        topic: module.moduleTitle || '',
        parts: module.subModulePart || subModules.length || 1,
        duration: convertDuration(module.moduleDuration || 0),
        reward: module.reward || 0,
        description: module.description || '',
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

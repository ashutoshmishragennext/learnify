import Course from '@/app/models/Course';
import User from '@/app/models/User';
import connectDB from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../auth';

export async function POST(req: NextRequest) {
  const session = await auth();

  const { courseId } = await req.json();


  try {
    await connectDB(); // Ensure the database connection
    const course = await Course.findOne({ courseId });

    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    if (session) {
      const user = await User.findOne({ _id: session.user?.id });

      const hasBoughtCourse = user?.coursesBought.includes(courseId);
      if(!hasBoughtCourse){
        return NextResponse.json({ message: 'User has not bought the course' }, { status: 400 });
      }
      return NextResponse.json(
        {course},
        { status: 200 }
      );
    }

    // If no session, just redirect the user
    return NextResponse.json({ message: 'Please Login first!' }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
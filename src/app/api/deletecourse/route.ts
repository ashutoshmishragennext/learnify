/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Course from '@/app/models/Course';
import User from '@/app/models/User';
import { auth } from '../../../../auth';

export async function DELETE(req: NextRequest) {
  const session = await auth();

  // Check if user is authenticated
  if (!session || !session.user?.id) {
    return NextResponse.json(
      { message: 'Unauthorized. Please log in.' },
      { status: 401 }
    );
  }

  try {
    const { courseId } = await req.json();

    if (!courseId) {
      return NextResponse.json(
        { message: 'Course ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the course first
    const course = await Course.findOne({ courseId });

    if (!course) {
      return NextResponse.json(
        { message: 'Course not found' },
        { status: 404 }
      );
    }

    // Check if the current user is the owner of the course
    if (course.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { message: 'Forbidden. You can only delete your own courses.' },
        { status: 403 }
      );
    }

    // Delete the course
    await Course.deleteOne({ courseId });

    // Remove the course from all users' cart, wishlist, and coursesBought arrays
    await User.updateMany(
      {
        $or: [
          { cart: courseId },
          { wishlist: courseId },
          { coursesBought: courseId }
        ]
      },
      {
        $pull: {
          cart: courseId,
          wishlist: courseId,
          coursesBought: courseId
        }
      }
    );

    // Also remove course progress for this course from all users
    await User.updateMany(
      { 'courseProgress.courseId': courseId },
      {
        $pull: {
          courseProgress: { courseId: courseId }
        }
      }
    );

    return NextResponse.json(
      {
        message: 'Course deleted successfully',
        deletedCourseId: courseId
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { message: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

// Handle GET requests (not allowed for delete endpoint)
export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}

// Handle POST requests (not allowed for delete endpoint)
export async function POST() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}

// Handle PUT requests (not allowed for delete endpoint)
export async function PUT() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}
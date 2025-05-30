/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Course from '@/app/models/Course';
import User from '@/app/models/User';
import { auth } from '../../../../auth';

export async function GET(req: NextRequest) {
    const session = await auth();

    console.log(session?.user.id);
    

    const course = await Course.find({userId : session?.user.id})
  return NextResponse.json(
      {
        course,
        courseIncluded: false, // User not logged in, so assume not purchased
      },
      { status: 200 }
    );
}
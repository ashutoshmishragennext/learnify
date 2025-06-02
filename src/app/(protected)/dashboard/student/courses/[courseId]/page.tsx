import React from 'react'
import dotenv from "dotenv";
import Navbar from '@/components/ui/Navbar';
import StudentCourse from './StudentCourse';
import { auth } from '../../../../../../../auth';
dotenv.config();

const page = async () => {
  const session = await auth();
  return (
    <div className="pt-[64px]">
      <Navbar session = {session}/>
      <StudentCourse />
    </div>
  )
}

export default page
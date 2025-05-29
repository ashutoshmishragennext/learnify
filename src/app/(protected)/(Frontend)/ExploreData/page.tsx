import React from 'react'
import dotenv from "dotenv";
import { auth } from '../../../../../auth';
import Navbar from '@/components/ui/Navbar';
import Courses from './Courses';
dotenv.config();

const page = async () => {
  const session = await auth();
  return (
    <div className="pt-[64px]">
      <Navbar session = {session}/>
      <Courses session={session} />
    </div>
  )
}

export default page
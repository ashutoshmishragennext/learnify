import React from 'react'
import dotenv from "dotenv";
import { auth } from '../../../../../../auth';
import Courses from './CoursePage';
import NavbarAdmin from '@/components/ui/NavbarAdmin';
dotenv.config();

const page = async () => {
  const session = await auth();
  return (
    <div className="pt-[64px]">
      <NavbarAdmin session = {session}/>
      <Courses session={session} />
    </div>
  )
}

export default page
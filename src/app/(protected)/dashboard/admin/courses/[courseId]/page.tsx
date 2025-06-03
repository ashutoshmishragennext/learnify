import React from 'react'
import dotenv from "dotenv";
import { auth } from '../../../../../../../auth';
import AdminCourse from './AdminCourse';
import NavbarAdmin from '@/components/ui/NavbarAdmin';
dotenv.config();

const page = async () => {
  const session = await auth();
  return (
    <div className="pt-[64px]">
      <NavbarAdmin session = {session}/>
      <AdminCourse />
    </div>
  )
}

export default page
import React from 'react'
import Courses from "@/app/ExploreData/Courses";
import dotenv from "dotenv";
import Navbar from '../../components/ui/Navbar';
import { auth } from '../../../auth';
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
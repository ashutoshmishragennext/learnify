import React from 'react'
import Navbar from '@/components/ui/Navbar';
import { auth } from '../../../../../../auth';
import Courses from '@/app/(protected)/(Frontend)/ExploreData/Courses';

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
import React from 'react'
import { auth } from '../../../../../../auth';
import Courses from '@/app/(protected)/(Frontend)/ExploreData/Courses';
import NavbarAdmin from '@/components/ui/NavbarAdmin';

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
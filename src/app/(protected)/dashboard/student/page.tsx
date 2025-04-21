import React from 'react'

import dotenv from "dotenv";
import Navbar from '@/components/ui/Navbar';
import Consist from '@/app/Consist';
import StatsBar from '@/components/StatsBar';
import PopularCourses from '@/app/PopularCourses';
import BenefitsSection from '@/app/BenifitsSection';
import Footer from '@/app/Footer/page';
import { auth } from '../../../../../auth';

dotenv.config();

const page = async () => {
  const session = await auth();
  return (
    <div className="pt-[64px]">
      <Navbar session = {session}/>
      <Consist/>
      <StatsBar/>
      <PopularCourses session={session}/>
      <BenefitsSection/>
      <Footer/>
    </div>
  )
}

export default page
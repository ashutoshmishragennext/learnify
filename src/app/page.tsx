import React from 'react'
import Navbar from '../components/ui/Navbar'
import StatsBar from '@/components/StatsBar'
import Footer from './Footer/page'
import BenefitsSection from './BenifitsSection'
import PopularCourses from './PopularCourses'
import Consist from './Consist'
import dotenv from "dotenv";
import { auth } from '../../auth';
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
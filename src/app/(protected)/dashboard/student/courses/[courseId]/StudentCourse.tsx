/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import CourseAccordion from '@/app/(protected)/(Frontend)/ParticularCourse/CourseAccordian'
import { useParams } from 'next/navigation';
import React from 'react'

const StudentCourse = async () => {
  const { courseId } = useParams();
    
  if(!courseId) 
    return <div>Please wait while we fetch the details of your course.</div>
  return (
    <div className=' space-y-4'>
    <CourseAccordion courseId = {courseId} />
  </div>
  )
}

export default StudentCourse

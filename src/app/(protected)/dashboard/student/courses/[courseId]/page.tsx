"use client"

import CourseAccordion from '@/app/(protected)/(Frontend)/ParticularCourse/CourseAccordian'
import { useParams } from 'next/navigation';
import React from 'react'

const page = () => {
  const { courseId } = useParams();
    
  if(!courseId) 
    return <div>Please wait while we fetch the details of your course.</div>
  return (
    <CourseAccordion courseId = {courseId} />
)
}

export default page
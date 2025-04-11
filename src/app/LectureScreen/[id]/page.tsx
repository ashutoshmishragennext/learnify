"use client"
import React from "react";
import Footer from "../../Footer/page";
import Navbar from "@/components/ui/Navbar";
import { auth } from "../../../../auth";
import LectureScreen from "./Lecture";
import { redirect, useParams } from "next/navigation";

// Next.js expects params to be a simple object, not a Promise


// Define the component with the correct parameter structure
const Page = () => {
  const session =  auth();
  const params =  useParams();
  const courseId = params.id as string;
  
  if (!session) {
    redirect("/login");
  }
  
  return (
    <div className="pt-[64px]">
      <Navbar session={session} />
      <LectureScreen courseId={courseId} />
      <Footer />
    </div>
  );
};

export default Page;
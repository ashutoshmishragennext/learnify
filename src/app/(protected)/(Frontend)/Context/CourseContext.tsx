"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { ICourse } from "@/app/models/Course";

interface CourseContextType {
  courseData: ICourse | null;
  setCourseData: (course: ICourse) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider = ({ children }: { children: ReactNode }) => {
  const [courseData, setCourseData] = useState<ICourse | null>(null);

  return (
    <CourseContext.Provider value={{ courseData, setCourseData }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourse must be used within a CourseProvider");
  }
  return context;
};

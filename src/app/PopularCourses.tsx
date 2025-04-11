"use client";
import React, { useEffect, useState } from "react";
import Card from "./ExploreData/Card";
import { ICourse } from "./models/Course";
import { Session } from "next-auth";

const PopularCourses: React.FC<{ session?: Session | null }> = ({ session }) => {
  const [courses, setCourses] = useState<ICourse[]>([]); //course need to be an array only in this case.
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
        try {
            const response = await fetch("/api/courses");
            const result = await response.json();

            // Check if response contains the expected data structure
            if (result.success && Array.isArray(result.data)) {
                setCourses(result.data); // Extract the 'data' array
            } else {
                console.error("API response is not an array:", result);
                setCourses([]); // Fallback to an empty array
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
            setCourses([]); // Fallback to an empty array
        } finally {
            setIsLoading(false);
        }
    };

    fetchCourses();
}, []);


  const topCourses = [...courses] // Create a shallow copy to avoid mutating the state
    .sort((a, b) => {
      const studentsA = a.studentsEnrolled || 0; // Ensure valid number
      const studentsB = b.studentsEnrolled || 0; // Ensure valid number
      return studentsB - studentsA;
    })
    .slice(0, 4);

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className=" bg-gray-100 py-1 px-6">
      {/* Header */}
      <div className="text-center mb-10 pt-5">
        <h1 className="text-4xl font-bold text-purple-800">Popular Courses</h1>
        <div className="flex justify-center mt-2">
          <svg width="130" height="25" viewBox="0 0 120 20" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 10 Q60 30 120 10"
              stroke="#7c3aed"
              strokeWidth="3"
              fill="none"
            />
          </svg>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {topCourses.map((course) => (
          <Card
            key={course.courseId}
            title={course.name}
            image={course.image}
            session={session}
            students={course.studentsEnrolled}
            price={course.price.current}
            originalPrice={course.price.original}
            description={course.shortDescription}
            // dateRange={course.duration}
            buttonLabel="View Detail"
            courseId={course.courseId}
          />
        ))}
      </div>
    </div>
  );
};

export default PopularCourses;

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Session } from "next-auth";
import { ICourse } from "@/app/models/Course";
import Footer from "@/app/(protected)/(Frontend)/Footer/page";
import CardRedirectForBuyCourses from "@/app/(protected)/(Frontend)/ExploreData/CardRedirectForBuyCourses";

interface Course {
  id: number;
  title: string;
  image: string;
  students: number;
  price: number;
  originalPrice: number;
  description: string;
  dateRange?: string;
  courseId: string;
  category: string;
}

const Courses: React.FC<{ session?: Session | null |  any }> = ({ session }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>("All Programmes");
  const [categories, setCategories] = useState<string[]>([]);
  const [showAllCategories, setShowAllCategories] = useState<boolean>(false);

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/userCourses");
      const data = await response.json();
      if (data.length > 0) {
        const formattedCourses = data.map((course: ICourse) => ({
          id: course.courseId,
          title: course.name,
          image: course.image,
          students: course.studentsEnrolled,
          price: course.price.current,
          originalPrice: course.price.original,
          description: course.shortDescription,
          dateRange: course.duration,
          courseId: course.courseId,
          category: course.category,
        }));
        setCourses(formattedCourses);
        
        const allCategories: string[] = data.data.map((course: ICourse) => course.category);
        const uniqueCategories: string[] = Array.from(new Set(allCategories)).filter(Boolean);
        setCategories(["All Programmes", ...uniqueCategories]);
      }
    } catch (error: unknown) {
      console.error("Error fetching courses:", error instanceof Error ? error.message : error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Filter courses based on the selected category
  const filteredCourses =
    activeCategory === "All Programmes"
      ? courses
      : courses.filter((course) => course.category === activeCategory);

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-10 px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-800">Explore Your Courses</h1>
          {/* Curved Line */}
          <div className="flex justify-center mt-2">
            <svg width="130" height="25" viewBox="0 0 120 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 10 Q60 30 120 10" stroke="#7c3aed" strokeWidth="3" fill="none" />
            </svg>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 overflow-x-auto px-2">
          {(showAllCategories ? categories : categories.slice(0, 4)).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 border rounded-full text-sm font-medium transition ${
                activeCategory === category
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-purple-100"
              }`}
            >
              {category}
            </button>
          ))}
          {/* Show "..." only if categories exceed 4 */}
          {categories.length > 4 && (
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="px-4 py-2 border rounded-full text-sm font-medium bg-gray-200 text-gray-700 hover:bg-purple-100"
            >
              {showAllCategories ? "Show Less" : "..."}
            </button>
          )}
        </div>

        {/* Grid Layout */}
        {loading ? (
          <div className="text-center text-lg">Loading courses...</div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {session && filteredCourses.map((course) => (
              <CardRedirectForBuyCourses
                key={course.id}
                session={session}
                title={course.title}
                image={course.image}
                students={course.students}
                price={course.price}
                originalPrice={course.originalPrice}
                description={course.description}
                buttonLabel="View Detail"
                courseId={course.courseId}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-lg">You haven&apos;t Purchased any Courses Yet</div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Courses;

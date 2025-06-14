"use client";

import React, { useEffect, useState } from "react";
import Card from "./Card";
import Footer from "../Footer/page";
import { Session } from "next-auth";
import { ICourse } from "@/app/models/Course";

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
  category: string[]; // Changed to array to match API response
}

const Courses: React.FC<{ session?: Session | null }> = ({ session }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>("All Programmes");
  const [categories, setCategories] = useState<string[]>([]);
  const [showAllCategories, setShowAllCategories] = useState<boolean>(false);

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/courses");
      const data = await response.json();
      if (data.success) {
        const formattedCourses = data.data.map((course: ICourse) => ({
          id: course.courseId,
          title: course.name,
          image: course.image,
          students: course.studentsEnrolled,
          price: course.price.current,
          originalPrice: course.price.original,
          description: course.shortDescription,
          dateRange: course.duration,
          courseId: course.courseId,
          category: course.category || [], // Handle undefined categories
        }));
        setCourses(formattedCourses);
        
        // Extract all unique categories from the array format
        const allCategories: string[] = [];
        data.data.forEach((course: ICourse) => {
          if (course.category && Array.isArray(course.category)) {
            allCategories.push(...course.category);
          }
        });
        
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

  // Filter courses based on the selected category (updated logic)
  const filteredCourses =
    activeCategory === "All Programmes"
      ? courses
      : courses.filter((course) => 
          course.category && course.category.includes(activeCategory)
        );

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-10 px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-800">Explore all Courses</h1>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <Card
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
          <div className="text-center text-lg">No courses available for this category.</div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Courses;
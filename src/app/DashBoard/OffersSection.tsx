"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { ICourse } from "../models/Course";

const OffersSection: React.FC = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startIndex, setStartIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  const [isHovered, setIsHovered] = useState(false);
  const [loadingStates, setLoadingStates] = useState<{ [key: number]: boolean }>({});
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courseOffers");
        if (!response.ok) throw new Error("Failed to fetch course offers");

        const data = await response.json();
        console.log("Fetched courses:", data);
        setCourses(data.data || []); // Fallback to empty array
        setLoading(false);
      } catch (err: unknown) {
        console.log(err);
        
        setError("Failed to load offers. Please try again.",);
        setLoading(false);
      }
    };
    setLoading(true);
    fetchCourses();
  }, []);

  useEffect(() => {
    const updateItemsPerSlide = () => {
      const width = window.innerWidth;
      let newItemsPerSlide = 3;
      if (width < 640) newItemsPerSlide = 1;
      else if (width < 1024) newItemsPerSlide = 2;
      if (newItemsPerSlide !== itemsPerSlide) {
        setItemsPerSlide(newItemsPerSlide);
      }
    };

    updateItemsPerSlide();
    window.addEventListener("resize", updateItemsPerSlide);
    return () => window.removeEventListener("resize", updateItemsPerSlide);
  }, [itemsPerSlide]);

  useEffect(() => {
    if (!isHovered && courses.length > 0) {
      const interval = setInterval(() => {
        setStartIndex((prev) => (prev + itemsPerSlide) % courses.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [startIndex, isHovered, itemsPerSlide, courses.length]);

  const nextSlide = () => {
    setStartIndex((prev) => (prev + itemsPerSlide) % courses.length);
  };

  const prevSlide = () => {
    setStartIndex((prev) => (prev - itemsPerSlide + courses.length) % courses.length);
  };

  const handleEnrollClick = (courseId: number) => {
    // Set loading state for the specific course
    setLoadingStates((prev) => ({ ...prev, [courseId]: true }));

    router.push(`/CourseContent/${courseId}`);
  };

  return (
    <div className="relative mt-8 px-6 py-8 bg-gradient-to-r from-purple-50 to-indigo-100 shadow-lg rounded-lg w-full max-w-6xl mx-auto flex flex-col items-center overflow-hidden">
      <p className="text-center text-2xl font-bold text-purple-700 mb-6" style={{ fontFamily: "'Irish Grover', cursive" }}>
        Something Special Just for You! 🎉
      </p>

      {loading && <p className="text-center text-gray-600">Loading offers...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div  
        className="relative flex items-center w-full max-w-6xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          onClick={prevSlide}
          className="absolute left-0 z-10 p-3 bg-purple-200 text-white rounded-full shadow-md hover:bg-purple-300 transition-all duration-300 focus:outline-none"
        >
          <FaChevronLeft size={24} />
        </button>

        <div className="w-full flex justify-center px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {courses.slice(startIndex, startIndex + itemsPerSlide).map((course) => (
              <motion.div
                key={course.courseId}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="w-full"
              >
                <Card className="relative flex flex-col shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 bg-white rounded-lg overflow-hidden transform hover:scale-105 h-[320px]">
                  <div className="relative w-full h-1/3 flex-shrink-0">
                    <Image src={course.image} alt={course.name} layout="fill" objectFit="cover" className="rounded-t-lg" />
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                      {course.price.discountPercentage}% OFF
                    </span>
                  </div>
                  <CardHeader className="flex-grow p-4 flex flex-col justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-800">{course.name}</CardTitle>
                    <CardDescription className="text-sm text-gray-600 mt-2">
                      {course.shortDescription ? 
                        (course.shortDescription.length > 50 
                          ? `${course.shortDescription.slice(0, 50)}...` 
                          : course.shortDescription) 
                        : ""}
                    </CardDescription>

                    <div className="flex justify-between items-center mt-4">
                      <p className="text-xs font-medium text-gray-500">By {course.authors.map(author => author.name).join(", ")}</p>
                      <button 
                        onClick={() => handleEnrollClick(course.courseId)} 
                        className="py-2 px-4 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-all duration-300 shadow-md"
                      >
                        {loadingStates[course.courseId] ? "Loading..." : "Enroll Now!"}
                      </button>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <button
          onClick={nextSlide}
          className="absolute right-0 z-10 p-3 bg-purple-200 text-white rounded-full shadow-md hover:bg-purple-300 transition-all duration-300 focus:outline-none"
        >
          <FaChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default OffersSection;
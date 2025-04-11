"use client";

import { useEffect, useState } from "react";

import Loader from "@/components/ui/Loader";

import { ICourse } from "../models/Course";
import ImageCard from "./ImageCard";
import NoCoursesAvailable from "./NoCoursesAvailable";
import OffersSection from "./OffersSection";

const DashboardContent = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const [fetchingUserCourses, setFetchingUserCourses] = useState<boolean>(false);
  // const router = useRouter();
  // const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setFetchingUserCourses(true);
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/userCourses");
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setCourses(data);
          } else {
            setIsEmpty(true);
          }
        } else {
          console.error("Failed to fetch courses");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setFetchingUserCourses(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="flex min-h-screen bg-white">
   
      {/* Main Content */}
      <div className="flex-1 p-4 md:pl-8">
        {/* Top Bar */}
        {/* <div className="flex flex-col sm:flex-row justify-between mr-2 ml-2 w-1/3 items-center mb-6 space-y-4 sm:space-y-0"> */}
        <div className="flex flex-col sm:flex-row justify-center items-center mx-auto w-1/3 mb-6 space-y-4 sm:space-y-0">

          <input
            type="text"
            placeholder="Search your Course here..."
            className="w-full sm:w-auto flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none"
          />
        </div>

        {/* Header Section */}
        {/* <div className="bg-purple-600 text-white p-4 rounded-lg mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold mb-4">
            Elevate Your Skills with Expert-Led Courses!
          </h2>
          <button
            className="bg-black text-white px-6 py-2 rounded-lg flex items-center space-x-2"
            onClick={() => {
              setLoading(true);
              router.push("ExploreData");
            }}
          >
            {loading ? "Loading..." : "More Courses"}
          </button>
        </div> */}

        {/* Offers Courses Section */}
        <OffersSection />

        {/* Enrolled Courses Section */}
        <h3 className="text-xl font-semibold mt-6 ml-8 mb-6">Enrolled Courses</h3>
        {isEmpty ? (
          <NoCoursesAvailable />
        ) : (
          <div className="grid grid-cols-1 ml-6 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {fetchingUserCourses ? (
              <Loader />
            ) : (
              courses.map((course) => (
                <div
                  key={course.courseId}
                  className="bg-white shadow-md rounded-lg p-4 flex flex-col h-full"
                >
                  {/* Course Card */}
                  <ImageCard course={course} />

                  {/* Progress Bar (Always at Bottom) */}
                  <div className="mt-auto">
                    <p className="text-sm font-semibold text-gray-600">
                      Completion: {course.progress || 0}%
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${course.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardContent;

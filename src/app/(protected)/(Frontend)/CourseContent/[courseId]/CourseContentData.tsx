"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ICourse } from "@/app/models/Course";
import formatDuration from "@/lib/formatDuration";
import { FaPlay, FaVideo } from "react-icons/fa";

interface CoursePageProps {
  course: ICourse;
}

const CourseContentData: React.FC<CoursePageProps> = ({ course }) => {
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  const [showVideo, setShowVideo] = useState<boolean>(false);
  let countLessons = 0;

  course.modules.forEach((module) => {
    countLessons += module.subModulePart;
  });

  const toggleSection = (index: number) => {
    setExpandedSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Get the demo video URL
  const demoVideo = course.mediaContent?.find(media => media.type === "video")?.url;

  return (
    <div className="p-6 bg-gray-100">
      <div className="flex items-center mb-6">
        <hr className="border-2 border-t-4 w-20 border-purple-600" />
        <h2 className="text-2xl font-bold text-purple-700 ms-5 mb-3">
          Course Content
        </h2>
      </div>

      {/* Demo Video Section */}
      {demoVideo && (
        <div className="mb-8 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4">
            <div className="flex items-center space-x-3">
              <FaVideo className="text-white text-xl" />
              <h3 className="text-xl font-semibold text-white">Course Preview</h3>
            </div>
          </div>
          
          <div className="p-6">
            {!showVideo ? (
              <div className="relative">
                <div className="aspect-video h-full  bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="grid grid-cols-8 grid-rows-6 h-full ">
                      {Array.from({ length: 48 }).map((_, i) => (
                        <div key={i} className="border border-white/20"></div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Play button */}
                  <button
                    onClick={() => setShowVideo(true)}
                    className="relative z-10 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-6 transition-all duration-300 transform hover:scale-110 shadow-2xl group"
                  >
                    <FaPlay className="text-3xl ml-1" />
                    <div className="absolute inset-0 rounded-full bg-purple-600 animate-ping opacity-75 group-hover:opacity-0"></div>
                  </button>
                  
                  {/* Course title overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
                      <h4 className="text-white font-semibold text-lg">{course.name}</h4>
                      <p className="text-gray-300 text-sm">{course.shortDescription}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setShowVideo(true)}
                    className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
                  >
                    <FaPlay className="text-sm" />
                    <span>Watch Course Preview</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                  <video
                    controls
                    className="w-full h-full object-cover"
                    poster="/api/placeholder/800/450"
                  >
                    <source src={demoVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-gray-800">{course.name} - Preview</h4>
                    <p className="text-gray-600 text-sm">{course.shortDescription}</p>
                  </div>
                  <button
                    onClick={() => setShowVideo(false)}
                    className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded border border-gray-300 hover:border-gray-400 transition-colors"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <h1 className="text-3xl font-semibold mb-4">
        Our courses are a balanced mix of videos & assignments
      </h1>
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
        <Link href="#">{countLessons} Lessons</Link>
        <Link href="#">• {course.totalVideoLectures} Videos</Link>
        <Link href="#">• {course.totalAssignments} Assignments</Link>
      </div>
      <div className="space-y-4">
        {course.modules.map((module, moduleNumber) => (
          <div key={moduleNumber} className="bg-white p-4 rounded shadow">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection(moduleNumber)}
            >
              <h3 className="font-semibold flex items-center space-x-2">
                <span>{expandedSections.includes(moduleNumber) ? "–" : "+"}</span>
                <span>{module.moduleTitle}</span>
              </h3>
              <span className="text-gray-500">
                {module.subModulePart} Sections, {formatDuration(module.moduleDuration)}
              </span>
            </div>
            {expandedSections.includes(moduleNumber) && (
              <div className="mt-4 space-y-2">
                {module.subModules && Array.isArray(module.subModules) && module.subModules.length > 0 ? (
                  module.subModules.map((submodule, sModuleNumber) => (
                    <div
                      key={sModuleNumber}
                      className="flex justify-between items-center border-t pt-2"
                    >
                      <p className="flex items-center space-x-2">
                        <span className="text-blue-500">•</span>
                        <span>{submodule.sModuleTitle}</span>
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">
                          {formatDuration(submodule.sModuleDuration, true)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No lessons available.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseContentData;
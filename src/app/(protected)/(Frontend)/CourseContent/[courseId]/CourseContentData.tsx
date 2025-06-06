/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
// import Link from "next/link";
import { ICourse } from "@/app/models/Course";
import formatDuration from "@/lib/formatDuration";
import { FaPlay, FaVideo, FaFileAlt, FaBookOpen } from "react-icons/fa";

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
                  {demoVideo.startsWith("https://res.cloudinary.com") &&
                    <video
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                    poster="/api/placeholder/800/450"
                  >
                    <source src={demoVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  }
                    { demoVideo.startsWith("https://odysee.com") && 
                      <iframe
                      id="odysee-iframe"
                      className="w-full aspect-video"
                      src= {demoVideo}
                      allowFullScreen
                      // title= {selectedVideo.sModuleTitle}
                    />
                    }
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
        <span>{countLessons} Lessons</span>
        <span>• {course.totalVideoLectures} Videos</span>
        <span>• {course.totalAssignments} Assignments</span>
      </div>

      <div className="space-y-4">
        {course.modules.map((module, moduleNumber) => (
          <div key={moduleNumber} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div
              className="flex justify-between items-center cursor-pointer p-4 hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection(moduleNumber)}
            >
              <div className="flex-1">
                <h3 className="font-semibold flex items-center space-x-3">
                  <span className="text-lg">{expandedSections.includes(moduleNumber) ? "−" : "+"}</span>
                  <span className="text-lg">{module.moduleTitle}</span>
                </h3>
                {/* Module Description */}
                {module.description && (
                  <p className="text-gray-600 text-sm mt-2 ml-8">{module.description}</p>
                )}
              </div>
              <div className="text-right">
                <span className="text-gray-500 text-sm">
                  {module.subModulePart} Sections
                </span>
                {module.moduleDuration > 0 && (
                  <div className="text-gray-500 text-sm">
                    {module.moduleDuration}h duration
                  </div>
                )}
              </div>
            </div>

            {expandedSections.includes(moduleNumber) && (
              <div className="border-t bg-gray-50">
                {module.subModules && Array.isArray(module.subModules) && module.subModules.length > 0 ? (
                  <div className="p-4 space-y-3">
                    {module.subModules.map((submodule, sModuleNumber) => (
                      <div
                        key={sModuleNumber}
                        className="bg-white rounded-lg p-4 border border-gray-200 hover:border-purple-300 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <span className="text-purple-500 font-bold">
                                {sModuleNumber + 1}.
                              </span>
                              <h4 className="font-semibold text-gray-800">
                                {submodule.sModuleTitle}
                              </h4>
                            </div>
                            
                            {/* Submodule Description */}
                            {submodule.description && (
                              <div className="mt-2 ml-6">
                                <div className="flex items-center space-x-2 mb-1">
                                  <FaBookOpen className="text-purple-500 text-sm" />
                                  <span className="text-sm font-medium text-gray-700">Description:</span>
                                </div>
                                <p className="text-gray-600 text-sm ml-6">{submodule.description}</p>
                              </div>
                            )}

                            {/* Additional Resources */}
                            <div className="mt-3 ml-6 flex flex-wrap gap-4">
                              {submodule.videoLecture && (
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <FaVideo className="text-blue-500" />
                                  <span>Video Lecture Available</span>
                                </div>
                              )}
                              {submodule.attachedPdf && (
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <FaFileAlt className="text-red-500" />
                                  <span>PDF Resource Available</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="text-right ml-4">
                            {submodule.sModuleDuration > 0 && (
                              <span className="text-gray-500 text-sm">
                                {formatDuration(submodule.sModuleDuration, true)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    <FaBookOpen className="mx-auto text-2xl mb-2 opacity-50" />
                    <p>No lessons available for this module yet.</p>
                  </div>
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
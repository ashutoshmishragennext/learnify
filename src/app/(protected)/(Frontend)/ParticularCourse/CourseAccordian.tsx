"use client";

import React, { useEffect, useState } from "react";
import { FaPlay, FaDownload, FaFileAlt, FaBookOpen, FaArrowLeft } from "react-icons/fa";

interface SubModule {
  sModuleNumber: number;
  sModuleTitle: string;
  sModuleDuration: number;
  videoLecture: string;
  videoType: string;
  description: string;
  attachedPdf: string;
  _id: string;
}

interface Module {
  moduleNumber: number;
  moduleTitle: string;
  moduleDuration: number;
  subModulePart: number;
  reward: number;
  description: string;
  subModules: SubModule[];
  _id: string;
}

interface CourseData {
  _id: string;
  name: string;
  modules: Module[];
  // Add other course properties as needed
}

interface ApiResponse {
  course: CourseData;
  courseIncluded: boolean;
  cartIncluded: boolean;
  wishlistIncluded: boolean;
}

interface CourseAccordionProps {
  courseId?: string | string[];
}

const CourseAccordion: React.FC<CourseAccordionProps> = ({ courseId }) => {
  const [openModule, setOpenModule] = useState<number | null>(null);
  const [data, setData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<SubModule | null>(null);
  const [courseIncluded, setCourseIncluded] = useState<boolean>(false);

  useEffect(() => {
    const getCourseVideos = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/course", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId
          }),
        });

        const responseData: ApiResponse = await response.json();
        setData(responseData.course);
        setCourseIncluded(responseData.courseIncluded);
      } catch (error) {
        console.error("Error fetching course data:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      getCourseVideos();
    }
  }, [courseId]);

  const toggleModule = (moduleNumber: number) => {
    setOpenModule((prev) => (prev === moduleNumber ? null : moduleNumber));
  };

  // Convert duration from seconds to minutes
  const formatDuration = (seconds: number): string => {
    // if (seconds === 0) return "Coming soon";
    if(seconds === 0) return "0"
    const minutes = Math.round(seconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };

  const handleVideoClick = (subModule: SubModule) => {
    if (courseIncluded) {
      setSelectedVideo(subModule);
    }
  };

  const handleBackToList = () => {
    setSelectedVideo(null);
  };

  const handlePdfDownload = (pdfUrl: string, title: string) => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${title}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Loading state
  if (loading) {
    return (
      <div className="relative flex flex-col lg:flex-row max-w-screen-xl mx-auto px-4 py-8 gap-8">
        <div className="flex-1 lg:w-2/3">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading course data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data || !data.modules || data.modules.length === 0) {
    return null;
  }

  // Video player view with sidebar
  if (selectedVideo) {
    return (
      <div className="relative max-w-screen-xl mx-auto px-4 py-8">
        {/* Mobile back button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={handleBackToList}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            <FaArrowLeft />
            <span>Back to Course</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Video Section - Left on desktop, full width on mobile */}
          <div className="flex-1 lg:w-2/3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4">
                <h2 className="text-xl font-bold text-white">
                  {selectedVideo.sModuleTitle}
                </h2>
                <p className="text-purple-100 text-sm mt-1">
                  Duration: {formatDuration(selectedVideo.sModuleDuration)}
                </p>
              </div>
              
              <div className="aspect-video bg-black">
                {selectedVideo.videoLecture.startsWith("https://res.cloudinary.com") && (
                  <video
                    controls
                    className="w-full h-full"
                    src={selectedVideo.videoLecture}
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
                {selectedVideo.videoLecture.startsWith("https://odysee.com") && (
                  <iframe
                    className="w-full h-full"
                    src={selectedVideo.videoLecture}
                    allowFullScreen
                    title={selectedVideo.sModuleTitle}
                  />
                )}
              </div>

              {/* Description below video on mobile */}
              <div className="lg:hidden p-6">
                {selectedVideo.description && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <FaBookOpen className="mr-2 text-purple-600" />
                      Description
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedVideo.description}
                    </p>
                  </div>
                )}
                
                {selectedVideo.attachedPdf && (
                  <button
                    onClick={() => handlePdfDownload(selectedVideo.attachedPdf, selectedVideo.sModuleTitle)}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition w-full justify-center"
                  >
                    <FaDownload />
                    <span>Download PDF Resource</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Right on desktop, hidden on mobile (content shown below video) */}
          <div className="hidden lg:block lg:w-1/3">
            <div className="bg-white rounded-lg shadow-lg sticky top-8">
              {/* Back button for desktop */}
              <div className="p-4 border-b">
                <button
                  onClick={handleBackToList}
                  className="flex items-center space-x-2 px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition w-full"
                >
                  <FaArrowLeft />
                  <span>Back to Course</span>
                </button>
              </div>

              
              {/* Course Navigation */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Course Navigation</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {data.modules.map((module) => (
                    <div key={module._id}>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">
                        {module.moduleTitle}
                      </h4>
                      {module.subModules.map((subModule) => (
                        <button
                          key={subModule._id}
                          onClick={() => handleVideoClick(subModule)}
                          className={`w-full text-left text-xs p-2 rounded mb-1 transition ${
                            selectedVideo._id === subModule._id
                              ? 'bg-purple-100 text-purple-700 border-l-2 border-purple-600'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {subModule.sModuleTitle}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

             
              {/* PDF Download */}
              {selectedVideo.attachedPdf && (
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <FaFileAlt className="mr-2 text-red-600" />
                    Resources
                  </h3>
                  <button
                    onClick={() => handlePdfDownload(selectedVideo.attachedPdf, selectedVideo.sModuleTitle)}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition w-full justify-center text-sm"
                  >
                    <FaDownload />
                    <span>Download PDF</span>
                  </button>
                </div>
              )}

               {/* Content Description */}
              {selectedVideo.description && (
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <FaBookOpen className="mr-2 text-purple-600" />
                    Description
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {selectedVideo.description}
                  </p>
                </div>
              )}


            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main course accordion view
  return (
    <div className="relative flex flex-col lg:flex-row max-w-screen-xl mx-auto px-4 py-8 gap-8">
      {/* Left Section: Accordion */}
      <div className="flex-1 lg:w-2/3 space-y-4">
        <h1 className="text-3xl font-bold text-purple-800 mb-6">
          {data.name}
        </h1>
        
        {!courseIncluded && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              <strong>Note:</strong> You need to enroll in this course to access the video content.
            </p>
          </div>
        )}

        <div className="bg-white border border-gray-300 rounded-lg shadow-lg divide-y divide-gray-200">
          {data.modules.map((module) => (
            <div key={module._id}>
              {/* Accordion Header */}
              <button
                className={`w-full flex justify-between items-center px-6 py-4 ${
                  openModule === module.moduleNumber
                    ? "bg-purple-100 text-purple-800 border-l-4 border-purple-600"
                    : "bg-white text-gray-900"
                } hover:bg-purple-50 transition`}
                onClick={() => toggleModule(module.moduleNumber)}
              >
                <div className="flex flex-col text-left flex-1">
                  <span className="font-medium text-lg">
                    {module.moduleNumber}. {module.moduleTitle}
                  </span>
                  {module.description && (
                    <span className="text-sm text-gray-600 mt-1">
                      {module.description}
                    </span>
                  )}
                  <span className="text-sm text-gray-500 mt-1">
                    0/{module.subModules.length} · {formatDuration(module.moduleDuration * 60)} · Reward: {module.reward} points
                  </span>
                </div>
                <span
                  className={`transform transition-transform ml-4 ${
                    openModule === module.moduleNumber
                      ? "rotate-90 text-purple-600"
                      : "text-gray-500"
                  }`}
                >
                  ▶
                </span>
              </button>

              {/* Accordion Content */}
              {openModule === module.moduleNumber && module.subModules && (
                <div className="bg-purple-50 px-6 py-4 space-y-4">
                  {module.subModules.map((subModule) => (
                    <div key={subModule._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      {/* Video Lecture Section */}
                      <div
                        className={`flex justify-between items-center px-4 py-3 ${
                          courseIncluded 
                            ? "bg-purple-600 text-white cursor-pointer hover:bg-purple-700" 
                            : "bg-gray-400 text-gray-200 cursor-not-allowed"
                        } transition`}
                        onClick={() => courseIncluded && handleVideoClick(subModule)}
                      >
                        <div className="flex items-center space-x-3">
                          <FaPlay className={courseIncluded ? "text-white" : "text-gray-300"} />
                          <span className="font-medium">{subModule.sModuleTitle}</span>
                        </div>
                        <span className="text-sm">
                          {formatDuration(subModule.sModuleDuration)}
                        </span>
                      </div>

                      {/* Description and Resources */}
                      <div className="p-4 space-y-3">
                        {subModule.description && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                              <FaBookOpen className="mr-2 text-purple-600" />
                              Description
                            </h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {subModule.description}
                            </p>
                          </div>
                        )}

                        {subModule.attachedPdf && (
                          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <FaFileAlt className="text-red-600" />
                              <span className="text-sm font-medium text-gray-700">
                                PDF Resource Available
                              </span>
                            </div>
                            <button
                              onClick={() => handlePdfDownload(subModule.attachedPdf, subModule.sModuleTitle)}
                              className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                            >
                              <FaDownload className="text-xs" />
                              <span>Download</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Section: Course Info (visible only when not playing video) */}
      <div className="lg:w-1/3">
        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Course Overview</h3>
          
          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium text-gray-600">Total Modules:</span>
              <span className="ml-2 text-gray-800">{data.modules.length}</span>
            </div>
            
            <div>
              <span className="text-sm font-medium text-gray-600">Total Lessons:</span>
              <span className="ml-2 text-gray-800">
                {data.modules.reduce((total, module) => total + module.subModules.length, 0)}
              </span>
            </div>

            <div>
              <span className="text-sm font-medium text-gray-600">Status:</span>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                courseIncluded 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {courseIncluded ? 'Enrolled' : 'Not Enrolled'}
              </span>
            </div>
          </div>

          {!courseIncluded && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-sm">
                Enroll in this course to access all video lectures and downloadable resources.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseAccordion;
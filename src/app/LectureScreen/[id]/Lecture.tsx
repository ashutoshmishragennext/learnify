"use client";

import { ICourse } from "@/app/models/Course";
import formatDuration from "@/lib/formatDuration";
import React, { useEffect, useState } from "react";
import Question from "./Q&A";
import Reviews from "./Reviews"
import Announcement from "./Announcement";
import NotesPage from "./Notes";

interface ParamsId {
  courseId: string | null | undefined;
}

const LectureScreen: React.FC<ParamsId> = ({ courseId }) => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [lectureData, setLectureData] = useState<ICourse | null>(null);
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  const [currentVideo, setCurrentVideo] = useState<string>("");
  const [selectedSubmodule, setSelectedSubmodule] = useState<{ moduleIndex: number; submoduleIndex: number } | null>(null);

  const toggleSection = (index: number) => {
    setExpandedSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        const response = await fetch(`/api/courseLectures`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId }),
        });

        if (!response.ok) throw new Error("Failed to fetch course data");

        const data = await response.json();
        setLectureData(data.course);
        
        // Set default video to first available submodule
        if (data.course.modules.length > 0 && 
            data.course.modules[0].subModules && 
            Array.isArray(data.course.modules[0].subModules) && 
            data.course.modules[0].subModules.length > 0) {
          setCurrentVideo(data.course.modules[0].subModules[0].videoLecture || "");
        }
      } catch (error) {
        console.error("Error fetching lecture data:", error);
      }
    };

    if (courseId) fetchLecture();
  }, [courseId]);

  return (
    <div className="flex flex-col gap-6 font-sans px-4 lg:px-10 py-6">
      {/* Video Section */}
      {lectureData && (
        <>
          <div className="relative text-center">
            <video
              className="w-full max-w-5xl mx-auto rounded-xl shadow-lg"
              controls
              src={currentVideo}
            >
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Details Section */}
          <div className="bg-white shadow-md rounded-lg p-5">
            {/* Tabs Navigation */}
            <nav className="flex gap-4 border-b border-gray-300 pb-3 overflow-x-auto">
              {["Overview", "Q&A", "Notes", "Announcements", "Reviews"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2 text-sm sm:text-base font-medium transition-all rounded-t-md ${
                      activeTab === tab
                        ? "border-b-2 border-blue-600 font-semibold text-blue-600"
                        : "text-gray-500 hover:text-blue-500"
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </nav>

            {/* Tab Content */}
            <div className="mt-5 text-gray-700">
              <h2 className="text-lg font-semibold">{activeTab}</h2>
              {activeTab === "Overview" && (
                <div className="space-y-4">
                  {lectureData.modules.map((module, moduleNumber) => (
                    <div key={moduleNumber} className="bg-white p-4 rounded shadow">
                      <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => toggleSection(moduleNumber)}
                      >
                        <h3 className="font-semibold flex items-center space-x-2">
                          <span>
                            {expandedSections.includes(moduleNumber) ? "–" : "+"}
                          </span>
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
                                className={`flex justify-between items-center border-t pt-2 px-2 py-1 cursor-pointer ${
                                  selectedSubmodule?.moduleIndex === moduleNumber &&
                                  selectedSubmodule?.submoduleIndex === sModuleNumber
                                    ? "bg-blue-100"
                                    : "hover:bg-gray-100"
                                }`}
                                onClick={() => {
                                  setCurrentVideo(submodule.videoLecture || "");
                                  setSelectedSubmodule({
                                    moduleIndex: moduleNumber,
                                    submoduleIndex: sModuleNumber,
                                  });
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                              >
                                <p className="flex items-center space-x-2">
                                  <span className="text-500">▶</span>
                                  <span>{submodule.sModuleTitle}</span>
                                </p>
                                <span className="text-gray-500">
                                {formatDuration(submodule.sModuleDuration, true)}
                                </span>
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
              )}
                {/* Reviews Section */}
                {activeTab === "Reviews" && <Reviews />}
              {/* Q&A Section */}
              {activeTab === "Q&A" && <Question />}
                {/* Announcement Section */}
                {activeTab === "Announcements" && <Announcement />}
                 {/* Notes Section */}
              {activeTab === "Notes" && <NotesPage />}
              <div className="mt-5 flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="font-semibold text-yellow-500">
                  ⭐ {lectureData.ratings.average}
                </span>
                <span>{lectureData.studentsEnrolled} Students</span>
                <span>{lectureData.duration} Hours</span>
                <span>{lectureData.ratings.totalRatings} Reviews</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LectureScreen;
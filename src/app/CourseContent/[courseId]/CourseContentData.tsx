"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ICourse } from "@/app/models/Course";
import formatDuration from "@/lib/formatDuration";

interface CoursePageProps {
  course: ICourse;
}

const CourseContentData: React.FC<CoursePageProps> = ({ course }) => {
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  let countLessons = 0;

  course.modules.forEach((module) => {
    countLessons += module.subModulePart;
  });

  const toggleSection = (index: number) => {
    setExpandedSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="p-6 bg-gray-100">
      <div className="flex items-center mb-6">
        <hr className="border-2 border-t-4 w-20 border-purple-600" />
        <h2 className="text-2xl font-bold text-purple-700 ms-5 mb-3">
          Course Content
        </h2>
      </div>
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
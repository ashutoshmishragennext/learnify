"use client";

import React, { useState } from "react";
import { FaPlay } from "react-icons/fa";


interface Lecture {
  title: string;
  duration: string;
  assignment?: string;
  subheading: string;
}

interface Module {
  id: number;
  title: string;
  totalLectures: number;
  lecturecompleted: number;
  totalTime: string;
  lectures?: Lecture[];
}

const modules: Module[] = [
  {
    id: 1,
    title: "bags",
    totalLectures: 6,
    lecturecompleted: 0,
    totalTime: "15 minutes",
    lectures: [
      {
        title: "Lecture 1",
        duration: "25 minutes",
        assignment: "Last Date: 19/11/24",
        subheading: "1.1",
      },
      {
        title: "Lecture 2",
        duration: "20 minutes",
        assignment: "Not Assigned Yet",
        subheading: "1.2",
      },
    ],
  },

  {
    id: 2,
    title: "Tags",
    totalLectures: 4,
    lecturecompleted: 0,
    totalTime: "10 minutes",
    lectures: [
      {
        title: "Lecture 1",
        duration: "25 minutes",
        assignment: "Last Date: 19/11/24",
        subheading: "2.1",
      },
      {
        title: "Lecture 2",
        duration: "20 minutes",
        assignment: "Last date:19/12/2024.",
        subheading: "2.2",
      },
    ],
  },
  {
    id: 3,
    title: "Bags",
    totalLectures: 4,
    lecturecompleted: 0,
    totalTime: "10 minutes",
    lectures: [
      {
        title: "Lecture 1",
        duration: "25 minutes",
        assignment: "Last Date: 19/11/24",
        subheading: "3.1",
      },
      {
        title: "Lecture 2",
        duration: "45 minutes",
        assignment: "Last date:19/12/2024.",
        subheading: "3.2",
      },
    ],
  },

];

const CourseAccordion: React.FC = () => {
  const [openModule, setOpenModule] = useState<number | null>(null);

  const toggleModule = (id: number) => {
    setOpenModule((prev) => (prev === id ? null : id));
  };

  return (
    <div className="relative flex flex-col lg:flex-row max-w-screen-xl mx-auto px-4 py-8 gap-8">
      {/* Left Section: Accordion */}
      <div className="flex-1 lg:w-2/3 space-y-4">
        <h1 className="text-3xl font-bold text-purple-800 mb-6">
          Beginner’s Guide To Becoming A Professional Frontend Developer
        </h1>
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg divide-y divide-gray-200">
          {modules.map((module) => (
            <div key={module.id}>
              {/* Accordion Header */}
              <button
                className={`w-full flex justify-between items-center px-6 py-4 ${
                  openModule === module.id
                    ? "bg-purple-100 text-purple-800 border-l-4 border-purple-600"
                    : "bg-white text-gray-900"
                } hover:bg-purple-50 transition`}
                onClick={() => toggleModule(module.id)}
              >
                <div className="flex flex-col text-left">
                  <span className="font-medium">
                    {module.id}. {module.title}
                  </span>
                  <span className="text-sm text-gray-500">
                    {module.lecturecompleted}/{module.totalLectures} ·{" "}
                    {module.totalTime}
                  </span>
                </div>
                <span
                  className={`transform transition-transform ${
                    openModule === module.id
                      ? "rotate-90 text-purple-600"
                      : "text-gray-500"
                  }`}
                >
                  ▶
                </span>
              </button>

              {/* Accordion Content */}
              {openModule === module.id && module.lectures && (
                <div className="bg-purple-50 px-6 py-4 space-y-6">
                  {module.lectures.map((lecture, index) => (
                    <div key={index} className="space-y-4">
                      {/* Main Lecture Section */}
                      <div
                        className="flex justify-between items-center bg-purple-600 px-4 py-3 rounded-lg shadow-md text-white cursor-pointer hover:bg-purple-700 transition"
                        onClick={() =>
                          alert(`Clicked on ${lecture.title} - Duration: ${lecture.duration}`)
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <FaPlay />
                          <span>{lecture.title}</span>
                        </div>
                        <span>{lecture.duration}</span>
                      </div>

                      {/* Subheading Section */}
                      <div
                        className="flex justify-between items-center px-4 py-2 bg-white rounded-lg shadow-md cursor-pointer hover:bg-purple-100 transition"
                        onClick={() =>
                          alert(
                           ` Assignment for ${lecture.subheading}: ${lecture.assignment}`
                          )
                        }
                      >
                        <span className="text-gray-800 font-medium">
                          {lecture.subheading}. Assignment
                        </span>
                        <span className="text-gray-500 text-sm">
                          {lecture.assignment}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

     
     
    </div>
  );
};

export default CourseAccordion;
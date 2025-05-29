"use client"; // Now only needed here

import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

interface Assessment {
  id: number;
  moduleTitle: string;
  topicTitle: string;
  submissionDate?: string;
  cashback?: string;
  quality?: number | "Not Applicable";
  lastDate?: string;
}

const assessments: Assessment[] = [
  {
    id: 1,
    moduleTitle: "Course Overview",
    topicTitle: "Webpage Skeleton",
    submissionDate: "11/11/2024",
    cashback: "₹ 500",
    quality: 4,
    lastDate: "12/11/2024",
  },
  {
    id: 2,
    moduleTitle: "Planning for Success",
    topicTitle: "Responsive Webpage",
    submissionDate: "20/11/2024", // Late submission
    cashback: "₹ 750",
    quality: "Not Applicable",
    lastDate: "19/11/2024",
  },
  {
    id: 3,
    moduleTitle: "Planning for Success Part 2",
    topicTitle: "Topic 3",
    submissionDate: undefined, // Not submitted
    cashback: "₹ 1000",
    quality: undefined,
    lastDate: "26/11/2024",
  },
];

const isSubmissionLate = (
  submissionDate?: string,
  lastDate?: string
): boolean => {
  if (!submissionDate || !lastDate) return false;
  const submission = new Date(submissionDate);
  const deadline = new Date(lastDate);
  return submission > deadline;
};

const RewardsPage: React.FC = () => {
  const renderStars = (quality: number | "Not Applicable" | undefined) => {
    if (!quality) {
      return <span className="text-gray-500 font-medium">-</span>;
    }
    if (quality === "Not Applicable") {
      return <span className="text-red-500 font-semibold">Not Applicable</span>;
    }
    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: 5 }).map((_, index) =>
          index < quality ? (
            <FaStar key={index} className="text-yellow-500" />
          ) : (
            <FaRegStar key={index} className="text-gray-300" />
          )
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col p-6">
      <h1 className="text-3xl font-bold text-purple-800 mb-2">
        Case Study based Assessments
      </h1>
      <hr className="border-t-2 border-purple-300 mb-6" />
      <div className="bg-purple-100 text-purple-900 p-6 rounded-lg shadow-md mb-8">
        <p className="text-lg leading-relaxed">
          Engage in interactive, real-world case studies designed to enhance
          your learning experience. Complete assessments on time and score
          stars above 3 to earn exciting cashback rewards! Unlock knowledge
          while being rewarded for your hard work and dedication.
        </p>
      </div>

      {/* Assessments */}
      <div className="space-y-6">
        {assessments.map((assessment) => {
          const isLate = isSubmissionLate(
            assessment.submissionDate,
            assessment.lastDate
          );

          const displayQuality =
            assessment.submissionDate && isLate
              ? "Not Applicable"
              : assessment.submissionDate
              ? assessment.quality
              : undefined; // Not submitted

          return (
            <div
              key={assessment.id}
              className="p-4 border border-gray-300 rounded-lg shadow-lg bg-white"
            >
              {/* Top Section */}
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-purple-800">
                    {assessment.id < 10 ? `0${assessment.id}` : assessment.id}
                  </span>
                  <h3 className="text-lg font-semibold text-purple-700">
                    {assessment.moduleTitle}
                  </h3>
                </div>
                <span className="text-sm text-red-500 font-semibold">
                  Last Date: {assessment.lastDate}
                </span>
              </div>
              <hr className="border-t border-gray-950 mb-4" />

              {/* Topic Section */}
              <div className="flex items-center justify-between mb-4">
                {/* Left Section: Submission Date */}
                <div>
                  <span className="text-sm text-gray-600 font-medium">
                    Submission Date:{" "}
                    {assessment.submissionDate || "Not Submitted"}
                  </span>
                </div>

                {/* Center Section: Topic Title */}
                <h4
                  className="text-blue-700 font-semibold text-base cursor-pointer hover:underline text-center"
                  title="Click to view details"
                >
                  {assessment.topicTitle}
                </h4>

                {/* Right Section: Quality */}
                <div className="text-right">
                  <h2 className="text-sm text-gray-600 font-medium">
                    Quality of Assessment:
                  </h2>
                  {renderStars(displayQuality)}
                </div>
              </div>

              {/* Cashback Section */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-600 font-medium">
                    Cashback:
                  </span>{" "}
                  <span
                    className={`${
                      isLate ? "text-red-500 line-through" : "text-purple-600"
                    } font-semibold`}
                  >
                    {isLate ? "Not Applicable" : assessment.cashback}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RewardsPage;

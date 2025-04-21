
"use client";
import React, { useState } from "react";
import Breakdown from "./Breakdown";
import CoursePage from "./CoursePage";
import CardTemplateForm from "./CardTemplateForm"; // Importing CardTemplateForm

const AdminCoursePage: React.FC = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const tabs = ["Card Template", "Intro Page", "Breakdown"];

  return (
    <div className="min-h-screen w-full bg-gray-100">
      {/* Main Content */}
      <main className="flex-1 p-2">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-6">
          <input
            type="text"
            placeholder="Search your course here..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
          <button className="ml-4 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800">
            Add
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setActiveTabIndex((prev) => Math.max(prev - 1, 0))}
            className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"
          >
            &lt;
          </button>
          {tabs.map((tab, index) => (
            <button
              key={tab}
              className={`flex-1 mx-2 px-4 py-2 text-center rounded-lg ${
                activeTabIndex === index
                  ? "bg-purple-700 text-white"
                  : "bg-purple-200 text-gray-700 hover:bg-purple-100 hover:text-purple-700"
              }`}
              onClick={() => setActiveTabIndex(index)}
            >
              {tab}
            </button>
          ))}
          <button
            onClick={() => setActiveTabIndex((prev) => Math.min(prev + 1, tabs.length - 1))}
            className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"
          >
            &gt;
          </button>
        </div>

        {/* Tab Content */}
        {activeTabIndex === 0 && (
          <div>
            <h2 className="text-2xl font-bold text-purple-700 mb-4">Course Card Template</h2>
            <CardTemplateForm /> {/* Render the CardTemplateForm component */}
          </div>
        )}

        {activeTabIndex === 1 && (
          <div>
           
            <CoursePage />
          </div>
        )}

        {activeTabIndex === 2 && (
          <div>
            
            <Breakdown />
          </div>
        )}

        {/* Update Button */}
        {/* <div className="flex justify-center items-center">
          <button className="px-4 py-2 my-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Update
          </button>
        </div> */}
      </main>
    </div>
  );
};

export default AdminCoursePage;
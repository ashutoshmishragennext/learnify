"use client";
import React, { useState } from "react";
import Breakdown from "./Breakdown";
import CoursePage from "./CoursePage";
import CardTemplateForm from "./CardTemplateForm"; // Importing CardTemplateForm
import Sidebar2 from "./Sidebar2";

const AdminCoursePage: React.FC = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  return (
    <div className="flex bg-gray-100 mt-4 min-h-screen">
      <div className="w-64 sticky top-4 self-start h-fit">
        <Sidebar2 setActiveTabIndex={setActiveTabIndex} activeTabIndex={activeTabIndex} />
      </div>
      <main className="flex-1 p-2 pt-16">
        {/* Tab Content */}
        {activeTabIndex === 0 && (
          <div>
            {/* <h2 className="text-2xl font-bold text-purple-700 mb-4 text-center">Course Card Template</h2> */}
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
      </main>
    </div>
  );
};

export default AdminCoursePage;
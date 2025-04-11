
"use client";

import React, { useState } from "react";

interface CaseStudyRow {
  number: string;
  module: string;
  lastDate: string;
  topic: string;
  submissionDate: string;
  cashback: string;
  quality: string;
}

const NewCaseStudy: React.FC = () => {
  const [rows, setRows] = useState<CaseStudyRow[]>([
    {
      number: "",
      module: "",
      lastDate: "",
      topic: "",
      submissionDate: "",
      cashback: "",
      quality: "",
    },
  ]);

  const [tabs, setTabs] = useState<string[]>(["Case Study 1"]);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const handleInputChange = (
    index: number,
    field: keyof CaseStudyRow,
    value: string
  ) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        number: "",
        module: "",
        lastDate: "",
        topic: "",
        submissionDate: "",
        cashback: "",
        quality: "",
      },
    ]);
  };

  const addTab = () => {
    const newTab = `Case Study ${tabs.length + 1}`;
    setTabs([...tabs, newTab]);
    setCurrentTabIndex(tabs.length);
  };

  const handleLeftArrowClick = () => {
    if (currentTabIndex > 0) {
      setCurrentTabIndex(currentTabIndex - 1);
    }
  };

  const handleRightArrowClick = () => {
    if (currentTabIndex < tabs.length - 1) {
      setCurrentTabIndex(currentTabIndex + 1);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-screen bg-gray-50 font-sans">
     
      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-purple-700 mb-2 md:mb-0">New Case Study</h1>
          <button
            onClick={addTab}
            className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800"
          >
            Add Quiz
          </button>
        </div>

        {/* Tabs with Arrows */}
        <div className="flex items-center mb-6 space-x-2">
          <button
            onClick={handleLeftArrowClick}
            className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            disabled={currentTabIndex === 0}
          >
            &lt;
          </button>
          <div className="flex overflow-x-auto space-x-2">
            {tabs.map((tab, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-md ${
                  index === currentTabIndex
                    ? "bg-purple-700 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-purple-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button
            onClick={handleRightArrowClick}
            className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            disabled={currentTabIndex === tabs.length - 1}
          >
            &gt;
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 mb-4">
            <tbody>
              {rows.map((row, index) => (
                <React.Fragment key={index}>
                  {Object.entries(row).map(([key, value]) => (
                    <tr key={`${index}-${key}`} className="border-t border-gray-300">
                      <td className="px-4 py-2 bg-gray-100 capitalize font-medium text-gray-700">
                        {key}
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={value}
                          onChange={(e) =>
                            handleInputChange(index, key as keyof CaseStudyRow, e.target.value)
                          }
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={addRow}
            className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800"
          >
            Add Field
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Update
          </button>
        </div>
      </main>
    </div>
  );
};

export default NewCaseStudy;

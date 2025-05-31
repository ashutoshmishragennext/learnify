import React from 'react'

const BreakdownForm = () => {
  return (
<div className="mb-6 p-4 bg-purple-100 border border-blue-300 rounded-lg">
        <h2 className="text-lg font-bold text-blue-800 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10A8 8 0 114 10a8 8 0 0114 0zm-9-3a1 1 0 112 0v4a1 1 0 11-2 0V7zm1 6a1 1 0 110 2 1 1 0 010-2z"
              clipRule="evenodd"
            />
          </svg>
          How to Fill Out This Page
        </h2>
        <p className="text-sm text-blue-700 mt-2">
          This form helps you structure your course modules. Fill in all the
          required fields marked with{" "}
          <span className="text-red-500 font-bold">*</span>.
        </p>

        <ul className="list-disc pl-5 mt-2 text-sm text-blue-700">
          <li>
            <strong>Module Number:</strong> The module sequence number. It is
            auto-generated and cannot be changed.
          </li>
          <li>
            <strong>Module Topic:</strong> Enter the main subject of the module.
          </li>
          <li>
            <strong>Parts:</strong> Specify how many sub-sections (sub-modules)
            this module will have.{" "}
            <span className="text-red-500 font-bold">
              (You will only be able to add the number of sub-modules that you
              specify here).
            </span>
          </li>
          <li>
            <strong>Reward:</strong> Assign reward points for completing this
            module.
          </li>
          <li>
            <strong>Duration:</strong> Enter the total duration of the module in
            hours, minutes, and seconds. Since a module consists of multiple
            submodules, its duration can be entered in hours.
          </li>
        </ul>

        <h3 className="text-lg font-semibold mt-4">Sub-Modules</h3>
        <ul className="list-disc pl-5 mt-2 text-sm text-blue-700">
          <li>
            <strong>Part Number:</strong> The sequence number of the submodule.
          </li>
          <li>
            <strong>Part Name:</strong> Enter the title or name of the
            submodule.
          </li>
          <li>
            <strong>Duration:</strong> Specify the duration of this submodule.{" "}
            <span className="text-red-500 font-bold">
              (The duration for submodules cannot be in hours, only in minutes upto 10mins
              and seconds).
            </span>
          </li>
          <li>
            <strong>Video Lecture:</strong> Upload or link the video lecture
            associated with this submodule.
          </li>
        </ul>
      </div>  )
}

export default BreakdownForm
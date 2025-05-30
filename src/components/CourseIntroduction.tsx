import React from 'react'

const CourseIntroduction = () => {
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
          This form helps you structure your course details. Fill in all the
          required fields marked with{" "}
          <span className="text-red-500 font-bold">*</span>.
        </p>

        <ul className="list-disc pl-5 mt-2 text-sm text-blue-700">
          <li>
            <strong>Demo:</strong> Upload a demo video to showcase a preview of
            your course.
          </li>
          <li>
            <strong>Course Heading:</strong> Provide the title of the course
            that best describes its content.
          </li>
          <li>
            <strong>Long Description:</strong> Write a detailed description
            explaining the course&apos;s objectives and benefits.
          </li>
          <li>
            <strong>SubPoints:</strong> Add key highlights or topics covered in
            the course, (For multiple seperate by commas).
          </li>
          <li>
            <strong>Category:</strong> Choose the appropriate category for the
            course (e.g., Programming, Design). You can add multiple categories
            if needed.
          </li>
          <li>
            <strong>Certificate Provider:</strong> Select whether the course
            provides a certificate upon completion.
          </li>
          <li>
            <strong>Lifetime Access:</strong> Choose whether users will have
            lifetime access to the course content.
          </li>
          <li>
            <strong>Select Level:</strong> Indicate the difficulty level of the
            course (e.g., Beginner, Intermediate, Advanced).
          </li>
          <li>
            <strong>Tags:</strong> Enter keywords related to the course,
            separated by spaces or commas, to improve searchability.
          </li>
          <li>
            <strong>Prerequisite:</strong> Mention any knowledge or skills
            required before taking the course, (For multiple seperate by commas).
          </li>
          <li>
            <strong>Requirement:</strong> List any tools, software, or resources
            needed for the course, (For multiple seperate by commas).
          </li>
          <li>
            <strong>Publisher Name:</strong> Enter the name of the person or
            organization publishing the course.
          </li>
          <li>
            <strong>Publisher Bio:</strong> Provide a brief bio of the publisher
            to introduce them to users.
          </li>
          <li>
            <strong>Publisher Description:</strong> Write a detailed description
            about the publisher and their expertise.
          </li>
          <li>
            <strong>Publisher Profile Image:</strong> Upload an image for the
            publisher&apos;s profile.
          </li>
          <li>
            <strong>Subtitles:</strong> Specify if the course includes
            subtitles.
          </li>
        </ul>

        <h3 className="text-lg font-semibold mt-4">Course Details</h3>
        <ul className="list-disc pl-5 mt-2 text-sm text-blue-700">
          <li>
            <strong>No. of Assignments:</strong> Enter the total number of
            assignments available in the course.
          </li>
          <li>
            <strong>No. of Video Lectures:</strong> Specify the total number of
            video lectures included in the course.
          </li>
        </ul>

        <h3 className="text-lg font-semibold mt-4">About Course</h3>
        <ul className="list-disc pl-5 mt-2 text-sm text-blue-700">
          <li>
            <strong>Syllabus:</strong> Provide a structured syllabus outlining
            the topics covered in the course.
          </li>
        </ul>
      </div>
  )
}

export default CourseIntroduction
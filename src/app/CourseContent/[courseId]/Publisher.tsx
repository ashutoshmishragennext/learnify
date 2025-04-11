"use client";
import { ICourse } from "@/app/models/Course";
import { IPublisher } from "@/app/models/Publisher";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface CoursePageProps {
  course: ICourse;
}

interface PublisherProps {
  name: string;
  title: string;
  description: string;
  instructorRating: number;
  reviews: number;
  students: number;
  courses: number;
  imageUrl: string;
}

const Publisher: React.FC<PublisherProps> = ({
  name,
  title,
  description,
  instructorRating,
  reviews,
  students,
  courses,
  imageUrl,
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <div className="max-w-5xl mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-purple-600 mb-6 border-b pb-2">
        About Publisher
      </h3>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Section */}
        <div className="flex flex-col items-center lg:w-1/3">
          <Image
            src={imageUrl}
            alt={`${name}'s profile`}
            width={144}
            height={144}
            className="w-36 h-36 rounded-full mb-4"
          />
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              <span className="text-yellow-500 mr-2">⭐</span>
              {instructorRating} Instructor Rating
            </p>
            <p>
              <span className="text-blue-500 mr-2">📝</span>
              {reviews.toLocaleString()} Reviews
            </p>
            <p>
              <span className="text-green-500 mr-2">👥</span>
              {students.toLocaleString()} Students
            </p>
            <p>
              <span className="text-purple-500 mr-2">📚</span>
              {courses || 0} Courses
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="lg:w-2/3">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            {name}{" "}
            <span className="ml-2 text-green-600 text-lg font-medium">✔</span>
          </h2>
          <p className="text-gray-600 text-sm mb-4">{title}</p>
          <p className="text-gray-700 mb-4">
            {showFullDescription
              ? description
              : `${description.slice(0, 200)}...`}
          </p>
          <button
            onClick={toggleDescription}
            className="text-purple-600 hover:underline font-medium"
          >
            {showFullDescription ? "Read Less" : "Read More"}
          </button>
        </div>
      </div>
    </div>
  );
};

const PublishHome: React.FC<CoursePageProps> = ({ course }) => {
  const [publisher, setPublisher] = useState<IPublisher>();
  useEffect(()=>{
    const fetchPublisher = async()=>{
      const response = await fetch("/api/publisher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({courseId: course.courseId})
      });
      if(response.ok){
        const data = await response.json();
        setPublisher(data.publishers);
      }
    }
    fetchPublisher();
  }, []);

  if (!publisher) return <p>Loading...</p>;


  return (
    <div>
      <Publisher
        name={publisher.name}
        title={publisher.bio}
        description={publisher.description}
        instructorRating={publisher.ratings}
        reviews={publisher.reviews}
        students={publisher.studentsTaught}
        courses={publisher.coursesPublished?.totalCoursesPublished}
        imageUrl={publisher.image || "/signuppageimage.png"}
      />
    </div>
  );
};

export default PublishHome;

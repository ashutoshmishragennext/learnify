"use client";
import Link from "next/link";
import { useState } from "react";
interface Course {
    id: number;
    title: string;
    instructor: string;
    videoSrc: string;
    category: string;
  }
  
  const VideoCard = ({ course }: { course: Course }) => {
    const [progress, setProgress] = useState(0); // Video progress in percentage
  
    const handleTimeUpdate = (event: React.SyntheticEvent<HTMLVideoElement>) => {
      const videoElement = event.target as HTMLVideoElement;
      const currentTime = videoElement.currentTime;
      const duration = videoElement.duration;
      setProgress((currentTime / duration) * 100);
    };
  
    return (
      <div className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="w-full h-40 bg-gray-300 rounded-lg flex justify-center items-center overflow-hidden">
          {/* Video Player */}
          <video
            className="w-full h-full object-cover rounded-lg"
            controls
            src={course.videoSrc}
            onTimeUpdate={handleTimeUpdate} // Track progress dynamically
          >
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="mt-4">
          <span className="text-xs text-purple-600 font-semibold uppercase">
            {course.category}
          </span>
          <Link href="CourseContent" className="font-medium text-lg mt-2">{course.title}</Link>
          <p className="text-xs text-gray-500 mt-1">{course.instructor}</p>
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div
              className="bg-purple-600 h-2 rounded-full"
              style={{ width: `${progress}%` }} 
            ></div>
          </div>
        </div>
      </div>
    );
  };
  
  export default VideoCard;
  
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { FaUsers } from "react-icons/fa";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useRouter } from "next/navigation";
import Image from "next/image";
import formatStudents from "@/lib/formatStudents";
import { Session } from "next-auth";
import { ICourse } from "@/app/models/Course";
import { useCurrentRole } from "@/hooks/auth/useCurrentRole";

interface CardProps {
  title: string;
  image: string;
  session: Session | null | undefined;
  students: number | any;
  price: number;
  originalPrice: number;
  description:  any;
  buttonLabel: string;
  dateRange?: string;
  courseId: string;
}

const CardRedirectForBuyCourses: React.FC<CardProps> = ({
  title,
  image,
  students,
  session,
  price,
  originalPrice,
  description,
  buttonLabel,
  dateRange,
  courseId,
}) => {
  const role = useCurrentRole()
  const [loading, setLoading] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch("/api/wishlistCourses");
        if (!response.ok) throw new Error("Error fetching wishlist courses");

        const wishlistData: ICourse[] = await response.json();
        setIsInWishlist(wishlistData.some((course) => course.courseId == courseId));
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    if (session) {
      fetchWishlist();
    }
  }, [session, courseId]);

  const handleClick = () => {
    setLoading(true);
    if(role === "STUDENT")
    router.push(`/dashboard/student/courses/${courseId}`);
    if(role === "ADMIN")
    router.push(`/dashboard/admin/courses/${courseId}`);

  };

  const toggleWishlist = async () => {
    try {
      let response;
      let msg;

      if (isInWishlist) {
        // Remove from wishlist
        response = await fetch("/api/removeWishlistCourse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId }),
        });

        if (!response.ok) throw new Error("Failed to remove course from wishlist");
        msg = "Course removed from wishlist!";
      } else {
        // Add to wishlist
        response = await fetch("/api/addWishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId }),
        });

        if (!response.ok) throw new Error("Failed to add course to wishlist");
        msg = "Course added to wishlist!";
      }

      setIsInWishlist(!isInWishlist);
      setMessage(msg);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
    } catch (error) {
      console.error("Wishlist error:", error);
      setMessage("An error occurred. Please try again.");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
    }
  };

  return (
    <div               
      onClick={handleClick}
      className="w-full max-w-[360px]  bg-white rounded-lg cursor-pointer shadow-lg border hover:shadow-xl transform hover:scale-105 transition-transform duration-300 flex flex-col mx-auto relative font-sans">
      {/* Image Section */}
      <div className="relative">
        <Image
          src={image}
          alt={title}
          width={200}
          height={200}
          className="w-full h-[200px] object-cover rounded-t-lg"
        />

        {/* Students Badge */}
        <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 text-sm font-medium text-gray-800 rounded-full shadow-md flex items-center">
          <FaUsers className="text-purple-600 mr-2" />+{formatStudents(students)} students
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="text-sm font-medium text-gray-500 mb-2">{dateRange}</div>

        <h3 className="text-lg font-semibold mb-4 text-left text-[#907CFF]">
          {title}
        </h3>

        <p className="text-left mb-4 text-[#4D4D4D]">{description}</p>

        <div className="flex justify-between items-center mt-auto">
          <div>
            <span className="text-lg font-bold text-[#4D4D4D]">
              ₹{price}
            </span>{" "}
            <span className="text-sm line-through text-gray-400">
              ₹{originalPrice}
            </span>
          </div>

          <div className="flex items-center">
            {session && (
              <button
                onClick={toggleWishlist}
                className="text-2xl text-gray-600 hover:text-red-500 transition mr-2"
              >
                {isInWishlist ? <AiFillHeart className="text-red-500" /> : <AiOutlineHeart />}
              </button>
            )}
            <button
              className="px-5 py-2 text-white text-sm font-medium rounded-md hover:bg-purple-700 shadow bg-[#907CFF]"
            >
              {loading ? "Loading..." : buttonLabel}
            </button>
          </div>
        </div>
      </div>

      {showMessage && (
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-sm px-4 py-2 rounded-md shadow-md">
          {message}
        </div>
      )}
    </div>
  );
};

export default CardRedirectForBuyCourses;


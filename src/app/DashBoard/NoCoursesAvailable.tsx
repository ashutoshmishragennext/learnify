"use client";
 
// import Image from "next/image";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";
import { useState } from "react";

const NoCoursesAvailable = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);  
  const router = useRouter();

  const handleRedirect = ()=>{
    setIsLoading(true);
    router.push("/ExploreData");
  }
  return (
    <div className="flex flex-col items-center justify-center text-center p-6 bg-gray-50 rounded-lg shadow-md">
      {isLoading && <Loader />}
      {/* <Image
        src="https://res.cloudinary.com/dtfe8o5ny/image/upload/v1735977856/Course-not-Found_a8br1j.jpg"
        alt="No Courses Available"
        width={300}
        height={300}
        className="mb-6"
      /> */}
      <h2 className="text-2xl font-bold text-gray-700 mb-4">
        No Courses Available
      </h2>
      <p className="text-gray-500 mb-6">
        It seems you haven’t enrolled in any courses yet. Start exploring and enhance your skills today!
      </p>
      <button
        onClick={handleRedirect}
        className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-all"
      >
        Browse Courses
      </button>
    </div>
  );
};

export default NoCoursesAvailable;

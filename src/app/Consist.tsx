"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const Consist: React.FC = () => {
  const router = useRouter();
  return (
 <section className="relative overflow-hidden grid md:grid-cols-2 items-center px-6 md:px-10 pt-16 pb-12 bg-white rounded-lg shadow-lg border border-blue-300 gap-6">
      {/* Left Content */}
      <div className="text-center md:text-left self-start">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mt-4">
          Learn with <span className="text-blue-600">Experts</span> <br /> anytime, anywhere
        </h1>
        <p className="mt-2 text-gray-600 text-base md:text-lg">
          Our Mission is to help students to find the best course online and learn with experts anytime, anywhere.
        </p>

        {/* CTA Heading */}
        <div
          onClick={() => {
            router.push("/dashboard/student/courses");
          }}
          className="cursor-pointer z-10 mt-10 p-3 w-full max-w-xs sm:max-w-md bg-learnify text-white shadow-lg rounded-lg mx-auto md:mx-0"
        >
          <h2 className="text-xl md:text-2xl font-semibold text-center">
            Learn with <span className="custom-font-style">Learnify</span>
          </h2>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="flex justify-center md:justify-end relative mb-10 md:mb-0">
        <div className="custom-image-container w-full max-w-[280px] sm:max-w-[350px] md:max-w-none">
          <Image
            src="/main.jpg"
            alt="Education"
            width={450}
            height={400}
            className="object-cover custom-image w-full h-auto"
            priority
          />
        </div>
      </div>

      {/* Bottom Heading - Always Full Width */}
      <div className="md:col-span-2 w-full text-center mt-6">
        <h2 className="text-2xl md:text-xl font-bold text-indigo-400">
          All the skills you need in one place.
        </h2>
        <p className="mt-2 text-gray-600 text-base md:text-sm max-w-2xl mx-auto">
          From critical skills to technical topics, Learnify supports your professional development.
        </p>
      </div>
    </section>
  );
};

export default Consist;
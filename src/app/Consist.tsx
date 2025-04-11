
// "use client";

// import Image from "next/image";
// import React from "react";

// const Consist: React.FC = () => {
//   return (
//     <section className="relative flex flex-col md:flex-row items-center justify-between px-6 md:px-10 py-10 md:py-16 bg-white rounded-lg shadow-lg border border-blue-300">
//       {/* Left Content */}
//       <div className="md:w-1/2 text-center md:text-left">
//         <h1 className="text-4xl md:text-5xl ml-2 md:ml-4 font-bold text-gray-900 leading-snug">
//           Learn with <span className="text-blue-600">Experts</span> <br /> anytime, anywhere
//         </h1>
//         <p className="mt-3 md:mt-4 ml-2 md:ml-4 text-gray-600 text-base md:text-lg">
//           Our Mission is to help students to find the best course online and learn with experts anytime, anywhere.
//         </p>

//         {/* CTA Heading - Positioned Correctly */}
//         <div className="z-10 ml-2 md:ml-4 mt-4 md:mt-6 p-3 w-full max-w-xs sm:max-w-md bg-learnify text-white shadow-lg rounded-lg absolute left-1/2 md:left-[15%] transform -translate-x-1/2 md:-translate-x-1/2 top-[58%] md:top-[75%]">
//           <h2 className="text-xl md:text-2xl font-semibold text-center">
//             Learn with <span className="custom-font-style">Learnify</span>
//           </h2>
//         </div>
//       </div>

//       {/* Right Image Section */}
//       <div className="md:w-1/2 flex justify-center mt-4 md:mt-0 relative">
//         <div className="custom-image-container">
//           <Image
//             src="/main.jpg"
//             alt="Education"
//             width={450}
//             height={400}
//             className="object-cover custom-image"
//           />
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Consist;


// "use client";

// import Image from "next/image";
// import React from "react";

// const Consist: React.FC = () => {
//   return (
//     <section className="relative flex flex-col md:flex-row items-start justify-between px-6 md:px-10 pt-4 bg-white rounded-lg shadow-lg border border-blue-300">
//       {/* Left Content */}
//       <div className="md:w-1/2 text-center md:text-left self-start">
//         <h1 className="text-4xl md:text-5xl ml-2 md:ml-4 font-bold text-gray-900 leading-tight mt-4">
//           Learn with <span className="text-blue-600">Experts</span> <br /> anytime, anywhere
//         </h1>
//         <p className="mt-2 md:mt-3 ml-2 md:ml-4 text-gray-600 text-base md:text-lg">
//           Our Mission is to help students to find the best course online and learn with experts anytime, anywhere.
//         </p>

//         {/* CTA Heading - Positioned Correctly */}
//         <div className="z-10 ml-2 md:ml-4 mt-2 md:mt-4 p-3 w-full max-w-xs sm:max-w-md bg-learnify text-white shadow-lg rounded-lg absolute left-1/2 md:left-[15%] transform -translate-x-1/2 md:-translate-x-1/2 top-[50%] md:top-[65%]">
//           <h2 className="text-xl md:text-2xl font-semibold text-center">
//             Learn with <span className="custom-font-style">Learnify</span>
//           </h2>
//         </div>
//       </div>

//       {/* Right Image Section */}
//       <div className="md:w-1/2 flex justify-center mt-4 md:mt-4 relative">
//         <div className="custom-image-container">
//           <Image
//             src="/main.jpg"
//             alt="Education"
//             width={450}
//             height={400}
//             className="object-cover custom-image"
//           />
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Consist;


"use client";

import Image from "next/image";
import React from "react";

const Consist: React.FC = () => {
  return (
    <section className="relative flex flex-col md:flex-row items-center justify-between px-6 md:px-10 pt-16 pb-12 bg-white rounded-lg shadow-lg border border-blue-300">
      {/* Left Content */}
      <div className="md:w-1/2 text-center md:text-left self-start">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mt-4">
          Learn with <span className="text-blue-600">Experts</span> <br /> anytime, anywhere
        </h1>
        <p className="mt-2 text-gray-600 text-base md:text-lg">
          Our Mission is to help students to find the best course online and learn with experts anytime, anywhere.
        </p>

        {/* CTA Heading */}
        <div className="z-10 mt-28 p-3 w-full max-w-xs sm:max-w-md bg-learnify text-white shadow-lg rounded-lg">
          <h2 className="text-xl md:text-2xl font-semibold text-center">
            Learn with <span className="custom-font-style">Learnify</span>
          </h2>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="md:w-1/2 mb-20 mr-8 flex justify-center mt-6 md:mt-0 relative">
        <div className="custom-image-container">
          <Image
            src="/main.jpg"
            alt="Education"
            width={450}
            height={400}
            className="object-cover custom-image"
          />
        </div>
      </div>

      {/* New Heading Below Image - Perfectly Centered */}
      <div className="absolute bottom-8 pb-1 pt-2  left-1/2 transform -translate-x-1/2 text-center w-full px-6">
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

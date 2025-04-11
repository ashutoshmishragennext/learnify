// "use client";
// import sendEmail from "@/lib/sendEmail";
// import { useSession } from "next-auth/react";
// import React, { useState } from "react";
// import {
//   FaDownload,
// } from "react-icons/fa";
// import { toast } from "react-toastify";
// import { useRouter } from "next/navigation";

// // Define types for props
// type Feature = {
//   icon: JSX.Element;
//   label: string;
//   description: string;
// };

// type CourseDetailsProps = {
//   courseId: number;
//   title: string;
//   subtitle: string;
//   description: string;
//   details: string[];
//   features: Feature[];
// };

// const AboutCourse: React.FC<CourseDetailsProps> = ({
//   courseId,
//   title,
//   subtitle,
//   description,
//   details,
//   features,
// }) => {
//   const {data: session} = useSession();
//   const [sending, setSending] = useState<boolean>(false);

//   const router = useRouter();
//   const handleDownload = async()=>{
//     setSending(true);
//     if(!session){
//       toast.info("Please Login first");
//       setSending(false);
//       router.push("/login");
//       return;
//     }
//     const email:string = session?.user?.email;
//     const result = await sendEmail(email,"Syllabus",courseId);
//     if(result){
//       toast.success("Syllabus download link sent to your email");
//     }
//     else{
//       toast.error("Error in sending mail");
//     }
//   }

//   return (
//     <div className="flex flex-col lg:flex-row gap-8 bg-gray-50 p-8 rounded-lg shadow-lg">
//       {/* Left Section */}
//       <div className="lg:w-2/3">
//         <div className="flex items-center mb-4">
//           <div className="w-12 h-1 bg-purple-600 rounded-full mr-2"></div> {/* Bold Line */}
//           <h3 className="text-purple-600 font-bold text-lg">{subtitle}</h3>
//         </div>
//         <h1 className="text-2xl font-bold text-gray-800 mb-4 leading-snug">{title}</h1>
//         <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
//         <h4 className="text-lg font-semibold text-gray-800 mb-4">Details:</h4>
//         <ul className="list-disc pl-6 space-y-2 text-gray-700">
//           {details.map((detail, index) => (
//             <li key={index}>{detail}</li>
//           ))}
//         </ul>
//         <a
//           href="#"
//           className="text-purple-600 font-medium mt-6 inline-block hover:underline"
//         >
//           Read More...
//         </a>
//       </div>

      
//       <div className="lg:w-1/3 space-y-4 ">
//         {features.map((feature, index) => (
//           <div
//             key={index}
//             className="flex items-center p-4  hover:shadow-lg transition duration-300"
//           >
//             <div className="text-white bg-purple-900 text-2xl mr-4">{feature.icon}</div>
//             <div>
//               <h4 className="font-bold text-gray-800">{feature.label}</h4>
//               <p className="text-sm text-gray-500">{feature.description}</p>
//             </div>
//           </div>
//         ))}
//         <button onClick={handleDownload} className="w-full bg-white text-purple-700 py-3 border border-purple-600 rounded-lg font-semibold flex items-center justify-center hover:bg-gray-300 transition duration-300">
//           <FaDownload className="mr-2 text-lg" />
//           {sending ? "Sending...": "Download Syllabus for Complete Details"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AboutCourse;

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import sendEmail from "@/lib/sendEmail";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { FaDownload } from "react-icons/fa";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

// Define types for props
type Feature = {
  icon: JSX.Element;
  label: string;
  description: string;
};

type CourseDetailsProps = {
  courseId: number;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  features: Feature[];
};

const AboutCourse: React.FC<CourseDetailsProps> = ({
  courseId,
  title,
  subtitle,
  description,
  details,
  features,

}) => {
  const { data: session } = useSession();
  const [sending, setSending] = useState<boolean>(false);
  const [showAllDetails, setShowAllDetails] = useState<boolean>(false);

  const router = useRouter();

  const handleDownload = async () => {
    setSending(true);
    if (!session) {
      toast.info("Please Login first");
      setSending(false);
      router.push("/login");
      return;
    }
    const email: any = session?.user?.email;
    const result = await sendEmail(email, "Syllabus", courseId);
    if (result) {
      toast.success("Syllabus download link sent to your email");
    } else {
      toast.error("Error in sending mail");
    }
    setSending(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 bg-gray-50 p-8 rounded-lg shadow-lg">
      {/* Left Section */}
      <div className="lg:w-2/3">
        <div className="flex items-center mb-4">
          <div className="w-12 h-1 bg-purple-600 rounded-full mr-2"></div> {/* Bold Line */}
          <h3 className="text-purple-600 font-bold text-lg">{subtitle}</h3>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4 leading-snug">{title}</h1>
        <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
        
        {/* Details Section */}
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Details:</h4>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          {details.slice(0, showAllDetails ? details.length : 2).map((detail, index) => (
            <li key={index}>{detail}</li>
          ))}
        </ul>

        {/* Read More / Read Less Button */}
        {details.length > 2 && (
          <button
            onClick={() => setShowAllDetails(!showAllDetails)}
            className="text-purple-600 font-medium mt-2 inline-block hover:underline"
          >
            {showAllDetails ? "Read Less..." : "Read More..."}
          </button>
        )}
      </div>

      {/* Right Section - Features & Download Button */}
      <div className="lg:w-1/3 space-y-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center p-4 hover:shadow-lg transition duration-300">
            <div className="text-white bg-purple-900 text-2xl mr-4">{feature.icon}</div>
            <div>
              <h4 className="font-bold text-gray-800">{feature.label}</h4>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          </div>
        ))}
        <button
          onClick={handleDownload}
          className="w-full bg-white text-purple-700 py-3 border border-purple-600 rounded-lg font-semibold flex items-center justify-center hover:bg-gray-300 transition duration-300"
        >
          <FaDownload className="mr-2 text-lg" />
          {sending ? "Sending..." : "Download Syllabus for Complete Details"}
        </button>
      </div>
    </div>
  );
};

export default AboutCourse;

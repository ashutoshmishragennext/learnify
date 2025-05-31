/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React, { useEffect, useState } from "react";
// import { FaPlay } from "react-icons/fa";


// interface Lecture {
//   title: string;
//   duration: string;
//   assignment?: string;
//   subheading: string;
// }

// interface Module {
//   id: number;
//   title: string;
//   totalLectures: number;
//   lecturecompleted: number;
//   totalTime: string;
//   lectures?: Lecture[];
// }

// const modules: Module[] = [
//   {
//     id: 1,
//     title: "bags",
//     totalLectures: 6,
//     lecturecompleted: 0,
//     totalTime: "15 minutes",
//     lectures: [
//       {
//         title: "Lecture 1",
//         duration: "25 minutes",
//         assignment: "Last Date: 19/11/24",
//         subheading: "1.1",
//       },
//       {
//         title: "Lecture 2",
//         duration: "20 minutes",
//         assignment: "Not Assigned Yet",
//         subheading: "1.2",
//       },
//     ],
//   },

//   {
//     id: 2,
//     title: "Tags",
//     totalLectures: 4,
//     lecturecompleted: 0,
//     totalTime: "10 minutes",
//     lectures: [
//       {
//         title: "Lecture 1",
//         duration: "25 minutes",
//         assignment: "Last Date: 19/11/24",
//         subheading: "2.1",
//       },
//       {
//         title: "Lecture 2",
//         duration: "20 minutes",
//         assignment: "Last date:19/12/2024.",
//         subheading: "2.2",
//       },
//     ],
//   },
//   {
//     id: 3,
//     title: "Bags",
//     totalLectures: 4,
//     lecturecompleted: 0,
//     totalTime: "10 minutes",
//     lectures: [
//       {
//         title: "Lecture 1",
//         duration: "25 minutes",
//         assignment: "Last Date: 19/11/24",
//         subheading: "3.1",
//       },
//       {
//         title: "Lecture 2",
//         duration: "45 minutes",
//         assignment: "Last date:19/12/2024.",
//         subheading: "3.2",
//       },
//     ],
//   },

// ];

// interface CourseAccordionProps {
//   courseId?: string | string[];
// }

// const CourseAccordion: React.FC<CourseAccordionProps> = ({ courseId }) => {
//   const [openModule, setOpenModule] = useState<number | null>(null);
//   const [data , setData] = useState(null);

//   useEffect(() => {
//     const getCourseVideos = async () => {
//       const response = await fetch("/api/course", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           courseId
//         }),
//       });

//       const data:any = response.json();
//       setData(data.course)
//     }
//     if(courseId) {
//       getCourseVideos();  
//     }


//   },[courseId])

//   const toggleModule = (id: number) => {
//     setOpenModule((prev) => (prev === id ? null : id));
//   };

//   return (
//     <div className="relative flex flex-col lg:flex-row max-w-screen-xl mx-auto px-4 py-8 gap-8">
//       {/* Left Section: Accordion */}
//       <div className="flex-1 lg:w-2/3 space-y-4">
//         <h1 className="text-3xl font-bold text-purple-800 mb-6">
//           Beginner’s Guide To Becoming A Professional Frontend Developer
//         </h1>
//         <div className="bg-white border border-gray-300 rounded-lg shadow-lg divide-y divide-gray-200">
//           {modules.map((module) => (
//             <div key={module.id}>
//               {/* Accordion Header */}
//               <button
//                 className={`w-full flex justify-between items-center px-6 py-4 ${
//                   openModule === module.id
//                     ? "bg-purple-100 text-purple-800 border-l-4 border-purple-600"
//                     : "bg-white text-gray-900"
//                 } hover:bg-purple-50 transition`}
//                 onClick={() => toggleModule(module.id)}
//               >
//                 <div className="flex flex-col text-left">
//                   <span className="font-medium">
//                     {module.id}. {module.title}
//                   </span>
//                   <span className="text-sm text-gray-500">
//                     {module.lecturecompleted}/{module.totalLectures} ·{" "}
//                     {module.totalTime}
//                   </span>
//                 </div>
//                 <span
//                   className={`transform transition-transform ${
//                     openModule === module.id
//                       ? "rotate-90 text-purple-600"
//                       : "text-gray-500"
//                   }`}
//                 >
//                   ▶
//                 </span>
//               </button>

//               {/* Accordion Content */}
//               {openModule === module.id && module.lectures && (
//                 <div className="bg-purple-50 px-6 py-4 space-y-6">
//                   {module.lectures.map((lecture, index) => (
//                     <div key={index} className="space-y-4">
//                       {/* Main Lecture Section */}
//                       <div
//                         className="flex justify-between items-center bg-purple-600 px-4 py-3 rounded-lg shadow-md text-white cursor-pointer hover:bg-purple-700 transition"
//                         onClick={() =>
//                           alert(`Clicked on ${lecture.title} - Duration: ${lecture.duration}`)
//                         }
//                       >
//                         <div className="flex items-center space-x-2">
//                           <FaPlay />
//                           <span>{lecture.title}</span>
//                         </div>
//                         <span>{lecture.duration}</span>
//                       </div>

//                       {/* Subheading Section */}
//                       <div
//                         className="flex justify-between items-center px-4 py-2 bg-white rounded-lg shadow-md cursor-pointer hover:bg-purple-100 transition"
//                         onClick={() =>
//                           alert(
//                            ` Assignment for ${lecture.subheading}: ${lecture.assignment}`
//                           )
//                         }
//                       >
//                         <span className="text-gray-800 font-medium">
//                           {lecture.subheading}. Assignment
//                         </span>
//                         <span className="text-gray-500 text-sm">
//                           {lecture.assignment}
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseAccordion;



// "use client";

// import React, { useEffect, useState } from "react";
// import { FaPlay } from "react-icons/fa";

// interface SubModule {
//   sModuleNumber: number;
//   sModuleTitle: string;
//   sModuleDuration: number;
//   videoLecture: string;
//   _id: string;
// }

// interface Module {
//   moduleNumber: number;
//   moduleTitle: string;
//   moduleDuration: number;
//   subModulePart: number;
//   reward: number;
//   subModules: SubModule[];
//   _id: string;
// }

// interface CourseData {
//   _id: string;
//   name: string;
//   modules: Module[];
//   // Add other course properties as needed
// }

// interface ApiResponse {
//   course: CourseData;
//   courseIncluded: boolean;
//   cartIncluded: boolean;
//   wishlistIncluded: boolean;
// }

// interface CourseAccordionProps {
//   courseId?: string | string[];
// }

// const CourseAccordion: React.FC<CourseAccordionProps> = ({ courseId }) => {
//   const [openModule, setOpenModule] = useState<number | null>(null);
//   const [data, setData] = useState<CourseData | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);

//   useEffect(() => {
//     const getCourseVideos = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch("/api/course", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             courseId
//           }),
//         });

//         const responseData: ApiResponse = await response.json();
//         setData(responseData.course);
//       } catch (error) {
//         console.error("Error fetching course data:", error);
//         setData(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (courseId) {
//       getCourseVideos();
//     }
//   }, [courseId]);

//   const toggleModule = (moduleNumber: number) => {
//     setOpenModule((prev) => (prev === moduleNumber ? null : moduleNumber));
//   };

//   // Convert duration from seconds to minutes
//   const formatDuration = (seconds: number): string => {
//     const minutes = Math.round(seconds / 60);
//     return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
//   };

//   // Don't render anything if no data or loading
//   if (loading) {
//     return (
//       <div className="relative flex flex-col lg:flex-row max-w-screen-xl mx-auto px-4 py-8 gap-8">
//         <div className="flex-1 lg:w-2/3">
//           <div className="text-center py-8">Loading course data...</div>
//         </div>
//       </div>
//     );
//   }

//   if (!data || !data.modules || data.modules.length === 0) {
//     return null; // Don't show anything if no data exists
//   }

//   return (
//     <div className="relative flex flex-col lg:flex-row max-w-screen-xl mx-auto px-4 py-8 gap-8">
//       {/* Left Section: Accordion */}
//       <div className="flex-1 lg:w-2/3 space-y-4">
//         <h1 className="text-3xl font-bold text-purple-800 mb-6">
//           {data.name}
//         </h1>
//         <div className="bg-white border border-gray-300 rounded-lg shadow-lg divide-y divide-gray-200">
//           {data.modules.map((module) => (
//             <div key={module._id}>
//               {/* Accordion Header */}
//               <button
//                 className={`w-full flex justify-between items-center px-6 py-4 ${
//                   openModule === module.moduleNumber
//                     ? "bg-purple-100 text-purple-800 border-l-4 border-purple-600"
//                     : "bg-white text-gray-900"
//                 } hover:bg-purple-50 transition`}
//                 onClick={() => toggleModule(module.moduleNumber)}
//               >
//                 <div className="flex flex-col text-left">
//                   <span className="font-medium">
//                     {module.moduleNumber}. {module.moduleTitle}
//                   </span>
//                   <span className="text-sm text-gray-500">
//                     0/{module.subModules.length} · {formatDuration(module.moduleDuration)}
//                   </span>
//                 </div>
//                 <span
//                   className={`transform transition-transform ${
//                     openModule === module.moduleNumber
//                       ? "rotate-90 text-purple-600"
//                       : "text-gray-500"
//                   }`}
//                 >
//                   ▶
//                 </span>
//               </button>

//               {/* Accordion Content */}
//               {openModule === module.moduleNumber && module.subModules && (
//                 <div className="bg-purple-50 px-6 py-4 space-y-6">
//                   {module.subModules.map((subModule, index) => (
//                     <div key={subModule._id} className="space-y-4">
//                       {/* Main Lecture Section */}
//                       <div
//                         className="flex justify-between items-center bg-purple-600 px-4 py-3 rounded-lg shadow-md text-white cursor-pointer hover:bg-purple-700 transition"
//                         onClick={() =>
//                           alert(`Clicked on ${subModule.sModuleTitle} - Duration: ${formatDuration(subModule.sModuleDuration)}`)
//                         }
//                       >
//                         <div className="flex items-center space-x-2">
//                           <FaPlay />
//                           <span>{subModule.sModuleTitle}</span>
//                         </div>
//                         <span>{formatDuration(subModule.sModuleDuration)}</span>
//                       </div>

//                       {/* Assignment Section (if needed) */}
//                       <div
//                         className="flex justify-between items-center px-4 py-2 bg-white rounded-lg shadow-md cursor-pointer hover:bg-purple-100 transition"
//                         onClick={() =>
//                           alert(`Module ${module.moduleNumber}.${subModule.sModuleNumber} - Reward: ${module.reward} points`)
//                         }
//                       >
//                         <span className="text-gray-800 font-medium">
//                           {module.moduleNumber}.{subModule.sModuleNumber}. Module Content
//                         </span>
//                         <span className="text-gray-500 text-sm">
//                           Reward: {module.reward} point{module.reward !== 1 ? 's' : ''}
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseAccordion;

"use client";

import React, { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";

interface SubModule {
  sModuleNumber: number;
  sModuleTitle: string;
  sModuleDuration: number;
  videoLecture: string;
  _id: string;
}

interface Module {
  moduleNumber: number;
  moduleTitle: string;
  moduleDuration: number;
  subModulePart: number;
  reward: number;
  subModules: SubModule[];
  _id: string;
}

interface CourseData {
  _id: string;
  name: string;
  modules: Module[];
  // Add other course properties as needed
}

interface ApiResponse {
  course: CourseData;
  courseIncluded: boolean;
  cartIncluded: boolean;
  wishlistIncluded: boolean;
}

interface CourseAccordionProps {
  courseId?: string | string[];
}

const CourseAccordion: React.FC<CourseAccordionProps> = ({ courseId }) => {
  const [openModule, setOpenModule] = useState<number | null>(null);
  const [data, setData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<SubModule | null>(null);

  useEffect(() => {
    const getCourseVideos = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/course", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId
          }),
        });

        const responseData: ApiResponse = await response.json();
        setData(responseData.course);
      } catch (error) {
        console.error("Error fetching course data:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      getCourseVideos();
    }
  }, [courseId]);

  const toggleModule = (moduleNumber: number) => {
    setOpenModule((prev) => (prev === moduleNumber ? null : moduleNumber));
  };

  // Convert duration from seconds to minutes
  const formatDuration = (seconds: number): string => {
    const minutes = Math.round(seconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };

  const handleVideoClick = (subModule: SubModule) => {
    setSelectedVideo(subModule);
  };

  const handleBackToList = () => {
    setSelectedVideo(null);
  };

  // Don't render anything if no data or loading
  if (loading) {
    return (
      <div className="relative flex flex-col lg:flex-row max-w-screen-xl mx-auto px-4 py-8 gap-8">
        <div className="flex-1 lg:w-2/3">
          <div className="text-center py-8">Loading course data...</div>
        </div>
      </div>
    );
  }

  if (!data || !data.modules || data.modules.length === 0) {
    return null; // Don't show anything if no data exists
  }

  // If a video is selected, show the video player
  if (selectedVideo) {
    return (
      <div className="relative flex flex-col max-w-screen-xl mx-auto px-4 py-8">
        <div className="mb-4">
          <button
            onClick={handleBackToList}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            <span>←</span>
            <span>Back to Course</span>
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-purple-800 mb-4">
            {selectedVideo.sModuleTitle}
          </h2>
          <div className="mb-4">
            <span className="text-gray-600">Duration: {formatDuration(selectedVideo.sModuleDuration)}</span>
          </div>
          
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <video
              controls
              className="w-full h-full"
              src={selectedVideo.videoLecture}
              poster="" // You can add a poster image if available
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col lg:flex-row max-w-screen-xl mx-auto px-4 py-8 gap-8">
      {/* Left Section: Accordion */}
      <div className="flex-1 lg:w-2/3 space-y-4">
        <h1 className="text-3xl font-bold text-purple-800 mb-6">
          {data.name}
        </h1>
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg divide-y divide-gray-200">
          {data.modules.map((module) => (
            <div key={module._id}>
              {/* Accordion Header */}
              <button
                className={`w-full flex justify-between items-center px-6 py-4 ${
                  openModule === module.moduleNumber
                    ? "bg-purple-100 text-purple-800 border-l-4 border-purple-600"
                    : "bg-white text-gray-900"
                } hover:bg-purple-50 transition`}
                onClick={() => toggleModule(module.moduleNumber)}
              >
                <div className="flex flex-col text-left">
                  <span className="font-medium">
                    {module.moduleNumber}. {module.moduleTitle}
                  </span>
                  <span className="text-sm text-gray-500">
                    0/{module.subModules.length} · {formatDuration(module.moduleDuration)}
                  </span>
                </div>
                <span
                  className={`transform transition-transform ${
                    openModule === module.moduleNumber
                      ? "rotate-90 text-purple-600"
                      : "text-gray-500"
                  }`}
                >
                  ▶
                </span>
              </button>

              {/* Accordion Content */}
              {openModule === module.moduleNumber && module.subModules && (
                <div className="bg-purple-50 px-6 py-4 space-y-6">
                  {module.subModules.map((subModule, index) => (
                    <div key={subModule._id} className="space-y-4">
                      {/* Main Lecture Section */}
                      <div
                        className="flex justify-between items-center bg-purple-600 px-4 py-3 rounded-lg shadow-md text-white cursor-pointer hover:bg-purple-700 transition"
                        onClick={() => handleVideoClick(subModule)}
                      >
                        <div className="flex items-center space-x-2">
                          <FaPlay />
                          <span>{subModule.sModuleTitle}</span>
                        </div>
                        <span>{formatDuration(subModule.sModuleDuration)}</span>
                      </div>

                      {/* Assignment Section (if needed) */}
                      <div
                        className="flex justify-between items-center px-4 py-2 bg-white rounded-lg shadow-md cursor-pointer hover:bg-purple-100 transition"
                        onClick={() => handleVideoClick(subModule)}
                      >
                        <span className="text-gray-800 font-medium">
                          {module.moduleNumber}.{subModule.sModuleNumber}. Module Content
                        </span>
                        <span className="text-gray-500 text-sm">
                          Reward: {module.reward} point{module.reward !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseAccordion;
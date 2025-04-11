

// "use client";

// import Sidebar from "@/app/DashBoard/Sidebar";
// import ProfileSection from "@/app/DashBoard/ProfileSection";


// const Quizzes = () => {
//   // Static quizzes data
//   const quizzes = [
//     {
//       id: 1,
//       status: "Done",
//       statusColor: "bg-green-500",
//       topic: "HTML & CSS",
//     },
//     {
//       id: 2,
//       status: "Pending",
//       statusColor: "bg-red-500",
//       topic: "JavaScript",
//     },
//     {
//       id: 3,
//       status: "Pending",
//       statusColor: "bg-red-500",
//       topic: "React.JS",
//     },
//   ];

//   // Sort quizzes to show pending first
//   const sortedQuizzes = quizzes.sort((a, b) => {
//     if (a.status === "Pending" && b.status === "Done") return -1;
//     if (a.status === "Done" && b.status === "Pending") return 1;
//     return 0;
//   });

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <div className="w-72 bg-white text-gray-800 border-r border-gray-200 p-1 flex flex-col justify-between">
//         <Sidebar />
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-6">
//         {/* Header */}
//         <h1 className="text-xl font-bold text-purple-600 mb-6">Quizzes</h1>

//         {/* Quizzes List */}
//         <div className="space-y-4">
//           {sortedQuizzes.map((quiz) => (
//             <div
//               key={quiz.id}
//               className="flex items-center justify-between bg-white border border-gray-200 shadow-sm rounded-lg p-4"
//             >
//               {/* Quiz Number */}
//               <div className="text-xl font-semi-bold text-purple-600">
//                 {quiz.id < 10 ? `0${quiz.id}` : quiz.id}
//               </div>

//               {/* Topic */}
//               <div className="flex-1 text-sm font-medium text-gray-800 text-center">
//                 {quiz.topic}
//               </div>

//               {/* Status */}
//               <div
//                 className={`flex items-center space-x-2 text-sm font-semibold ${
//                   quiz.status === "Done" ? "text-green-600" : "text-red-600"
//                 }`}
//               >
//                 <span className={`h-2 w-2 rounded-full ${quiz.statusColor}`}></span>
//                 <span>{quiz.status}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Profile Section */}
//       <div className="w-72 bg-white border-l border-gray-200">
//        <ProfileSection/>
      
      
//     </div>
//     </div>
//   );
// };

// export default Quizzes;


// pagex.tsx

import ProfileSection from "@/app/DashBoard/ProfileSection";
import QuizzesList from "./QuizzesList";
import { auth } from "../../../auth";


const Quizzes = async () => {
  const session = await auth();
  return (
    <div className="flex flex-row w-full h-screen">
      {/* Main Content */}
      <div className="flex-grow p-4">
        <QuizzesList />
      </div>
      <div className="w-72 bg-white border-l border-gray-200 ">
          <ProfileSection session={session} />
        </div>

    </div>
  );
};

export default Quizzes;

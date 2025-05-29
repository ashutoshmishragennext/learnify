// // app/rewards/page.tsx (Next.js 13+ with App Router)
// import { ICourse } from "@/app/models/Course";
// import React from "react";

// interface CoursePageProps{
//   course: ICourse;
// }

// type Reward = {
//   id: number;
//   title: string;
//   reward: number;
// };

// type RewardsProps = {
//   rewardsData: Reward[];
//   investment: number;
//   totalReward: number;
//   course: ICourse
// };

// const Rewards: React.FC<RewardsProps> = ({ rewardsData, investment, totalReward, course }) => {
//   return (
//     <div className="max-w-5xl mx-auto p-8 font-sans">
//       {/* Heading */}
//       <h3 className="text-2xl font-bold text-purple-600 border-b-2 border-purple-600 pb-2 mb-6">Rewards</h3>

//       {/* Rewards Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {rewardsData.map((item) => (
//           <div
//             key={item.id}
//             className="border-2 border-indigo-200 rounded-lg p-6 bg-indigo-50 hover:shadow-lg transition-shadow"
//           >
//             {/* Header */}
//             <div className="flex items-center mb-2">
//               <span className="text-xl font-bold text-purple-600 mr-2">{`0${item.id}`}</span>
//               <h4 className="text-lg font-semibold text-gray-800">{item.title}</h4>
//             </div>
//             {/* Line */}
//             <div className="h-0.5 bg-purple-600 mb-3"></div>
//             {/* Reward */}
//             <p className="text-red-500 font-semibold">{`Cash Reward: ${item.reward}`}</p>
//           </div>
//         ))}
//       </div>

//       {/* Footer */}
//       <div className="flex justify-between items-center mt-10 text-gray-800 font-bold">
//         <div>
//           <strong>You Invest: </strong>
//           <span className="text-green-600">{investment}</span>
//         </div>
//         <div>
//           <strong>Your Reward: </strong>
//           <span className="text-red-500">{totalReward}</span>
//         </div>
//       </div>

//       {/* Description */}
//       <div className="mt-12 space-y-6 text-gray-600">
//         <h4 className="text-xl font-bold text-gray-800">Description:</h4>
//         <p>
//           This case study explores the development of an innovative cashback system tailored for platforms that offer
//           modular services or content, such as online learning or subscription-based resources. The system operates on
//           a progressive pricing model where the cost of each successive module increases incrementally. This approach
//           ensures initial accessibility while introducing a sense of achievement and value as users advance.
//         </p>
//         <p>
//           To maintain user engagement and incentivize progress, the system integrates a cashback mechanism. Users
//           receive a predetermined percentage of the module price as cashback upon successful completion. This not only
//           offsets the rising cost of future modules but also reinforces a reward-driven experience, encouraging deeper
//           participation.
//         </p>
//         <p>
//           Participants in this case study will analyze user behavior, devise algorithms for dynamic pricing, and define
//           strategies to calculate and distribute cashback effectively. The project emphasizes balancing affordability,
//           user retention, and profitability while fostering a rewarding user journey.
//         </p>
//       </div>
//     </div>
//   );
// };

// const RewardsData : React.FC<CoursePageProps> = ({ course }) => {
//   // Sample data for rewards
//   const rewardsData = course.modules.map((module) => ({
//     key: module.moduleNumber,
//     id: module.moduleNumber,
//     title: `Module ${module.moduleNumber}`,
//     reward: module.reward
//   }));


//   const investment = course.price.original;
//   // const totalReward = course.rewards.totalReward;

//   return <Rewards rewardsData={rewardsData} investment={investment} totalReward={totalReward} course={course} />;
// }

// export default RewardsData;
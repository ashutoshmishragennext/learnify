

// "use client";
// import { useEffect, useState } from "react";

// const StatsBar: React.FC = () => {
//   // Define stats
//   const totalStudents = 500;
//   const coursesEnrolled = 300;
//   const coursesCompleted = 200;

//   const [students, setStudents] = useState(0);
//   const [enrolled, setEnrolled] = useState(0);
//   const [completed, setCompleted] = useState(0);

//   useEffect(() => {
//     const animateCount = (setCount: React.Dispatch<React.SetStateAction<number>>, target: number) => {
//       let current = 0;
//       const step = Math.ceil(target / 50);
//       const interval = setInterval(() => {
//         current += step;
//         if (current >= target) {
//           setCount(target);
//           clearInterval(interval);
//         } else {
//           setCount(current);
//         }
//       }, 30);
//     };

//     animateCount(setStudents, totalStudents);
//     animateCount(setEnrolled, coursesEnrolled);
//     animateCount(setCompleted, coursesCompleted);
//   }, []);

//   return (
//     <div className="flex justify-center space-x-16  p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg">
//       <div className="text-center transform hover:scale-105 transition duration-300">
//         <h2 className="text-4xl font-extrabold">
//           {students}+
//         </h2>
//         <p className="text-lg font-medium opacity-90">Total Students</p>
//       </div>
//       <div className="text-center transform hover:scale-105 transition duration-300">
//         <h2 className="text-4xl font-extrabold">
//           {enrolled}+
//         </h2>
//         <p className="text-lg font-medium opacity-90">Courses Enrolled</p>
//       </div>
//       <div className="text-center transform hover:scale-105 transition duration-300">
//         <h2 className="text-4xl font-extrabold">
//           {completed}+
//         </h2>
//         <p className="text-lg font-medium opacity-90">Courses Completed</p>
//       </div>
//     </div>
//   );
// };

// export default StatsBar;




"use client";
import { useEffect, useState } from "react";

const StatsBar: React.FC = () => {
  // Define stats
  const totalStudents = 500;
  const coursesEnrolled = 300;
  const coursesCompleted = 200;

  const [students, setStudents] = useState(0);
  const [enrolled, setEnrolled] = useState(0);
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    const animateCount = (setCount: React.Dispatch<React.SetStateAction<number>>, target: number) => {
      let current = 0;
      const step = Math.ceil(target / 50);
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          setCount(target);
          clearInterval(interval);
        } else {
          setCount(current);
        }
      }, 30);
    };

    animateCount(setStudents, totalStudents);
    animateCount(setEnrolled, coursesEnrolled);
    animateCount(setCompleted, coursesCompleted);
  }, []);

  return (
    <div className="flex justify-center space-x-48 p-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg">
      <div className="text-center transform hover:scale-105 transition duration-300">
        <h2 className="text-4xl font-extrabold">
          {students}+
        </h2>
        <p className="text-lg font-medium opacity-90">Total Students</p>
      </div>
      <div className="text-center transform hover:scale-105 transition duration-300">
        <h2 className="text-4xl font-extrabold">
          {enrolled}+
        </h2>
        <p className="text-lg font-medium opacity-90">Courses Enrolled</p>
      </div>
      <div className="text-center transform hover:scale-105 transition duration-300">
        <h2 className="text-4xl font-extrabold">
          {completed}+
        </h2>
        <p className="text-lg font-medium opacity-90">Courses Completed</p>
      </div>
    </div>
  );
};

export default StatsBar;

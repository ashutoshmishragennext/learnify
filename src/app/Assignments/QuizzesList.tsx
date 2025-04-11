"use client";

import Sidebar from "@/app/DashBoard/Sidebar";

const quizzes = [
  { id: 1, status: "Done", statusColor: "bg-green-500", topic: "HTML & CSS" },
  { id: 2, status: "Pending", statusColor: "bg-red-500", topic: "JavaScript" },
  { id: 3, status: "Pending", statusColor: "bg-red-500", topic: "React.JS" },
];

const sortedQuizzes = quizzes.sort((a, b) =>
  a.status === "Pending" && b.status === "Done" ? -1 : 1
);

const QuizzesList = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-72 bg-white text-gray-800 border-r border-gray-200 p-1 flex flex-col justify-between">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        
        <h1 className="text-xl font-bold text-purple-600 mb-6">Quizzes</h1>

        {/* Quizzes List */}
        <div className="space-y-4">
          {sortedQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="flex items-center justify-between bg-white border border-gray-200 shadow-sm rounded-lg p-4"
            >
              <div className="text-xl font-semi-bold text-purple-600">
                {quiz.id < 10 ? `0${quiz.id}` : quiz.id}
              </div>
              <div className="flex-1 text-sm font-medium text-gray-800 text-center">
                {quiz.topic}
              </div>
              <div
                className={`flex items-center space-x-2 text-sm font-semibold ${
                  quiz.status === "Done" ? "text-green-600" : "text-red-600"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${quiz.statusColor}`}></span>
                <span>{quiz.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizzesList;

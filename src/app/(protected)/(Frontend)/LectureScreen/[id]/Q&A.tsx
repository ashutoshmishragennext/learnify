// import React, { useState } from "react";
// import { BsArrowUp, BsChatDots } from "react-icons/bs";

// const QandA: React.FC = () => {
//   // Sample Data (stored in state for dynamic updates)
//   const [qandaData, setQandaData] = useState({
//     featuredQuestions: [
//       {
//         id: 1,
//         user: "Prakash",
//         lecture: "Lecture 1",
//         yearsAgo: 4,
//         question: "Joining 400,000 other ZTM students and getting the most out of this course",
//         details: "In order to truly get everything out of this course, we have provided some common things that past...",
//         upvotes: 268,
//         comments: 2,
//         isUpvoted: false, // Track if user has upvoted
//       },
//       {
//         id: 2,
//         user: "Kunal",
//         lecture: "Lecture 4",
//         yearsAgo: 3,
//         question: "Joining 400,000 other ZTM students and getting the most out of this course",
//         details: "In order to truly get everything out of this course, we have provided some common things that past...",
//         upvotes: 56,
//         comments: 1,
//         isUpvoted: false,
//       }
//     ],
//     allQuestions: [
//       {
//         id: 3,
//         user: "Harsh",
//         lecture: "Lecture 15",
//         yearsAgo: 4,
//         question: "Figma",
//         details: "This course is also about using figma, but the instructor is using something else?",
//         upvotes: 148,
//         comments: 21,
//         isUpvoted: false,
//       }
//     ]
//   });

//   // Function to handle upvote click (Toggle)
//   const handleUpvote = (questionId: number) => {
//     setQandaData((prevData) => ({
//       featuredQuestions: prevData.featuredQuestions.map((q) =>
//         q.id === questionId
//           ? { ...q, upvotes: q.isUpvoted ? q.upvotes - 1 : q.upvotes + 1, isUpvoted: !q.isUpvoted }
//           : q
//       ),
//       allQuestions: prevData.allQuestions.map((q) =>
//         q.id === questionId
//           ? { ...q, upvotes: q.isUpvoted ? q.upvotes - 1 : q.upvotes + 1, isUpvoted: !q.isUpvoted }
//           : q
//       ),
//     }));
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       {/* Search Bar */}
//       <div className="flex items-center border rounded-lg px-4 py-2 shadow-sm w-full">
//         <input
//           type="text"
//           placeholder="Search all course questions"
//           className="flex-grow focus:outline-none"
//         />
//         <button className="text-purple-600 text-lg">🔍</button>
//       </div>

//       {/* Filters & Sort */}
//       <div className="flex justify-between items-center mt-4">
//         <div className="flex items-center gap-2">
//           <label className="font-semibold">Filters:</label>
//           <select className="border p-2 rounded">
//             <option>All lectures</option>
//             <option>Current lectures</option>
//           </select>
//         </div>
//         <div className="flex items-center gap-2">
//           <label className="font-semibold">Sort by:</label>
//           <select className="border p-2 rounded">
//             <option>Sort by recommended</option>
//             <option>Sort by most recent</option>
//             <option>Sort by Upvoted</option>
//           </select>
//         </div>
       
//       </div>

//       {/* Featured Questions */}
//       <h2 className="font-bold text-xl mt-6">
//         Featured questions in this course <span className="text-gray-500">({qandaData.featuredQuestions.length})</span>
//       </h2>
//       {qandaData.featuredQuestions.map((q) => (
//         <div key={q.id} className="bg-gray-100 p-4 mt-3 rounded-lg shadow-md flex justify-between">
//           <div>
//             <p className="font-semibold text-lg">{q.question}</p>
//             <p className="text-gray-600 text-sm">{q.details}</p>
//             <p className="text-purple-600 text-sm mt-1">
//               {q.user} · {q.lecture} · {q.yearsAgo} years ago
//             </p>
//           </div>
//           <div className="flex flex-col items-center text-gray-500">
//             <button 
//               className={`flex items-center text-lg hover:text-purple-600 ${
//                 q.isUpvoted ? "text-purple-600 font-bold" : ""
//               }`}
//               onClick={() => handleUpvote(q.id)}
//             >
//               {q.upvotes} <BsArrowUp className="ml-1 cursor-pointer" />
//             </button>
//             <span className="flex items-center text-lg mt-2">
//               {q.comments} <BsChatDots className="ml-1" />
//             </span>
//           </div>
//         </div>
//       ))}

//       {/* All Questions */}
//       <h2 className="font-bold text-xl mt-6">
//         All questions in this course <span className="text-gray-500">({qandaData.allQuestions.length})</span>
//       </h2>
//       {qandaData.allQuestions.map((q) => (
//         <div key={q.id} className="bg-gray-100 p-4 mt-3 rounded-lg shadow-md flex justify-between">
//           <div>
//             <p className="font-semibold text-lg">{q.question}</p>
//             <p className="text-gray-600 text-sm">{q.details}</p>
//             <p className="text-purple-600 text-sm mt-1">
//               {q.user} · {q.lecture} · {q.yearsAgo} years ago
//             </p>
//           </div>
//           <div className="flex flex-col items-center text-gray-500">
//             <button 
//               className={`flex items-center text-lg hover:text-purple-600 ${
//                 q.isUpvoted ? "text-purple-600 font-bold" : ""
//               }`}
//               onClick={() => handleUpvote(q.id)}
//             >
//               {q.upvotes} <BsArrowUp className="ml-1 cursor-pointer" />
//             </button>
//             <span className="flex items-center text-lg mt-2">
//               {q.comments} <BsChatDots className="ml-1" />
//             </span>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default QandA;




import React, { useState } from "react";
import { BsArrowUp, BsChatDots } from "react-icons/bs";

// Define Question type
interface Question {
  id: number;
  user: string;
  lecture: string;
  yearsAgo: number;
  question: string;
  details: string;
  upvotes: number;
  comments: string[];
  isUpvoted: boolean;
  showChat: boolean;
}

// Define Q&A data structure
interface QandAData {
  featuredQuestions: Question[];
  allQuestions: Question[];
}

const QandA: React.FC = () => {
  const [newQuestion, setNewQuestion] = useState(""); // Store new question input
  const [qandaData, setQandaData] = useState<QandAData>({
    featuredQuestions: [
      {
        id: 1,
        user: "Prakash",
        lecture: "Lecture 1",
        yearsAgo: 4,
        question: "Joining 400,000 other ZTM students and getting the most out of this course",
        details: "In order to truly get everything out of this course, we have provided some common things that past...",
        upvotes: 268,
        comments: [],
        isUpvoted: false,
        showChat: false, // Controls chat visibility
      },
    ],
    allQuestions: [],
  });

  // Function to handle upvote click (Toggle)
  const handleUpvote = (questionId: number) => {
    setQandaData((prevData) => ({
      featuredQuestions: prevData.featuredQuestions.map((q: Question) =>
        q.id === questionId
          ? { ...q, upvotes: q.isUpvoted ? q.upvotes - 1 : q.upvotes + 1, isUpvoted: !q.isUpvoted }
          : q
      ),
      allQuestions: prevData.allQuestions.map((q: Question) =>
        q.id === questionId
          ? { ...q, upvotes: q.isUpvoted ? q.upvotes - 1 : q.upvotes + 1, isUpvoted: !q.isUpvoted }
          : q
      ),
    }));
  };

  // Function to add a new question
  const handleAddQuestion = () => {
    if (newQuestion.trim() === "") return;

    const newQ: Question = {
      id: Date.now(),
      user: "Random",
      lecture: "General",
      yearsAgo: 0,
      question: newQuestion,
      details: "",
      upvotes: 0,
      comments: [],
      isUpvoted: false,
      showChat: false,
    };

    setQandaData((prev) => ({
      ...prev,
      allQuestions: [newQ, ...prev.allQuestions],
    }));

    setNewQuestion(""); // Reset input field
  };

  // Function to toggle chat visibility
  const toggleChat = (questionId: number) => {
    setQandaData((prev) => ({
      featuredQuestions: prev.featuredQuestions.map((q: Question) =>
        q.id === questionId ? { ...q, showChat: !q.showChat } : q
      ),
      allQuestions: prev.allQuestions.map((q: Question) =>
        q.id === questionId ? { ...q, showChat: !q.showChat } : q
      ),
    }));
  };

  // Function to add a chat message
  const addChatMessage = (questionId: number, message: string) => {
    if (!message.trim()) return;

    setQandaData((prev) => ({
      featuredQuestions: prev.featuredQuestions.map((q: Question) =>
        q.id === questionId ? { ...q, comments: [...q.comments, message] } : q
      ),
      allQuestions: prev.allQuestions.map((q: Question) =>
        q.id === questionId ? { ...q, comments: [...q.comments, message] } : q
      ),
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Add Question */}
      <div className="flex items-center border rounded-lg px-4 py-2 shadow-sm w-full">
        <input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Write your question..."
          className="flex-grow focus:outline-none"
        />
        <button
          onClick={handleAddQuestion}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg ml-2"
        >
          Submit
        </button>
      </div>

      {/* Display Questions */}
      {[...qandaData.featuredQuestions, ...qandaData.allQuestions].map((q) => (
        <div key={q.id} className="bg-gray-100 p-4 mt-3 rounded-lg shadow-md">
          <p className="font-semibold text-lg">{q.question}</p>
          <p className="text-purple-600 text-sm">{q.user} · {q.lecture} · {q.yearsAgo} years ago</p>

          <div className="flex justify-between mt-2">
            <button
              className={`text-lg hover:text-purple-600 ${q.isUpvoted ? "text-purple-600 font-bold" : ""}`}
              onClick={() => handleUpvote(q.id)}
            >
              {q.upvotes} <BsArrowUp className="inline ml-1" />
            </button>

            <button onClick={() => toggleChat(q.id)} className="text-lg hover:text-purple-600">
              {q.comments.length} <BsChatDots className="inline ml-1" />
            </button>
          </div>

          {/* Chat Section */}
          {q.showChat && (
            <div className="mt-3 bg-white p-2 rounded-md border">
              <input
                type="text"
                placeholder="Write a message..."
                className="border p-1 rounded w-full"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addChatMessage(q.id, e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
              />
              <div className="mt-2">
                {q.comments.map((comment, index) => (
                  <p key={index} className="text-gray-700 text-sm mt-1">💬 {comment}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default QandA;

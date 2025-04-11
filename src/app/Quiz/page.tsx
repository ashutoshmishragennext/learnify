

"use client";
import React, { useState } from "react";
import Question from "./Question";

type QuestionType = {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
};

const Quiz: React.FC = () => {
  const quizData: QuestionType[] = [
    {
      id: 1,
      question: "What is TypeScript?",
      options: [
        "A superset of JavaScript",
        "A database",
        "A CSS framework",
        "A Python library",
      ],
      correctAnswerIndex: 0,
    },
    {
      id: 2,
      question: "Which of the following is not a binary tree type?",
      options: [
        "Full Binary Tree",
        "Complete Binary Tree",
        "Array Binary Tree",
        "Perfect Binary Tree",
      ],
      correctAnswerIndex: 2,
    },
    {
      id: 3,
      question: "Which CSS property is used for flexbox layout?",
      options: ["display", "position", "float", "grid-template"],
      correctAnswerIndex: 0,
    },
  ];

  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    Array(quizData.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);

  const handleAnswerChange = (questionId: number, answerIndex: number) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[questionId - 1] = answerIndex;
    setSelectedAnswers(updatedAnswers);
  };

  const calculateScore = () => {
    return quizData.reduce((score, question, index) => {
      return question.correctAnswerIndex === selectedAnswers[index] ? score + 1 : score;
    }, 0);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-500 min-h-screen flex justify-center items-center px-6 py-10">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Quiz</h1>

        {quizData.map((question) => (
          <Question
            key={question.id}
            question={question}
            selectedAnswer={selectedAnswers[question.id - 1]}
            onAnswerChange={handleAnswerChange}
          />
        ))}

        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowResults(true)}
            className="bg-purple-600 text-white py-3 px-8 rounded-lg hover:bg-purple-700 font-semibold shadow-md"
          >
            Submit
          </button>
        </div>

        {showResults && (
          <div className="mt-6 text-center">
            <p className="text-lg font-semibold">
              Your Score: {calculateScore()} / {quizData.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;

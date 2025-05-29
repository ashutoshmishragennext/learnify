

import React from "react";

type QuestionProps = {
  question: {
    id: number;
    question: string;
    options: string[];
    correctAnswerIndex: number;
  };
  selectedAnswer: number | null;
  onAnswerChange: (questionId: number, answerIndex: number) => void;
};

const Question: React.FC<QuestionProps> = ({
  question,
  selectedAnswer,
  onAnswerChange,
}) => {
  return (
    <div className="mb-8 bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-md">
      {/* Question Number and Text */}
      <div className="flex items-center mb-4">
        <p className="text-2xl font-bold text-gray-700 mr-4">{question.id}.</p>
        <p className="text-lg font-semibold text-gray-800">{question.question}</p>
      </div>

      {/* Options (Two Columns) */}
      <div className="grid grid-cols-2 gap-6">
        {question.options.map((option, index) => (
          <div
            key={index}
            className={`flex items-center space-x-4 p-4 rounded-lg cursor-pointer border ${
              selectedAnswer === index
                ? "bg-purple-100 border-purple-500"
                : "border-gray-300"
            } hover:bg-purple-50`}
            onClick={() => onAnswerChange(question.id, index)}
          >
            <input
              type="radio"
              id={`question-${question.id}-option-${index}`}
              name={`question-${question.id}`}
              value={index}
              checked={selectedAnswer === index}
              onChange={() => onAnswerChange(question.id, index)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500"
            />
            <label
              htmlFor={`question-${question.id}-option-${index}`}
              className="text-base text-gray-700"
            >
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Question;

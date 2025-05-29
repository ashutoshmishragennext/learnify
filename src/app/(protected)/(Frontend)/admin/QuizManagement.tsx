"use client";
import React, { useState } from 'react';

type Quiz = {
  number: string;
  topic: string;
  lastDate: string;
  status: string;
  maxMarks: string;
  obtainedMarks: string;
};

const QuizManagement: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([
    { number: '', topic: '', lastDate: '', status: '', maxMarks: '', obtainedMarks: '' },
  ]);

  const handleInputChange = (index: number, field: keyof Quiz, value: string) => {
    const updatedQuizzes = [...quizzes];
    updatedQuizzes[index][field] = value;
    setQuizzes(updatedQuizzes);
  };

  const addQuizRow = () => {
    setQuizzes([
      ...quizzes,
      { number: '', topic: '', lastDate: '', status: '', maxMarks: '', obtainedMarks: '' },
    ]);
  };

  return (
    <div className="flex-grow p-8">
      <h1 className="text-3xl font-bold text-purple-600 mb-6">New Quiz</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Number</th>
            <th className="border border-gray-300 px-4 py-2">Topic</th>
            <th className="border border-gray-300 px-4 py-2">Last Date</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">Max Marks</th>
            <th className="border border-gray-300 px-4 py-2">Obtained Marks</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="text"
                  value={quiz.number}
                  onChange={(e) => handleInputChange(index, 'number', e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="text"
                  value={quiz.topic}
                  onChange={(e) => handleInputChange(index, 'topic', e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="date"
                  value={quiz.lastDate}
                  onChange={(e) => handleInputChange(index, 'lastDate', e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="text"
                  value={quiz.status}
                  onChange={(e) => handleInputChange(index, 'status', e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="number"
                  value={quiz.maxMarks}
                  onChange={(e) => handleInputChange(index, 'maxMarks', e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="number"
                  value={quiz.obtainedMarks}
                  onChange={(e) => handleInputChange(index, 'obtainedMarks', e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between">
        <button
          onClick={addQuizRow}
          className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
        >
          Add Field
        </button>
        <button className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700">
          Update
        </button>
      </div>
    </div>
  );
};

export default QuizManagement;

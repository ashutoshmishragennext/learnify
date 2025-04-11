"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";

const NotesPage = () => {
  const [notes, setNotes] = useState<string[]>([""]); // Start with one input box

  const handleNoteSubmit = (index: number, value: string) => {
    if (value.trim() !== "") {
      console.log(`New Note ${index + 1}:`, value);
    }
  };

  const addNewNote = () => {
    setNotes([...notes, ""]); // Add new empty note
  };

  const updateNote = (index: number, value: string) => {
    const updatedNotes = [...notes];
    updatedNotes[index] = value;
    setNotes(updatedNotes);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Note Input Boxes */}
      {notes.map((note, index) => (
        <div
          key={index}
          className="relative flex items-center border border-gray-300 rounded-lg px-4 py-2 shadow-sm mt-2"
        >
          <input
            type="text"
            placeholder={`Create a new note at 0:00`}
            value={note}
            onChange={(e) => updateNote(index, e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleNoteSubmit(index, note)}
            className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
      ))}

      {/* "+" Button to Add a New Note */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={addNewNote}
          className="flex items-center space-x-2 text-purple-600 border border-purple-500 rounded-lg px-4 py-2 text-sm font-medium hover:bg-purple-100"
        >
          <FaPlus />
          <span>New Note</span>
        </button>
      </div>

       {/* Filter & Sorting Options */}
       <div className="mt-6 flex flex-wrap gap-4 justify-center">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Filters:</label>
          <select className="border border-gray-300 p-2 rounded-md shadow-sm bg-white focus:ring-2 focus:ring-purple-500">
            <option>All lectures</option>
            <option>Current lectures</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Sort by:</label>
          <select className="border border-gray-300 p-2 rounded-md shadow-sm bg-white focus:ring-2 focus:ring-purple-500">
            <option>Sort by recommended</option>
            <option>Sort by most recent</option>
            <option>Sort by Upvoted</option>
          </select>
        </div>
      </div>

     
    </div>
  );
};

export default NotesPage;

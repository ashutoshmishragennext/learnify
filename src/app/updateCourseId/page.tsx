"use client";
import React, { useState } from "react";

function UpdateCourseId() {
  const [message, setMessage] = useState("Button not pressed yet!");
  const [courses, setCourses] = useState("Press the button to see results.");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClick = async () => {
    try {
      setIsProcessing(true);
      const response = await fetch("/api/updateId");
      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setCourses(JSON.stringify(data.updatedCourses, null, 2)); // Display updated courses
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error in fetching API:", error);
      setMessage("Error in fetching API.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <h1>{message}</h1>
      <p>Updated docs:</p>
      <pre>{courses}</pre> {/* Display updated courses */}
      <button onClick={handleClick} disabled={isProcessing}>
        {isProcessing ? "Processing..." : "Update IDs"}
      </button>
    </div>
  );
}

export default UpdateCourseId;

"use client";
import React from "react";
import CaseStudy from "@/app/CaseStudy/CaseStudyData";

const CaseStudyData: React.FC = () => {
  const caseStudyData = {
    title: "Case Study 1",
    reward: "₹500",
    objective:
      "Develop a basic webpage skeleton that serves as a foundation for a fully functional website. This case study introduces fundamental HTML, CSS, and JavaScript concepts, allowing students to practice creating a structured and interactive webpage.",
    scenario:
      "You have been hired as a web developer for a startup company called TechScope, which aims to build an online platform for showcasing innovative technology products. The company has requested you to create a webpage skeleton that meets the following requirements.",
    requirements: [
      {
        title: "Structure",
        details: [
          "Header: Company logo and navigation menu.",
          "Hero Section: A banner with a title and tagline.",
          "About Section: A brief description of the company.",
          "Product Section: A placeholder for displaying a list of products.",
          "Footer: Contact information and social media links.",
        ],
      },
      {
        title: "Styling",
        details: [
          "Set a background color for the header and footer.",
          "Use consistent font styles across the webpage.",
          "Ensure responsive design by using a flexible grid or simple media queries.",
        ],
      },
      {
        title: "Interactivity",
        details: [
          "Add a button in the hero section that triggers a simple JavaScript alert saying, 'Welcome to TechScope!'",
          "Include a hover effect for navigation menu items using CSS.",
        ],
      },
    ],
    steps: [
      {
        category: "HTML",
        items: [
          "Create an index.html file.",
          "Structure the webpage using HTML tags (e.g., <header>, <main>, <footer>).",
          "Add a navigation bar with links to 'Home,' 'About,' and 'Products.'",
        ],
      },
      {
        category: "CSS",
        items: [
          "Create a style.css file.",
          "Apply styling to the webpage.",
          "Ensure the design is user-friendly and visually appealing.",
        ],
      },
      {
        category: "JavaScript",
        items: [
          "Create a script.js file.",
          "Write a function to display the alert when the hero section button is clicked.",
          "Connect the script to the HTML.",
        ],
      },
    ],
    deliverables: [
      { description: "Submit a zipped folder containing:" },
      { description: "index.html" },
      { description: "style.css" },
      { description: "script.js" },
    ],
    evaluation: {
      criteria: [
        "Proper use of semantic HTML.",
        "A clean and responsive layout with CSS.",
        "Working interactivity via JavaScript.",
        "Adherence to the requirements and attention to detail in design.",
      ],
    },
    uploadAction: () => alert("Upload functionality not implemented yet!"),
  };

  return <CaseStudy {...caseStudyData} />;
};

export default CaseStudyData;

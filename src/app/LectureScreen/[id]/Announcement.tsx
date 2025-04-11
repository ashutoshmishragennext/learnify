"use client";

import { useState } from "react";
import Image from "next/image";

const announcementData = {
  id: 1,
  author: {
    name: "Harsh",
    avatar: "/main.jpg", // Ensure this image exists in the public folder
  },
  timeAgo: "18 days ago",
  title: "The AI Limit...",
  subtitle: "The AI Limits? DeepSeek Open Week?",
  content:
    "We cover last month's biggest tech news so you can stay up to date with the industry. Here are the top stories and resources to keep an eye on this month:",
  links: [
    { title: "AI & Machine Learning Monthly", url: "#" },
    { title: "Web Developer Monthly", url: "#" },
    { title: "Python Monthly", url: "#" },
  ],
  description:
    "Imagine not having to constantly read tech news, blog posts, and watch YouTube videos to stay up to date with the industry. Imagine having to read just ONE THING a month and be on top of everything and be much better off spending your time somewhere more productive? This is why we created the above newsletters!",
};

// Simulated logged-in user
const loggedInUser = {
  name: "Harsh",
  avatar: "/signup.png", // user profile
};

const Announcement = () => {
    const [comment, setComment] = useState("");

    const handleCommentSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && comment.trim() !== "") {
        console.log("User Comment:", comment);
        setComment(""); // Clear input field after submission
      }
    };
  return (
    <div className="max-w-3xl mx-auto p-6 border border-gray-300 rounded-lg bg-white shadow-md">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Image
          src={announcementData.author.avatar}
          alt="Profile"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <p className="text-sm font-semibold text-purple-600 hover:underline cursor-pointer">
            {announcementData.author.name}
          </p>
          <p className="text-xs text-gray-500">
            posted an announcement · {announcementData.timeAgo}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mt-4">
        <h2 className="text-lg font-extrabold">{announcementData.title}</h2>
        <h3 className="text-md font-bold text-gray-800">{announcementData.subtitle}</h3>
        <p className="text-gray-600 mt-2">{announcementData.content}</p>

        {/* Links */}
        <ul className="mt-3">
          {announcementData.links.map((link, index) => (
            <li key={index} className="text-sm font-semibold text-purple-600 hover:underline">
              - <a href={link.url}>{link.title}</a>
            </li>
          ))}
        </ul>
      </div>

      {/* Description */}
      <p className="mt-4 italic text-sm text-gray-500">{announcementData.description}</p>

      {/* Comment Box */}
      <div className="mt-4 flex items-center space-x-3">
        <Image
          src={loggedInUser.avatar}
          alt="User Profile"
          width={36}
          height={36}
          className="rounded-full border border-gray-300"
        />
        <input
          type="text"
          placeholder="Enter your comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={handleCommentSubmit}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default Announcement;

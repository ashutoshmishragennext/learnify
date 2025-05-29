"use client";

// import { useState } from "react";

import { BellIcon } from "@heroicons/react/24/outline"; 


type Notification = {
  id: number;
  title: string;
  message: string;
  time: string;
};

const Notification = () => {
  

  const notifications = ([
    { id: 1, title: "New Course Available!", message: "A new React course has been added to the library.", time: "2 hours ago" },
    { id: 2, title: "Assignment Due", message: "Your JavaScript assignment is due tomorrow.", time: "5 hours ago" },
    { id: 3, title: "Reminder: Live Session", message: "Join the live session on Machine Learning at 6 PM today.", time: "1 day ago" },
    { id: 4, title: "Assignment Due", message: "Your React assignment is due tomorrow.", time: "5 hours ago" },
  ]);

  return (
    <div className="w-full flex justify-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        {/* Notifications Header */}
        <h2 className="text-2xl md:text-3xl font-bold text-purple-600 mb-4 flex items-center justify-center md:justify-start">
          <BellIcon className="h-7 w-7 md:h-8 md:w-8 text-purple-600 mr-2" /> Notifications
        </h2>

        {/* No Notifications Message */}
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-lg text-center">No notifications.</p>
        ) : (
          <ul className="space-y-4">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className="p-4 bg-gray-100 border-l-4 border-blue-500 rounded-lg shadow-sm transition duration-200 hover:bg-blue-50"
              >
                <h3 className="text-lg font-semibold text-gray-800">{notification.title}</h3>
                <p className="text-gray-600">{notification.message}</p>
                <span className="text-sm text-gray-400">{notification.time}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notification;

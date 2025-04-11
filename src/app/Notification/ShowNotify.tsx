

// "use client";

// import React, { useState } from "react";
// import Notification from "../Notification/Notification";
// import Sidebar from "../DashBoard/Sidebar";
// import ProfileSection from "../DashBoard/ProfileSection";
// import { useSession } from "next-auth/react";
// import { IoPersonCircleOutline, IoClose, IoMenu } from "react-icons/io5";

// const ShowNotify = () => {
//   const { data: session } = useSession();
  
//   // State to handle Sidebar & Profile Section toggling in mobile view
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);

//   return (
//     <div className="flex flex-col h-screen bg-gray-50">
//       {/* Mobile Navigation Buttons */}
//       <div className="md:hidden flex justify-between p-4 bg-white shadow-md z-50">
//         {/* Open Sidebar Button */}
//         <button onClick={() => { setIsSidebarOpen(true); setIsProfileOpen(false); }}>
//           <IoMenu size={32} className="text-gray-700" />
//         </button>
//         {/* Open Profile Button */}
//         <button onClick={() => { setIsProfileOpen(true); setIsSidebarOpen(false); }}>
//           <IoPersonCircleOutline size={32} className="text-gray-700" />
//         </button>
//       </div>

//       {/* Main Layout */}
//       <div className="flex flex-grow">
//         {/* Sidebar - Always Visible on Desktop */}
//         <div className="hidden md:block w-64 bg-white text-gray-800 border-r border-gray-200">
//           <Sidebar />
//         </div>

//         {/* Mobile Sidebar (Slide-in) */}
//         {isSidebarOpen && (
//           <div className="fixed inset-0 z-50 bg-black bg-opacity-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
//         )}
//         <div className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r transform transition-transform duration-300 md:hidden z-50 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
//           {/* Close Button */}
//           <button className="absolute top-4 right-4 text-gray-600" onClick={() => setIsSidebarOpen(false)}>
//             <IoClose size={30} />
//           </button>
//           <Sidebar />
//         </div>

//         {/* Notification Content (Center) */}
//         <div className="flex-1 px-4">
//           <Notification />
//         </div>

//         {/* Profile Section - Always Visible on Desktop */}
//         <div className="hidden md:block w-72 bg-white border-l border-gray-200">
//           <ProfileSection session={session} />
//         </div>

//         {/* Mobile Profile Section (Slide-in) */}
//         {isProfileOpen && (
//           <div className="fixed inset-0 z-50 bg-black bg-opacity-40 md:hidden" onClick={() => setIsProfileOpen(false)}></div>
//         )}
//         <div className={`fixed right-0 top-0 h-full w-72 bg-white shadow-lg border-l transform transition-transform duration-300 md:hidden z-50 ${isProfileOpen ? "translate-x-0" : "translate-x-full"}`}>
//           {/* Close Button */}
//           <button className="absolute top-4 right-4 text-gray-600" onClick={() => setIsProfileOpen(false)}>
//             <IoClose size={30} />
//           </button>
//           <ProfileSection session={session} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShowNotify;

"use client";

import React, { useState } from "react";
import Notification from "../Notification/Notification";
import Sidebar from "../DashBoard/Sidebar";
import ProfileSection from "../DashBoard/ProfileSection";
import { useSession } from "next-auth/react";
import { IoPersonCircleOutline, IoClose, IoMenu } from "react-icons/io5";

const ShowNotify = () => {
  const { data: session } = useSession();
  
  // State to handle Sidebar & Profile Section toggling in mobile view
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Mobile Navigation Buttons */}
      <div className="md:hidden flex justify-between p-4 bg-white shadow-md z-50">
        {/* Open Sidebar Button */}
        <button onClick={() => { setIsSidebarOpen(true); setIsProfileOpen(false); }}>
          <IoMenu size={32} className="text-gray-700" />
        </button>
        {/* Open Profile Button */}
        <button onClick={() => { setIsProfileOpen(true); setIsSidebarOpen(false); }}>
          <IoPersonCircleOutline size={32} className="text-gray-700" />
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-grow">
        {/* Sidebar - 20% width on larger screens */}
        <div className="hidden md:block w-1/5 bg-white text-gray-800 border-r border-gray-200">
          <Sidebar />
        </div>

        {/* Mobile Sidebar (Slide-in) */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
        )}
        <div className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r transform transition-transform duration-300 md:hidden z-50 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          {/* Close Button */}
          <button className="absolute top-4 right-4 text-gray-600" onClick={() => setIsSidebarOpen(false)}>
            <IoClose size={30} />
          </button>
          <Sidebar />
        </div>

        {/* Notification Content (60% width) */}
        <div className="w-full md:w-3/5 px-4">
          <Notification />
        </div>

        {/* Profile Section - 20% width on larger screens */}
        <div className="hidden md:block w-1/5 bg-white border-l border-gray-200">
          <ProfileSection session={session} />
        </div>

        {/* Mobile Profile Section (Slide-in) */}
        {isProfileOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-40 md:hidden" onClick={() => setIsProfileOpen(false)}></div>
        )}
        <div className={`fixed right-0 top-0 h-full w-72 bg-white shadow-lg border-l transform transition-transform duration-300 md:hidden z-50 ${isProfileOpen ? "translate-x-0" : "translate-x-full"}`}>
          {/* Close Button */}
          <button className="absolute top-4 right-4 text-gray-600" onClick={() => setIsProfileOpen(false)}>
            <IoClose size={30} />
          </button>
          <ProfileSection session={session} />
        </div>
      </div>
    </div>
  );
};

export default ShowNotify;

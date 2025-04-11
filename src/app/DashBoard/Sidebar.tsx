"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsGear, BsInbox, BsBook, BsCheckSquare, BsBoxArrowRight } from "react-icons/bs";
import { FaUserFriends, FaBars, FaTimes } from "react-icons/fa";
import { signOut } from "next-auth/react";

const handleLogout = async () => {
  await signOut({ redirect: true, callbackUrl: "/login" });
};

const sidebarConfig = {
  logo: "LEARNIFY",
  mainSections: [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", icon: <BsInbox className="text-xl" />, href: "/DashBoard" },
        { label: "Rewards", icon: <BsInbox className="text-xl" />, href: "/Rewards" },
        { label: "Assignments", icon: <BsBook className="text-xl" />, href: "/Assignments" },
        { label: "Notifications", icon: <BsCheckSquare className="text-xl" />, href: "/Notification" },
        { label: "Group", icon: <FaUserFriends className="text-xl" />, href: "/group" },
      ],
    },
  ],
  accountSection: [{ label: "Settings", icon: <BsGear className="text-xl" />, href: "/settings" }],
};

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // Sidebar starts collapsed

  return (
    <>
      {/* Toggle Button */}
      <button
        className="fixed top-4 left-6 z-50 text-2xl  text-purple-600 bg-white p-1 rounded-full shadow-md border border-gray-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar Container */}
      <div
        className={`fixed inset-y-0 left-0 z-40 bg-white text-gray-800 border-r border-gray-200 flex flex-col transition-all duration-300 ${
          isOpen ? "w-64" : "w-16"
        } pt-16`}
      >
        {/* Logo (only visible when sidebar is open) */}
        {isOpen && (
          <div className="p-4">
            <Link href="/">
              <div className="text-xl font-bold text-purple-600 text-center cursor-pointer">
                {sidebarConfig.logo}
              </div>
            </Link>
          </div>
        )}

        {/* Main Sections */}
        <div className="flex-grow p-4 space-y-4">
          {sidebarConfig.mainSections.map((section, index) => (
            <div key={index}>
              {isOpen && (
                <h3 className="text-gray-400 text-sm uppercase mb-2">{section.title}</h3>
              )}
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={itemIndex}>
                      <Link href={item.href}>
                        <div
                          className={`relative group flex items-center ${
                            isOpen ? "space-x-3 p-2 rounded-lg" : "justify-center p-2"
                          } cursor-pointer transition ${
                            isActive
                              ? "text-purple-600 font-semibold border-2 border-purple-600"
                              : "hover:bg-purple-100"
                          }`}
                        >
                          {item.icon}
                          {isOpen ? (
                            <span>{item.label}</span>
                          ) : (
                            <span className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-purple-400 text-white text-sm px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                              {item.label}
                            </span>
                          )}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Account Section & Logout */}
        <div className="border-t border-gray-200 p-4 space-y-2">
          <ul className="space-y-2">
            {sidebarConfig.accountSection.map((item, itemIndex) => {
              const isActive = pathname === item.href;
              return (
                <li key={itemIndex}>
                  <Link href={item.href}>
                    <div
                      className={`relative group flex items-center ${
                        isOpen ? "space-x-3 p-2 rounded-lg" : "justify-center p-2"
                      } cursor-pointer transition ${
                        isActive
                          ? "text-purple-600 font-semibold border-2 border-purple-600"
                          : "hover:bg-purple-100"
                      }`}
                    >
                      {item.icon}
                      {isOpen ? (
                        <span>{item.label}</span>
                      ) : (
                        <span className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-purple-400 text-white text-sm px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.label}
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}

            {/* Logout */}
            <li className="relative group">
              {isOpen ? (
                <div
                  onClick={handleLogout}
                  className="flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition hover:bg-purple-100 text-gray-800"
                >
                  <BsBoxArrowRight className="text-xl" />
                  <span>Logout</span>
                </div>
              ) : (
                <div
                  onClick={handleLogout}
                  className="flex items-center justify-center p-2 cursor-pointer transition hover:bg-purple-100 text-gray-800"
                >
                  <BsBoxArrowRight className="text-xl" />
                </div>
              )}
              {!isOpen && (
                <span className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-purple-400 text-white text-sm px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  Logout
                </span>
              )}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;




// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { BsGear, BsInbox, BsBook, BsCheckSquare, BsBoxArrowRight } from "react-icons/bs";
// import { FaUserFriends, FaBars, FaTimes } from "react-icons/fa";
// import { signOut } from "next-auth/react";

// const handleLogout = async () => {
//   await signOut({ redirect: true, callbackUrl: "/login" });
// };

// const sidebarConfig = {
//   logo: "LEARNIFY",
//   mainSections: [
//     {
//       title: "Overview",
//       items: [
//         { label: "Dashboard", icon: <BsInbox className="text-lg" />, href: "/DashBoard" },
//         { label: "Rewards", icon: <BsInbox className="text-lg" />, href: "/Rewards" },
//         { label: "Assignments", icon: <BsBook className="text-lg" />, href: "/Assignments" },
//         { label: "Notifications", icon: <BsCheckSquare className="text-lg" />, href: "/Notification" },
//         { label: "Group", icon: <FaUserFriends className="text-lg" />, href: "/group" },
//       ],
//     },
//   ],
//   accountSection: [{ label: "Settings", icon: <BsGear className="text-lg" />, href: "/settings" }],
// };

// const Sidebar: React.FC = () => {
//   const pathname = usePathname();
//   const [isOpen, setIsOpen] = useState(true); // Sidebar starts open

//   return (
//     <>
//       {/* Toggle Button (Hamburger Icon) */}
//       <button
//         className="fixed top-4 left-4 z-50 text-2xl text-gray-800"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         {isOpen ? <FaTimes /> : <FaBars />}
//       </button>

//       {/* Sidebar */}
//       <div
//         className={`fixed inset-y-0 left-0 z-40 w-64 bg-white text-gray-800 border-r border-gray-200 flex flex-col transition-all duration-300 ${
//           isOpen ? "translate-x-0" : "-translate-x-64"
//         }`}
//       >
//         {/* Sidebar Content */}
//         <div className="p-6 flex-grow overflow-y-auto">
//           {/* Logo */}
//           <Link href="/">
//             <div className="text-xl font-bold text-purple-600 mb-10 text-center cursor-pointer">
//               {sidebarConfig.logo}
//             </div>
//           </Link>

//           {/* Sidebar Sections */}
//           {sidebarConfig.mainSections.map((section, index) => (
//             <div key={index} className="mb-6">
//               <h3 className="text-gray-400 text-sm uppercase mb-4">{section.title}</h3>
//               <ul className="space-y-2">
//                 {section.items.map((item, itemIndex) => {
//                   const isActive = pathname === item.href;
//                   return (
//                     <li key={itemIndex}>
//                       <Link href={item.href}>
//                         <div
//                           className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition ${
//                             isActive ? "text-purple-600 font-semibold border-2 border-purple-600" : "hover:bg-purple-100 text-gray-800"
//                           }`}
//                         >
//                           {item.icon}
//                           <span>{item.label}</span>
//                         </div>
//                       </Link>
//                     </li>
//                   );
//                 })}
//               </ul>
//             </div>
//           ))}
//         </div>

//         {/* Settings & Logout */}
//         <div className="border-t border-gray-200 p-4">
//           <ul className="space-y-2">
//             {sidebarConfig.accountSection.map((item, itemIndex) => (
//               <li key={itemIndex}>
//                 <Link href={item.href}>
//                   <div
//                     className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition ${
//                       pathname === item.href ? "border-2 border-purple-600 bg-purple-600 text-white font-semibold" : "hover:bg-purple-100 text-gray-800"
//                     }`}
//                   >
//                     {item.icon}
//                     <span>{item.label}</span>
//                   </div>
//                 </Link>
//               </li>
//             ))}

//             {/* Logout */}
//             <li
//               className="flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition hover:bg-purple-100 text-gray-800"
//               onClick={handleLogout}
//             >
//               <BsBoxArrowRight className="text-lg" />
//               <span>Logout</span>
//             </li>
//           </ul>
//         </div>
//       </div>

//       {/* Overlay (Click to close sidebar) */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-30"
//           onClick={() => setIsOpen(false)}
//         />
//       )}
//     </>
//   );
// };

// export default Sidebar;



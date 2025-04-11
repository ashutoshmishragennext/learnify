
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; 
import { BsGear, BsInbox, BsBook, BsBoxArrowRight } from "react-icons/bs";
import { signOut } from "next-auth/react";

// Logout handler
const handleLogout = async () => {
  await signOut({ redirect: true, callbackUrl: "/login" });
};

const sidebarConfig = {
  logo: "LEARNIFY",
  mainSections: [
    {
      title: "Overview",
      items: [
        { label: "New Course", icon: <BsInbox className="text-lg" />, href: "/New course" },
        { label: "Rewards", icon: <BsInbox className="text-lg" />, href: "/rewards" },
        { label: "Assignments", icon: <BsBook className="text-lg" />, href: "/assignments" },
        
        
      ],
    },
  ],
  accountSection: [
    { label: "Settings", icon: <BsGear className="text-lg" />, href: "/settings" },
  ],
};

const Sidebar: React.FC = () => {
  const pathname = usePathname(); // Get the current path

  return (
    <div className="w-64 h-screen bg-white text-gray-800 border-r border-gray-200 flex flex-col overflow-y-auto">
      {/* Top Section */}
      <div className="p-6">
        {/* Logo */}
        <Link href="/">
          <div className="text-xl font-bold text-purple-600 mb-10 text-center cursor-pointer" style={{ fontFamily: "'Irish Grover', cursive" }}>
            {sidebarConfig.logo}
          </div>
        </Link>

        {/* Main Sections */}
        {sidebarConfig.mainSections.map((section, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-gray-400 text-sm uppercase mb-4">{section.title}</h3>
            <ul className="space-y-2">
              {section.items.map((item, itemIndex) => {
                const isActive = pathname === item.href; // Check if the link is active
                return (
                  <li key={itemIndex}>
                    <Link href={item.href}>
                      <div
                        className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition ${
                          isActive
                            ? "text-purple-600  font-semibold"
                            : "hover:bg-purple-100 text-gray-800"
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="fixed bottom-0 left-0 w-64 bg-white border-t border-gray-200 p-6">
  <ul className="space-y-2">
    {/* Settings Link */}
    {sidebarConfig.accountSection.map((item, itemIndex) => {
      const isActive = pathname === item.href;
      return (
        <li key={itemIndex}>
          <Link href={item.href}>
            <div
              className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition ${
                isActive
                  ? "bg-purple-600 text-white font-semibold"
                  : "hover:bg-purple-100 text-gray-800"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          </Link>
        </li>
      );
    })}

    {/* Logout Button */}
    <li
      className="flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition hover:bg-purple-100 text-gray-800"
      onClick={handleLogout}
    >
      <BsBoxArrowRight className="text-lg" />
      <span>Logout</span>
    </li>
  </ul>
</div>

    </div>
  );
};

export default Sidebar;

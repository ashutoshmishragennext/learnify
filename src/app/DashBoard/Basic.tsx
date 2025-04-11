"use client";

import { useState } from "react";
import ProfileSection from "./ProfileSection";
import DashboardContent from "./DashboardContent";
import { IoPersonCircleOutline, IoClose } from "react-icons/io5";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Sidebar from "./Sidebar";
import { Session } from "next-auth";

const Basic = ({ session }: { session: Session | null}) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);

  // Function to toggle Sidebar
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setProfileOpen(false); // Close profile if menu is opened
  };

  // Function to toggle Profile Section
  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
    setMenuOpen(false); // Close menu if profile is opened
  };

  return (
    <div className="flex flex-row w-full h-screen overflow-hidden">

      {/* Fixed Header with Menu & Profile Icons */}
      <div className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-50 flex justify-between items-center p-4 md:hidden">
        {/* Mobile Menu Button (Hamburger) */}
        <button onClick={toggleMenu} className="text-gray-700">
          {menuOpen ? <XMarkIcon className="h-8 w-8" /> : <Bars3Icon className="h-8 w-8" />}
        </button>

        {/* Mobile Profile Button */}
        <button onClick={toggleProfile} className="text-gray-700">
          <IoPersonCircleOutline size={40} />
        </button>
      </div>

      {/* Sidebar for Desktop */}
      <div className="hidden md:block  bg-white text-gray-800 border-r border-gray-200">
        <Sidebar />
      </div>

      {/* Main Dashboard Content */}
      <div className="flex-grow p-6 space-y-6 overflow-auto mt-16 md:mt-0">
        <DashboardContent />
      </div>

      {/* Sidebar Overlay (When Open) */}
      {(menuOpen || profileOpen) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => {
            setMenuOpen(false);
            setProfileOpen(false);
          }}
        ></div>
      )}

      {/* Mobile Sidebar (Dashboard Menu) */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg border-r p-4 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } z-50`}
      >
        <button className="absolute top-4 right-4 text-gray-600 hover:text-black" onClick={toggleMenu}>
          <IoClose size={30} />
        </button>
        <Sidebar />
      </div>

      {/* Mobile Profile Section */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg border-l p-4 transform transition-transform duration-300 ${
          profileOpen ? "translate-x-0" : "translate-x-full"
        } z-50`}
      >
        <button className="absolute top-4 right-4 text-gray-600 hover:text-black" onClick={toggleProfile}>
          <IoClose size={30} />
        </button>
        {session ? <ProfileSection session={session} /> : <p>Loading...</p>}
      </div>

      {/* Profile Section for Desktop (Always Visible) */}
      <div className="hidden md:block  p-1 mr-2 bg-gray-100 border-l">
        {session ? <ProfileSection session={session} /> : <p>Loading...</p>}
      </div>
    </div>
  );
};

export default Basic;

"use client"; 

import React from "react";
import dynamic from "next/dynamic";
import Sidebar from "@/app/DashBoard/Sidebar";
import { Session } from "next-auth";

// Dynamically import RewardsPage and ProfileSection
const RewardsPage = dynamic(() => import("./RewardsPage"), { ssr: false });
const ProfileSection = dynamic(() => import("@/app/DashBoard/ProfileSection"), {
  ssr: false,
});

const RewardsContainer: React.FC<{ session: Session | null }> = ({ session }) => {
  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <div className="w-72 bg-white border-r border-gray-200 p-1">
        <Sidebar />
      </div>

      {/* Main Content (Rewards Page) */}
      <div className="flex-1 p-6">
        <RewardsPage />
      </div>

      {/* Right Profile Section */}
      <div className="w-72 bg-white border-l border-gray-200 p-4">
        <ProfileSection session={session} />
      </div>
    </div>
  );
};

export default RewardsContainer;

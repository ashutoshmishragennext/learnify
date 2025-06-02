/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import Sidebar from "./Sidebar";
import AdminCoursePage from "./AdminCoursePage";
import { auth } from '../../../../../auth';
import NavbarAdmin from '@/components/ui/NavbarAdmin';
const AdminDashboard: React.FC = async () => {
  const session = await auth();
  return (
   <div className="">
      <NavbarAdmin  session = {session} />
    {/* <div className="w-1/5 min-h-screen bg-white">
     <Sidebar />
    </div> */}


  
    <div className="w-full p-0"> 
     <AdminCoursePage />
    </div>
  </div>


    // <div className="flex">
    //   {/* Sidebar */}
    //   <Sidebar />

    //   {/* Main Content */}
    //   <main className="flex-1 bg-gray-100">
    //     <NewCaseStudy />
    //   </main>
    // </div>

  );
};

export default AdminDashboard;

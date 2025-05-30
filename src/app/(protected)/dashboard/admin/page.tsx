
import React from 'react';
import Sidebar from "./Sidebar";
import AdminCoursePage from "./AdminCoursePage";
const AdminDashboard: React.FC = () => {
  return (


   <div className="flex">
  
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

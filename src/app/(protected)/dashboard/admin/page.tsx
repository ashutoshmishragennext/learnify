/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import AdminCoursePage from "./AdminCoursePage";
import { auth } from '../../../../../auth';
import NavbarAdmin from '@/components/ui/NavbarAdmin';
import Footer from '../../(Frontend)/Footer/page';
// import Sidebar2 from './Sidebar2';
const AdminDashboard: React.FC = async () => {
  const session = await auth();
  return (
   <div className="">
      <NavbarAdmin  session = {session} />
      <div className=' flex'>
        {/* <div className="w-64 min-h-screen bg-white">
        <Sidebar2 />
        </div> */}
        <div className="w-full p-0"> 
        <AdminCoursePage />
        </div>
      </div>
      <Footer/>
    </div>

  );
};

export default AdminDashboard;

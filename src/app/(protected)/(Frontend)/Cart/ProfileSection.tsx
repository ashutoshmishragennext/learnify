


// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { FaUserCircle } from "react-icons/fa";
// import { AiOutlineBell, AiOutlineMail, AiOutlineSetting, AiOutlineClose } from "react-icons/ai";
// import { FiLogOut } from "react-icons/fi";
// import { signOut } from "next-auth/react";
// import { Session } from "next-auth";
// import Image from "next/image";

// const ProfileSection: React.FC<{ session: Session | null| undefined }> = ({ session }) => {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [profileImage, setProfileImage] = useState<string | null>(null);
//   const [currentTime, setCurrentTime] = useState<string>("Good Morning");
//   const [isOpen, setIsOpen] = useState(false);

//   useEffect(() => {
//     setProfileImage(session?.user?.image || null);

//     const getISTHour = () => {
//       const now = new Date();
//       const istOffset = 5.5 * 60 * 60 * 1000;
//       const istTime = new Date(now.getTime() + istOffset);
//       return istTime.getUTCHours();
//     };

//     const hour = getISTHour();
//     if (hour >= 5 && hour < 12) {
//       setCurrentTime("Good Morning");
//     } else if (hour >= 12 && hour < 17) {
//       setCurrentTime("Good Afternoon");
//     } else {
//       setCurrentTime("Good Evening");
//     }
//   }, [session]);

//   const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];

//     if (!file || !file.type.startsWith("image/")) {
//       alert("Please upload a valid image file");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       setLoading(true);
//       const res = await fetch("/api/updateProfileImg", {
//         method: "PUT",
//         body: formData,
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         throw new Error(data.message);
//       } else {
//         await signOut();
//         setProfileImage(data.imageUrl);
//       }
//     } catch (error) {
//       console.error("Image upload failed:", error);
//       alert("Image upload failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!session) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div className="relative">
//       {/* Profile Icon (Right Side, Below Navbar) */}
//       <div className="md:hidden fixed top-[4rem] right-4 z-50">
//         <button onClick={() => setIsOpen(!isOpen)} className="p-2 bg-gray-100 rounded-full shadow-md">
//           {isOpen ? (
//             <AiOutlineClose className="text-3xl text-gray-700" />
//           ) : profileImage ? (
//             <Image src={profileImage} alt="Profile" width={40} height={40} className="w-10 h-10 rounded-full" />
//           ) : (
//             <FaUserCircle className="text-3xl text-gray-700" />
//           )}
//         </button>
//       </div>

//       {/* Profile Sidebar */}
//       <div
//         className={`w-72 h-screen bg-white text-gray-800 border-l border-gray-200 flex flex-col overflow-hidden 
//         fixed top-0 right-0 z-40 transform transition-transform duration-300 ease-in-out 
//         ${isOpen ? "translate-x-0" : "translate-x-full"} md:translate-x-0 md:relative`}
//       >
//         <div className="flex flex-col items-center">
//           <div className="relative w-24 h-24 mt-3 rounded-full border-4 border-purple-500 overflow-hidden">
//             {loading ? (
//               <div className="loader">Loading...</div>
//             ) : profileImage ? (
//               <Image src={profileImage} alt="Profile" width={200} height={200} className="w-full h-full object-cover" />
//             ) : (
//               <FaUserCircle className="w-full h-full text-purple-600" />
//             )}
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageUpload}
//               className="absolute inset-0 opacity-0 cursor-pointer"
//             />
//           </div>
//           <h2 className="text-lg font-semibold text-gray-800 mt-3">
//             {currentTime}, {session.user?.name || "User"}
//           </h2>
//           <p className="text-sm text-gray-500 text-center">Continue Your Journey And Achieve Your Target</p>
//         </div>

//         {/* Buttons Section */}
//         <div className="flex justify-around p-4">
//           <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200" onClick={() => router.push("/Notification")}>
//             <AiOutlineBell className="text-xl text-gray-600" />
//           </button>
//           <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200">
//             <AiOutlineMail className="text-xl text-gray-600" />
//           </button>
//           <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200">
//             <AiOutlineSetting className="text-xl text-gray-600" />
//           </button>
//         </div>

//         {/* Fixed Bottom Section */}
//         <div className="absolute bottom-5 w-full flex flex-col items-start gap-3">
//           <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800" onClick={() => router.push("/settings")}>
//             <AiOutlineSetting className="text-xl" />
//             <span>Settings</span>
//           </button>

//           <button className="flex items-center gap-2 text-red-500 hover:text-red-700" onClick={() => signOut()}>
//             <FiLogOut className="text-xl" />
//             <span>Logout</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileSection;


"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineBell, AiOutlineMail, AiOutlineSetting, AiOutlineClose } from "react-icons/ai";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import Image from "next/image";

const ProfileSection: React.FC<{ session: Session | null| undefined }> = ({ session }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("Good Morning");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setProfileImage(session?.user?.image || null);

    const getISTHour = () => {
      const now = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000;
      const istTime = new Date(now.getTime() + istOffset);
      return istTime.getUTCHours();
    };

    const hour = getISTHour();
    if (hour >= 5 && hour < 12) {
      setCurrentTime("Good Morning");
    } else if (hour >= 12 && hour < 17) {
      setCurrentTime("Good Afternoon");
    } else {
      setCurrentTime("Good Evening");
    }
  }, [session]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file || !file.type.startsWith("image/")) {
      alert("Please upload a valid image file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await fetch("/api/updateProfileImg", {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      } else {
        await signOut();
        setProfileImage(data.imageUrl);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Image upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return <p>Loading...</p>;
  }

  return (
    <div className="relative w-full">
      <div className="md:hidden fixed top-[4rem] right-4 z-50">
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 bg-gray-100 rounded-full shadow-md">
          {isOpen ? (
            <AiOutlineClose className="text-3xl text-gray-700" />
          ) : profileImage ? (
            <Image src={profileImage} alt="Profile" width={40} height={40} className="w-10 h-10 rounded-full" />
          ) : (
            <FaUserCircle className="text-3xl text-gray-700" />
          )}
        </button>
      </div>

      <div
        className={`w-full h-screen bg-white text-gray-800 border-gray-200 flex flex-col overflow-hidden 
        fixed top-0 right-0 z-40 transform transition-transform duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "translate-x-full"} md:translate-x-0 md:relative`}
      >
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 mt-3 rounded-full border-4 border-purple-500 overflow-hidden">
            {loading ? (
              <div className="loader">Loading...</div>
            ) : profileImage ? (
              <Image src={profileImage} alt="Profile" width={200} height={200} className="w-full h-full object-cover" />
            ) : (
              <FaUserCircle className="w-full h-full text-purple-600" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mt-3">
            {currentTime}, {session.user?.name || "User"}
          </h2>
          <p className="text-sm text-gray-500 text-center">Continue Your Journey And Achieve Your Target</p>
        </div>

        <div className="flex justify-around p-4">
          <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200" onClick={() => router.push("/Notification")}>
            <AiOutlineBell className="text-xl text-gray-600" />
          </button>
          <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200">
            <AiOutlineMail className="text-xl text-gray-600" />
          </button>
          <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200">
            <AiOutlineSetting className="text-xl text-gray-600" />
          </button>
        </div>

       
      </div>
    </div>
  );
};

export default ProfileSection;

// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { signIn } from "next-auth/react";

// export default function EmailVerification() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");

//       const handleVerifyEmail = async () => {
//         const response = await fetch("api/sendVerificationEmail", {
//           method:"POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({email, name}),
//         })
//       }      


//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
//       <div className="flex bg-white rounded-lg shadow-md w-full max-w-4xl overflow-hidden">
//         {/* Left Section - Image */}
//         <div className="hidden md:flex bg-purple-500 p-8 w-1/2 items-center justify-center">
//           <Image
//             src="/signup.png"
//             alt="Signup Illustration"
//             width={400}
//             height={400}
//             className="w-full h-auto object-cover"
//             priority
//           />
//         </div>

//         {/* Right Section - Form */}
//         <div className="w-full md:w-1/2 p-6">
//           <h2 className="text-xl font-semibold text-center mb-4">Verify Your Email</h2>

//           {/* Social Login Buttons */}
//           <div className="flex gap-4">
//             <button
//               type="button"
//               onClick={() => signIn("google")}
//               className="flex items-center justify-center w-1/2 py-2 px-4 border rounded-md hover:bg-gray-100 transition"
//             >
//               <Image src="/google1.png" alt="Google" width={20} height={20} className="mr-2" />
//               Google
//             </button>
//             <button
//               type="button"
//               onClick={() => signIn("github")}
//               className="flex items-center justify-center w-1/2 py-2 px-4 border rounded-md hover:bg-gray-100 transition"
//             >
//               <Image src="/github.png" alt="GitHub" width={20} height={20} className="mr-2" />
//               GitHub
//             </button>
//           </div>

//           <div className="my-4 text-center text-gray-400">- OR -</div>

//           {/* Name Input Field */}
//           <div className="mt-4">
//             <label className="block text-sm font-medium">Enter your name:</label>
//             <input
//               type="text"
//               className="w-full p-2 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
//               placeholder="Your Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//           </div>

//           {/* Email Input Field */}
//           <div className="mt-4">
//             <label className="block text-sm font-medium">Enter your email:</label>
//             <input
//               type="email"
//               className="w-full p-2 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
//               placeholder="your@example.com"
//               value={email}
//               required
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           {/* Verify Email Button */}
//           <button
//             onClick={handleVerifyEmail}
//             className="w-full mt-4 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
//           >
//             Verify Email
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from 'react'
import VerifyEmail from './VerifyEmail'

export default function page() {
  return (
    <VerifyEmail />
  )
}

// "use client";
// import { useParams, useRouter } from "next/navigation";
// import React, { useState, useEffect } from "react";
// import { BeatLoader } from "react-spinners";
// import { CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";

// const VerifyEmail: React.FC = () => {
//   const { token } = useParams();
//   const router = useRouter();

//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [verified, setVerified] = useState<boolean>(false);
//   const [countdown, setCountdown] = useState<number>(4);

//   useEffect(() => {
//     const verifyToken = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);

//         const res = await fetch("/api/emailVerification", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ token }),
//         });

//         if (res.status === 400) {
//           setError("Invalid token or it has expired.");
//         } else if (res.status === 200) {
//           setVerified(true);
//         }
//       } catch (err) {
//         console.error("Verification error:", err);
//         setError("An unexpected error occurred. Please try again.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     verifyToken();
//   }, [token]);

//   useEffect(() => {
//     if (verified) {
//       const timer = setInterval(() => {
//         setCountdown((prev) => {
//           if (prev <= 1) {
//             clearInterval(timer);
//             router.push("/login");
//           }
//           return prev - 1;
//         });
//       }, 1000);

//       return () => clearInterval(timer);
//     }
//   }, [verified, router]);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
//       <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
//         {isLoading ? (
//           <div className="flex flex-col items-center">
//             <BeatLoader color="#bc26bc" size={12} />
//             <p className="text-gray-600 mt-3">Verifying your email, please wait...</p>
//           </div>
//         ) : error ? (
//           <div className="flex flex-col items-center text-red-500">
//             <ExclamationTriangleIcon className="w-12 h-12 mb-3" />
//             <p className="text-lg font-semibold">Verification Failed</p>
//             <p className="text-sm mt-2">{error}</p>
//           </div>
//         ) : (
//           <div className="flex flex-col items-center text-green-600">
//             <CheckCircleIcon className="w-12 h-12 mb-3" />
//             <p className="text-lg font-semibold">Email Verified Successfully!</p>
//             <p className="text-sm text-gray-600 mt-2">
//               Redirecting to login in <span className="font-bold">{countdown}</span> seconds...
//             </p>
//             <button
//               onClick={() => router.push("/login")}
//               className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition"
//             >
//               Go to Login
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VerifyEmail;


"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import { CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";

const VerifyEmail: React.FC = () => {
  const { token } = useParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(4);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch("/api/emailVerification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (res.status === 400) {
          setError("Invalid token or it has expired.");
        } else if (res.status === 200) {
          setVerified(true);
        }
      } catch (err) {
        console.error("Verification error:", err);
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  useEffect(() => {
    if (verified) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [verified]);

  useEffect(() => {
    if (verified && countdown === 1) {
      router.push("/login");
    }
  }, [verified, countdown, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        {isLoading ? (
          <div className="flex flex-col items-center">
            <BeatLoader color="#bc26bc" size={12} />
            <p className="text-gray-600 mt-3">Verifying your email, please wait...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center text-red-500">
            <ExclamationTriangleIcon className="w-12 h-12 mb-3" />
            <p className="text-lg font-semibold">Verification Failed</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-green-600">
            <CheckCircleIcon className="w-12 h-12 mb-3" />
            <p className="text-lg font-semibold">Email Verified Successfully!</p>
            <p className="text-sm text-gray-600 mt-2">
              Redirecting to login in <span className="font-bold">{countdown}</span> seconds...
            </p>
            <button
              onClick={() => router.push("/login")}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;

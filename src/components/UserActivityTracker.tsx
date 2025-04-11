// "use client";

// import { useEffect, useState } from "react";

// const UserActivityTracker = () => {
//   console.log("UserActivityTracker component mounted!");

//   const [isUpdating, setIsUpdating] = useState(false);

//   useEffect(() => {
//     let timeout: NodeJS.Timeout;

//     const updateActivity = async () => {
//       if (isUpdating) return;
//       setIsUpdating(true);
//       try {
//         await fetch("/api/updateUserActivity");
//       } catch (error) {
//         console.error("Error updating user activity:", error);
//       } finally {
//         setIsUpdating(false);
//       }
//     };

//     const handleActivity = () => {
//       clearTimeout(timeout);
//       updateActivity();

//       // If no activity for 5 mins, consider the user inactive
//       timeout = setTimeout(() => {
//         console.log("User inactive");
//       }, 5 * 60 * 1000);
//     };

//     // Attach event listeners
//     window.addEventListener("mousemove", handleActivity);
//     window.addEventListener("keypress", handleActivity);
//     window.addEventListener("scroll", handleActivity);
//     window.addEventListener("click", handleActivity);

//     return () => {
//       window.removeEventListener("mousemove", handleActivity);
//       window.removeEventListener("keypress", handleActivity);
//       window.removeEventListener("scroll", handleActivity);
//       window.removeEventListener("click", handleActivity);
//       clearTimeout(timeout);
//     };
//   }, []);

//   return null;
// };

// export default UserActivityTracker;

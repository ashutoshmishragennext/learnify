"use client";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Session } from "next-auth"; // Import type for session
// import { useRouter } from "next/navigation";  // ✅ Import useRouter here

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  handler: (response: { razorpay_payment_id: string }) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: number;
  };
  theme?: {
    color: string;
  };
  modal?: {
    ondismiss: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
}

const makePayments = async (
  amount: number,
  courseName: string,
  cId: number[] | number,      
  session: Session | null | undefined,
  other?: string | undefined | null
  ) => {
  // const router = useRouter();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  return new Promise<boolean>(async (resolve, reject) => {
    try {
      // if (!session) {
      //   const currentPath = window.location.pathname;
      //   router.push(`/login?redirect=${currentPath}`);
      //   return reject("User not logged in");
      // }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        // throw new Error("Failed to load Razorpay script.");
        toast.error("Failed to Load Razorpay right now")
        return resolve(false);
      }

      // Create order
      const response = await fetch("/api/createOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amt: amount }),
      });

      const data = await response.json();

      if (!window.Razorpay) {
        toast.error("Razorpay is not available.");
        return resolve(false);
      }

      // Initialize Razorpay
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: amount * 100,
        currency: "INR",
        name: "Learnify",
        description: `Buying course ${courseName}`,
        order_id: data.orderId,
        handler: async function (response: { razorpay_payment_id: string }) {
          const paymentId = response.razorpay_payment_id;

        if (Array.isArray(cId)) {
            const resp = await fetch("/api/buyMultipleCourse", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ cId, paymentId }),
            });
            const dta = await resp.json();
            if (resp.ok) {
              console.log("Payment successful!", response);
            } else {
              toast.error(dta.error);
              console.log("Payment Problem!", response);
              return resolve(false);
            }
            const removeResponse = await fetch("/api/removeMultipleCartCourse", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ cId }),
            });
  
            const removeData = await removeResponse.json();
            if (!removeResponse.ok) {
              toast.error(`Error removing course: ${removeData.error}`);
              return reject("Error removing course from DB");
            }
  
            toast.success("Payment Successful for all Cart Courses!", { autoClose: 5000 });
            resolve(true);
        } else if (typeof cId === "number") {

          const resp = await fetch("/api/buyCourse", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ cId, paymentId }),
          });
          const dta = await resp.json();
          if (resp.ok) {
            console.log("Payment successful!", response);
          } else {
            toast.error(dta.error);
            // toast.error("Payment processing error.");
            return resolve(false);
          }

          if(!other){
            const removeResponse = await fetch("/api/removeCartCourse", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ courseId: cId }),
          });

          const removeData = await removeResponse.json();
          if (!removeResponse.ok) {
            toast.error(`Error removing course: ${removeData.error}`);
            return resolve(false);
          }
          toast.success("Payment Successful!", { autoClose: 5000 });
          resolve(true);
        }
        toast.success("Payment Successful!", { autoClose: 5000 });
        resolve(true);
        }
        },
        modal: {
          ondismiss: function () {
          toast.info("Payment cancelled by user.");
          return resolve(false);
        }
      },
        prefill: {
          name: session?.user?.name || "Guest User",
          email: session?.user?.email || "guest@example.com",
          contact: (session?.user as {phone?: number})?.phone,
        },
        theme: { color: "#8A2BE2" },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Payment Failed: ", error);
      reject(error);
    }
  });
};


export default makePayments;

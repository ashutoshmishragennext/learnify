"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import makePayments from "@/lib/makePayments";
import verifyUser from "@/lib/verifyUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import * as z from "zod";
import { useCourse } from "../Context/CourseContext";
import OrderSummary from "./OrderSummary";

const signUpSchema = z.object({
  email: z.string().email("Email should be valid"),
});

const Checkout: React.FC<{ session?: Session | null }> = ({ session }) => {
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState<number | "">("");
  const [email, setEmail] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [savedPassword, setSavedPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [showPayNowButton, setShowPayNowButton] = useState(false);
  const [userVerification, setUserVerification] = useState(false);
  const { courseData: course } = useCourse();
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
    },
  });

  // useEffect(()=>{
  //   console.log("Details rearding the courseData from courseData: ",course?.price.current, course?.name, course?.courseId, session)
  // })

  const handleContinue = async (data: z.infer<typeof signUpSchema>) => {
    const response = await verifyUser(data.email);
    console.log("Is user verified in database ? : ", response);
    if (response === 1) {
      setUserVerification(true);
    }
    setIsProcessing(true);
    try {
      setEmail(data.email);
      const response = await fetch("/api/checkoutAuthentication", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });
      const d = await response.json();
      if (response.ok) {
        toast.success(d.message);
        setSavedPassword(d.Password);
        setShowOtpField(true);
      } else {
        setMessage(d.error);
      }
    } catch (error: unknown) {
      console.error("Error sending OTP:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOAuth = async (provider: string) => {
    const callbackUrl = window.location.href;
    await signIn(provider, { callbackUrl });
    
    // Fix: Check if course and price.current exist before passing them
    if (course && course.price && typeof course.price.current === 'number') {
      const result = await makePayments(
        course.price.current,
        course.name ?? "",
        course.courseId ?? "",
        session,
        "other"
      );
      
      if (result) {
        toast.info("Redirecting to DashBoard");
        router.push("/DashBoard");
      } else {
        setShowPayNowButton(true);
      }
    } else {
      toast.error("Course information is missing");
      setShowPayNowButton(true);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("OTP must be provided");
      return;
    }
    // if (!email || !savedPassword) {
    //   toast.error("Email and savedPassword must be provided");
    //   return;
    // }
    setIsProcessing(true);
    try {
      if (userVerification) {
        console.log("User Verification: ", email, otp)
        const loggedIn = await signIn("otp", {
          redirect: false,
          email: email,
          otp: otp,
        });
        if (loggedIn?.error) {
          toast.error("OTP is wrong!");
          console.error("OTP is Wrong!", loggedIn.error);
        }
        toast.success("Otp successfully verified");
        setIsVerified(true);
        
        // Fix: Check if course and price.current exist before passing them
        if (course && course.price && typeof course.price.current === 'number') {
          const result = await makePayments(
            course.price.current,
            course.name ?? "",
            course.courseId ?? "",
            session,
            "other"
          );
          
          if (result) {
            toast.info("Redirecting to DashBoard");
            router.push("/DashBoard");
          } else {
            setShowPayNowButton(true);
          }
        } else {
          toast.error("Course information is missing");
          setShowPayNowButton(true);
        }
      } else {
        const isValid = await fetch("/api/verifyOtp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ otp, savedPassword, email }),
        });
        const data = await isValid.json();
        if (isValid.ok) {
          toast.success("OTP verified successfully!");
          setIsVerified(true);
          const result = await signIn("credentials", {
            redirect: false,
            email: email,
            password: savedPassword,
          });
          if (result?.error) {
            console.error("Login failed", result.error);
            // console.log(result);
            setMessage("Invalid Credentials");
          } else {
            // Fix: Check if course and price.current exist before passing them
            if (course && course.price && typeof course.price.current === 'number') {
              const result = await makePayments(
                course.price.current,
                course.name ?? "",
                course.courseId ?? "",
                session,
                "other"
              );
              
              if (result) {
                toast.info("Redirecting to DashBoard");
                router.push("/DashBoard");
              } else {
                setShowPayNowButton(true);
              }
            } else {
              toast.error("Course information is missing");
              setShowPayNowButton(true);
            }
          }
        } else {
          toast.error(data.error);
        }
      }
    } catch (error: unknown) {
      console.error("OTP verification error:", error);
      toast.error("Error verifying OTP.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetryPayment = async () => {
    // Fix: Check if course and price.current exist before passing them
    if (course && course.price && typeof course.price.current === 'number') {
      const paymentResult = await makePayments(
        course.price.current,
        course.name ?? "",
        course.courseId ?? "",
        session,
        "other"
      );

      if (paymentResult) {
        toast.info("Redirecting to DashBoard");
        router.push("/DashBoard");
      }
    } else {
      toast.error("Course information is missing");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-6">
      <div className="flex flex-col md:flex-row bg-white shadow-xl rounded-2xl w-full max-w-4xl p-8">
        <div className="w-full md:w-1/2 p-6">
          <h1 className="text-3xl font-extrabold text-gray-800 text-center">
            Checkout
          </h1>
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-700 text-center">
              Log in or create an account
            </h2>
            <p className="text-gray-600 text-sm text-center mt-1">
              A <span className="font-semibold text-purple-700">Learnify</span>{" "}
              account is required to access your purchased courses.
            </p>

            <div className="flex space-x-4 mt-3">
              <button
                type="button"
                onClick={() => handleOAuth("google")}
                className="flex items-center border border-gray-300 px-4 py-2 rounded-lg w-1/2 justify-center hover:bg-gray-100 transition"
              >
                <FcGoogle size={24} className="mr-2" />
                Google
              </button>
              <button
                type="button"
                className="flex items-center border border-gray-300 px-4 py-2 rounded-lg w-1/2 justify-center hover:bg-gray-100 transition"
                onClick={() => handleOAuth("github")}
              >
                <FaGithub size={24} className="mr-2" />
                GitHub
              </button>
            </div>

            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-300" />
              <span className="px-3 text-gray-500 font-semibold">OR</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            {!showOtpField && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleContinue)}>
                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Enter your email"
                              {...field}
                              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-gray-700"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <p
                      className={
                        message
                          ? "text-red-500 text-xs"
                          : "text-gray-500 text-xs mt-1"
                      }
                    >
                      {message ? message : "No password required"}
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 mt-6 rounded-lg font-semibold hover:opacity-90 transition"
                  >
                    {isProcessing ? "Sending OTP..." : "Continue"}
                  </button>
                </form>
              </Form>
            )}

            {showOtpField && !isVerified && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700">
                  Enter OTP
                </label>
                <Input
                  type="number"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value ? Number(e.target.value) : "")
                  }
                  required
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-gray-700 mt-2"
                />
                <button
                  onClick={handleVerifyOtp}
                  className="w-full bg-green-500 text-white p-3 mt-4 rounded-lg font-semibold hover:bg-green-600 transition"
                >
                  {isProcessing ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            )}

            {isVerified && !showPayNowButton && (
              <div className="text-center mt-6">
                <p className="text-green-600 font-semibold">
                  You are logged in!
                </p>
              </div>
            )}

            {isVerified && showPayNowButton && (
              <button
                onClick={handleRetryPayment}
                className="w-full bg-blue-600 text-white p-3 mt-4 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Pay Now
              </button>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center items-center p-6">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
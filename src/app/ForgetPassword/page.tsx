"use client";

import React, { useState } from "react";
import Loader from "@/components/ui/Loader";
import { useRouter } from "next/navigation";

const ForgetPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const res = await fetch("/api/forgetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email
        }),
      });
      if(res.status === 400) {
        setError("User with this email is not registered!")
      }
      if(res.status === 200) {
        console.log("Sending password reset email to:", email);
        setSuccess(true);
      }
    } catch (err) {
      console.error("Error sending password reset email:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirectToLogin = () => {
    setIsLoading(true);
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">
          Forget Password
        </h2>

        {success ? (
          <div className="text-green-600 text-center">
            Password reset link sent successfully to {email}. <br />
            <div className="text-red-500 text-center">
              *Link will only be valid for an hour. 
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-gray-700"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              className={`w-full py-2 px-4 rounded-md text-white transition ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
              disabled={isLoading}
            >
              {isLoading ? <Loader /> : "Send Reset Link"}
            </button>
          </form>
        )}

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Remembered your password?{" "}
            <button
              onClick={handleRedirectToLogin}
              className="text-purple-600 hover:underline"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;

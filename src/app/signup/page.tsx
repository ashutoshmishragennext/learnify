"use client";

import React, { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
// import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Loader from "@/components/ui/Loader";

const signUpSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Email should be valid"),
    password: z.string().min(6, "Password should have at least 6 characters."),
    confirmPassword: z
      .string()
      .min(6, "Password should have at least 6 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const Signup = () => {
  // const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleGithubSignIn = () => {
    signIn("github", { callbackUrl: "/DashBoard" });
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/DashBoard" });
  };

  const handleLoader = () => {
    setLoading(true);
  };

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    setApiError(null);
    try {
      // console.log(values.password);
      const response = await fetch("/api/sendVerificationEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });
      // const response = await fetch("/api/signup", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     name: values.name,
      //     email: values.email,
      //     password: values.password,
      //   }),
      // });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong!");
      setSuccess(data.message);
      // router.push("/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg w-full max-w-4xl overflow-hidden">
        {/* Left Section */}

        <div className="hidden md:flex bg-purple-500 p-8 w-1/2 items-center justify-center">
          <Image
            src="/signup.png"
            alt="Signup Illustration"
            width={400}
            height={400}
            className="w-full h-auto object-cover"
            priority
          />
        </div>

        {/* Right Section */}
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">
            Create Your Account
          </h2>

          <div className="flex gap-4">
            <button
              type="button"
              className="flex items-center justify-center w-1/2 py-2 px-4 border rounded-md hover:bg-gray-100 transition"
              onClick={handleGoogleSignIn}
            >
              <Image
                src="/google1.png"
                alt="Google"
                width={20}
                height={20}
                className="mr-2"
              />
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center w-1/2 py-2 px-4 border rounded-md hover:bg-gray-100 transition"
              onClick={handleGithubSignIn}
            >
              <Image
                src="/github.png"
                alt="GitHub"
                width={20}
                height={20}
                className="mr-2"
              />
              GitHub
            </button>
          </div>

          <div className="my-4 text-center text-gray-400">- OR -</div>

          {apiError && (
            <div className="text-red-600 bg-red-100 text-center py-2 mb-2 rounded-md">{apiError}</div>
          )}
          {success && (
            <div className="text-green-600 bg-green-100 text-center py-2 mb-2 rounded-md">{success}</div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Enter your name"
                        {...field}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Enter your password"
                          {...field}
                          type={showPassword ? "text" : "password"}
                          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 text-gray-700"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2 text-gray-600"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Confirm your password"
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-gray-700"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-2 text-gray-600"
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button
                type="submit"
                className={`w-full py-2 px-4 rounded-md text-white transition ${
                  form.formState.isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Loading..." : "Sign Up"}
              </button>
            </form>
          </Form>

          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Link
              href="/login"
              onClick={handleLoader}
              className="text-purple-600 hover:underline"
            >
              {loading ? <Loader /> : "Log In"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

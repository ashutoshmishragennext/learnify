"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HeartIcon,
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";
import Loader from "@/components/ui/Loader";
import { Session } from "next-auth";
import SearchBar from "./SearchBar";
import { motion, AnimatePresence } from "framer-motion";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NavbarAdmin: React.FC<{ session?: Session | null |  any }> = ({ session }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (targetPath: string) => {
    if (pathname !== targetPath) {
      setLoading(true);
      router.push(targetPath);
      setTimeout(() => setLoading(false), 500);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    await signOut({ redirect: true, callbackUrl: "/auth/login" });
    setLoading(false);
  };

  return (
    <>
      {/* Main NavbarAdmin */}
      <nav className="bg-custom-gradient text-white py-4 px-6 shadow-lg fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Section */}
          <div
            className="text-2xl font-bold"
            style={{
              fontFamily: "'Irish Grover', cursive",
              fontSize: "19px",
              fontWeight: 400,
              lineHeight: "19px",
              textAlign: "left",
              textUnderlinePosition: "from-font",
              textDecorationSkipInk: "none",
            }}
          >
            {session ? (
            <Link href="/dashboard">Learnify</Link>
            ):(
              <Link href="/">Learnify</Link>
            )}
          </div>

          {/* Loader */}
          {loading && <Loader />}

          {/* Search Bar */}
          <SearchBar />

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {/* <button
              onClick={() => handleNavigation("/dashboard")}
              className={`${
                pathname === "/dashboard/student"
                  ? "underline decoration-2 decoration-pink-300"
                  : ""
              } hover:underline decoration-2 decoration-white text-white`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavigation("/dashboard/student/ExploreData")}
              className={`${
                pathname === "/ExploreData || /dashboard/student/ExploreData"
                  ? "underline decoration-2 decoration-white-300"
                  : ""
              } hover:underline decoration-2 decoration-white text-white`}
            >
              Explore
            </button> */}
            {session && (
              <button
                onClick={() => handleNavigation("/dashboard/admin")}
                className={`hover:underline ${
                  pathname === "/dashboard/admin" ? "text-white" : ""
                } hover:underline decoration-2 decoration-white text-white`}
              >
                Admin Interface
              </button>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {!session ? null : (
              <>
                <button
                  onClick={() => handleNavigation("/Wishlist")}
                  className={`relative font-semibold p-2 rounded-full transition ${
                    pathname === "/Wishlist"
                      ? "bg-pink-500 text-white"
                      : "bg-white text-black"
                  }`}
                >
                  <HeartIcon className="h-5 w-5" />
                </button>

                <button
                  onClick={() => handleNavigation("/Cart")}
                  className={`relative font-semibold p-2 rounded-full transition ${
                    pathname === "/Cart"
                      ? "bg-pink-500 text-white"
                      : "bg-white text-black"
                  }`}
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Auth Buttons */}
            {!session ? (
              <div className="hidden md:flex space-x-2">
                <button
                  onClick={() => handleNavigation("/auth/register")}
                  className="bg-white text-black font-semibold px-4 py-2 rounded-full hover:bg-gray-200 transition"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => handleNavigation("/auth/login")}
                  className="bg-white text-black font-semibold px-4 py-2 rounded-full hover:bg-gray-200 transition"
                >
                  Login
                </button>
              </div>
            ) : (
              <div className="hidden md:flex space-x-2">
                <button
                  onClick={handleLogout}
                  className="bg-white text-purple-700 px-4 py-2 rounded-full hover:bg-gray-200 transition"
                >
                  Logout
                </button>
              </div>
            )}

            {/* Hamburger Icon */}
            <button
              className="md:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 right-0 w-[250px] bg-white h-full shadow-lg z-50"
            >
              {/* Close Button */}
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h2 className="text-xl font-bold text-purple-600">Menu</h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-gray-600 hover:text-red-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Sidebar Links */}
              <div className="flex flex-col p-4 space-y-4">
                {/* <button
                  onClick={() => handleNavigation("/dashboard/student")}
                  className={`text-gray-800 hover:text-purple-600 ${
                    pathname === "/" || "/dashboard/student" ? "font-bold" : ""
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavigation("/dashboard/student/ExploreData")}
                  className={`text-gray-800 hover:text-purple-600 ${
                    pathname === "/ExploreData" ? "font-bold" : ""
                  }`}
                >
                  Explore
                </button> */}
                {session ? (
                  <button
                    onClick={() => handleNavigation("/dashboard/admin")}
                    className={`text-gray-800 hover:text-purple-600 ${
                      pathname === "/dashboard/admin" ? "font-bold" : ""
                    } `}
                  >
                    Admin Interface
                  </button>
                ) : (
                  ""
                )}
                {!session ? (
                  <div className="flex flex-col space-y-4">
                    <button
                      onClick={() => handleNavigation("/auth/register")}
                      className="text-gray-800 hover:text-purple-600"
                    >
                      Sign Up
                    </button>

                    <button
                      onClick={() => handleNavigation("/auth/login")}
                      className="text-gray-800 hover:text-purple-600"
                    >
                      Login
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="text-gray-800 hover:text-purple-600"
                  >
                    Logout
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavbarAdmin;

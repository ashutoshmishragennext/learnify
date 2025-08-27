
import React from "react";
import Link from "next/link";
// import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import {FaXTwitter} from "react-icons/fa6"
// import page from '../ExploreData/page'


import { MdEmail, MdPhone } from "react-icons/md";
import { ChevronRight } from "lucide-react";
// import page from "../ExploreData/Courses";

const Footer: React.FC = () => {
  return (
   <footer className="text-white py-8" style={{ backgroundColor: "#702DFF" }}>
  {/* Footer Content */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
    
    {/* Logo and Tagline */}
    <div className="flex flex-col items-start">
      <h1
        className="font-grover text-[32px] sm:text-[40px] leading-[36px]"
        style={{ fontFamily: "'Irish Grover', cursive" }}
      >
        Learnify
      </h1>
      <p className="mt-2 text-sm font-medium">Consistency is the Key</p>
    </div>

    {/* About Us & Support Sections */}
    <div className="flex flex-col sm:flex-row justify-between gap-y-8 sm:gap-x-12">
      {/* About Us */}
      <div>
        <h2 className="text-lg font-semibold mb-4">About Us</h2>
        <ul className="space-y-2 text-sm pl-1">
          <li className="flex items-center">
            <ChevronRight className="w-4 h-4 text-white mr-2" />
            <Link href="/ExploreData" className="hover:underline">Courses</Link>
          </li>
          <li className="flex items-center">
            <ChevronRight className="w-4 h-4 text-white mr-2" />
            <Link href="/rewards" className="hover:underline">Rewards</Link>
          </li>
          <li className="flex items-center">
            <ChevronRight className="w-4 h-4 text-white mr-2" />
            <Link href="/mentors" className="hover:underline">Mentors</Link>
          </li>
        </ul>
      </div>

      {/* Support */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Support</h2>
        <ul className="space-y-2 text-sm pl-1">
          <li className="flex items-center">
            <ChevronRight className="w-4 h-4 text-white mr-2" />
            <Link href="/documentation" className="hover:underline">Documentation</Link>
          </li>
          <li className="flex items-center">
            <ChevronRight className="w-4 h-4 text-white mr-2" />
            <Link href="/guide" className="hover:underline">Guide</Link>
          </li>
          <li className="flex items-center">
            <ChevronRight className="w-4 h-4 text-white mr-2" />
            <Link href="/tutorial" className="hover:underline">Tutorial</Link>
          </li>
        </ul>
      </div>
    </div>

    {/* Contact Us Section */}
    <div className="flex flex-col items-start">
      <h2 className="text-lg font-semibold mb-4">Contact Us</h2>
      <ul className="space-y-3 text-sm">
        <li className="flex items-center">
          <MdEmail className="text-lg" />
          <Link href="mailto:info@gennextit.com" className="ml-2 hover:underline">info@gennextit.com</Link>
        </li>
        <li className="flex items-center">
          <MdPhone className="text-lg" />
          <Link href="tel:+91-7840079095" className="ml-2 hover:underline">+91-7840079095</Link>
        </li>
      </ul>

      {/* Social Media Icons */}
      <div className="flex space-x-4 mt-4">
        <Link href="https://facebook.com" aria-label="Facebook">
          <FaFacebookF className="text-xl hover:text-gray-300" />
        </Link>
        <Link href="https://twitter.com" aria-label="Twitter">
          <FaXTwitter className="text-xl hover:text-gray-300" />
        </Link>
        <Link href="https://linkedin.com" aria-label="LinkedIn">
          <FaLinkedinIn className="text-xl hover:text-gray-300" />
        </Link>
      </div>
    </div>
  </div>

  {/* Footer Bottom Text */}
  <div className="mt-8 text-center text-sm border-t border-purple-400 pt-4">
    <p>GenNext IT 2025. All rights reserved.</p>
  </div>
</footer>
  );
};

export default Footer;



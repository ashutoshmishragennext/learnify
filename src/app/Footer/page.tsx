
import React from "react";
import Link from "next/link";
// import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import {FaXTwitter} from "react-icons/fa6"
// import page from '../ExploreData/page'


import { MdEmail, MdPhone } from "react-icons/md";
// import page from "../ExploreData/Courses";

const Footer: React.FC = () => {
  return (
    <footer className=" text-white py-8" style={{ backgroundColor: "#702DFF" }}>
      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo and Tagline */}
        <div className="flex flex-col items-start">
        <h1
            className="font-grover font-normal text-[40px] leading-[40px]"
            style={{ fontFamily: "'Irish Grover', cursive" }}
          >
            Learnify
          </h1>
          <p className="mt-2 text-sm font-medium">Consistency is the Key</p>
        </div>

        {/* About Us & Support Sections */}
        <div className="flex justify-around">
          {/* About Us */}
          <div>
            <h2 className="text-lg font-semibold mb-4">About Us</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/ExploreData" className="hover:underline">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/rewards" className="hover:underline">
                  Rewards
                </Link>
              </li>
              <li>
                <Link href="/mentors" className="hover:underline">
                  Mentors
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Support</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/documentation" className="hover:underline">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/guide" className="hover:underline">
                  Guide
                </Link>
              </li>
              <li>
                <Link href="/tutorial" className="hover:underline">
                  Tutorial
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Us Section */}
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Contact Us</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center">
              <MdEmail className="text-lg" />
              <Link href="mailto:abc@mail.com" className="ml-2 hover:underline">
                abc@mail.com
              </Link>
            </li>
            <li className="flex items-center">
              <MdPhone className="text-lg" />
              <Link href="tel:+910000000000" className="ml-2 hover:underline">
                +91 0000000000
              </Link>
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
        <p>Design with love © TeamABESIT 2024. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;



"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";


// Separate component for form instructions
export const FormInstructions: React.FC = () => {
  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10A8 8 0 114 10a8 8 0 0114 0zm-9-3a1 1 0 112 0v4a1 1 0 11-2 0V7zm1 6a1 1 0 110 2 1 1 0 010-2z"
              clipRule="evenodd"
            />
          </svg>
          How to Fill Out This Form
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-blue-700 mb-4">
          This form helps you structure your course card. Fill in all the
          required fields marked with{" "}
          <span className="text-red-500 font-bold">*</span>.
        </p>

        <div className="space-y-3 text-sm text-blue-700">
          <div>
            <strong className="text-blue-800">Course Image:</strong> Upload an image that represents your
            course. This image will be used as the course card image visible to
            users.
          </div>
          <div>
            <strong className="text-blue-800">Duration:</strong> Enter the total duration of the course in
            minutes.
          </div>
          <div>
            <strong className="text-blue-800">Topic:</strong> Specify the main subject of the course.
          </div>
          <div>
            <strong className="text-blue-800">Short Description:</strong> Provide a brief description of
            the course to give users an overview.
          </div>
          <div>
            <strong className="text-blue-800">Pricing Details:</strong>
            <div className="ml-4 mt-2 space-y-2">
              <div>
                <strong>Current Price:</strong> Enter the price at which the
                course is currently being sold.
              </div>
              <div>
                <strong>Original Price:</strong> Enter the original price before
                any discount.
              </div>
              <div>
                <strong>Discount Percentage:</strong> This will be
                auto-calculated based on the original and current price.
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
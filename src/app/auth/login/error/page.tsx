// pages/auth/error.tsx
"use client";

import { useSearchParams } from "next/navigation";

const errorMessages: Record<string, string> = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "Access Denied.",
  Verification: "The link has expired or is invalid.",
  MissingSecret: "Missing secret in your environment variables.",
};

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const message = errorMessages[error || ""] || "An unknown error occurred.";

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-4">Authentication Error</h1>
      <p className="text-lg text-red-500">{message}</p>
    </div>
  );
}

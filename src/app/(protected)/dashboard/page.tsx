"use client";

import { useCurrentUser } from "@/hooks/auth";
import { useCurrentRole } from "@/hooks/auth/useCurrentRole";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const role =  useCurrentRole()
  const user =  useCurrentUser()
  const [isRedirecting, setIsRedirecting] = useState(false);

  console.log("role",role);
    console.log("USER",user);

  useEffect(() => {
    if (!role) {
      router.push("/auth/login");
      return;
    }
    setIsRedirecting(true);
    switch (role.trim()) {
      case "ADMIN":
        router.push("/dashboard/admin");
        break;
      case "STUDENT":
          router.push("/dashboard/student");
          break;
      default:
        setIsRedirecting(false);
        break;
    }
  }, [router, role]);

  if (isRedirecting) {
    return    <span className="flex items-center justify-center">
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Loading...
  </span>
  }

  return (
    <div className="mx-4">{/* Your default dashboard content goes here */}</div>
  );
}
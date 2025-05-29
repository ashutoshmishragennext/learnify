"use client";

import Signup from "@/app/(protected)/(Frontend)/signup/page";
import { Suspense } from "react";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Signup />
    </Suspense>
  );
};

export default Page;

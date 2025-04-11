"use client";

import { Suspense } from "react";
import Login from "./login";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Login />
    </Suspense>
  );
};

export default Page;

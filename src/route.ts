/* eslint-disable @typescript-eslint/no-explicit-any */
// import { Role } from "./validaton-schema";

export const DEFAULT_LOGIN_REDIRECT: string = "/dashboard";

// Prefix for API authentication routes.
export const apiAuthPrefix: string = "/api/auth";

// Routes which are accessible to all.
export const publicRoutes: (string | RegExp)[] = ["/", "/auth/verify-email","/updatingDB/", /^\/verifyEmail\/[a-zA-Z0-9]+$/i ];

// APIs which are accessible to all.
export const publicApis: string[] = ["/api/uploadthing","/api/emailVerification" , "/api/sendVerificationEmail" ];

// Routes which are used for authentication.
export const authRoutes: string[] = [
  "/auth/error",
  "/auth/login",
  "/auth/register",
  "/signup",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth-check"
];

// Routes which are protected with diffferent roles
export const protectedRoutes: Record<string, any> = {
  "^/dashboard/admin(/.*)?$": ["ADMIN"],
  "^/dashboard/user(/.*)?$": ["USER","STUDENT"],
  "^/dashboard/student(/.*)?$": ["STUDENT"],
  "^/dashboard/teacher(/.*)?$": ["TEACHER"],
};
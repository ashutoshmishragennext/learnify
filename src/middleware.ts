import { authConfigBase } from "./auth.config.base";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  protectedRoutes,
  publicApis,
  publicRoutes,
} from "@/route";
import NextAuth from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfigBase);

export default auth(async (req) => {
  const { auth, nextUrl } = req;
  const isLoggedIn = !!auth;

  const pathname = nextUrl.pathname;

  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
  // const isPublicRoute = publicRoutes.includes(pathname);
  const isPublicRoute = publicRoutes.some((route) => {
  if (route instanceof RegExp) {
    return route.test(pathname);
  }
  return route === pathname;
  });
  const isAuthRoute = authRoutes.includes(pathname);
  const isPublicApi = publicApis.some((api) => pathname.startsWith(api));
  
  // 1. Allow all API auth routes
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // 2. Redirect logged-in users trying to access login/register pages
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
  }

  // 3. Allow unauthenticated users only to public routes or auth routes
  if (!isLoggedIn && !isPublicRoute && !isPublicApi && !isAuthRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  // 4. Check role-based access
  if (isLoggedIn) {
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET!,
      secureCookie: process.env.NODE_ENV === "production",
    });
    
    if (!token ) {
      // console.log(token);
      
      console.warn("Token missing or no role found.");
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    // Loop through protected routes
    for (const pattern in protectedRoutes) {
      const regex = new RegExp(pattern);
      if (regex.test(pathname)) {
        const allowedRoles = protectedRoutes[pattern];
        if (!allowedRoles.includes(token.role)) {
          console.warn(`Access denied for role ${token.role} on ${pathname}`);
          return NextResponse.redirect(new URL("/auth/login", req.url));
        }
      }
    }
  }
  return NextResponse.next();

});

export const config = {
  matcher: [
    // Avoid static files and internals
    "/((?!_next|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
  
    unstable_allowDynamic: [
      // allows a single file
      '/lib/utilities.js',
      // use a glob to allow anything in the function-bind 3rd party module
      '**/node_modules/function-bind/**',
    ],
  
};

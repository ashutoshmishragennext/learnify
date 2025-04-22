/* eslint-disable @typescript-eslint/no-explicit-any */
// src/auth.config.base.ts
// import { LoginSchema } from "@/validaton-schema";
// import bcrypt from "bcryptjs";
// import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

export const authConfigBase: NextAuthConfig = {
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
            }
            return session;
        },
    },
    debug: process.env.NODE_ENV === "development",
    providers: []
};
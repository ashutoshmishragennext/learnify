/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoginSchema } from "@/validaton-schema";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import { findUserByEmail } from "./actions/user";
import type { NextAuthConfig } from "next-auth";
console.log("i am in")
export const authConfig: NextAuthConfig = {

 
  
  providers: [
    Credentials({
      async authorize(credentials) {
        const validation = LoginSchema.safeParse(credentials);
        if (!validation.success) {
          console.error("Validation failed");
          return null;
        }

        const { email, password } = validation.data;

        const user = await findUserByEmail(email);
        console.log("userrrrrrrrrrrrrrrrrrr",user);
        
        if (!user || !user.password) {
          console.error("User not found or password missing");
          return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          console.error("Invalid password");
          return null;
        }

        // Return necessary fields (id, name, email, role)
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
 
  callbacks: {
    async jwt({ token, user }) {
      // When user is logged in, store their role in token
      // console.log("user tocken",user);
      console.log("tocken",token);
      
      
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },

    async session({ session, token }) {
      // Pass the role from token to session
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  session: {
    strategy: "jwt",
  },

  // Optional: Debugging
  debug: process.env.NODE_ENV === "development",
};

export default authConfig;

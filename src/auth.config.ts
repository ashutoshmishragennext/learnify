// src/auth.config.ts
import { authConfigBase } from "./auth.config.base";
import { LoginSchema } from "@/validaton-schema";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import { findUserByEmail } from "./actions/user";

export const authConfig = {
  ...authConfigBase,
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
        
        if (!user || !user.password) {
          console.error("User not found or password missing");
          return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          console.error("Invalid password");
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
};

export default authConfig;
/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { DefaultSession } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/app/models/User";

export type ExtendedUser = DefaultSession["user"] & {
  role: string;
};

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: ExtendedUser;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    role?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        const { email, password, rememberMe } = credentials || {};

        if (!email || !password) {
          console.log("Missing Credentails!");
          return null;
        }

        await dbConnect();

        // Find the user in the database
        const user = await User.findOne({ email });
        // console.log(user.verified);

        if (!user || typeof password !== "string") {
          console.log("Invalid Credentials!");
          return null;
        }

        // Validate the password
        if (user && bcrypt.compareSync(password, user.password)) {
          user.lastLoginAt = new Date();
          user.lastActiveAt = new Date();
          await user.save();
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            rememberMe,
            role: user.role,
          };
        }

        return null; // Invalid credentials
      },
    }),
    // For OTP authentication
    CredentialsProvider({
      name: "OTP",
      credentials: {
        email: { label: "Email", type: "text" },
        otp: { label: "OTP", type: "number" },
      },
      async authorize(credentials) {
        const { email, otp } = credentials || {};

        if (!email || !otp) {
          console.log("Missing OTP or Email!");
          return null;
        }

        await dbConnect();

        // Find the user in the database
        const user = await User.findOne({ email });

        if (!user || user.otp !== otp) {
          console.log("Invalid OTP!");
          return null;
        }

        // Clear the OTP after successful verification
        user.otp = undefined;
        user.verified = true;
        await user.save();

        return { id: user._id.toString(), name: user.name, email: user.email };
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT for sessions
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/login",
  },
  trustHost: true,
  callbacks: {
    async signIn({ account, profile }) {
      await dbConnect();

      if (account?.provider === "github") {
        const existingUser = await User.findOne({ githubId: profile?.id });

        if (!existingUser) {
          const newUser = new User({
            name: profile?.name || profile?.login,
            email: profile?.email || `${profile?.id}@github.com`, // Fallback email
            avatar: profile?.avatar_url,
            verified: true,
            githubId: profile?.id,
            coursesBought: [],
          });
          await newUser.save();
        }
      }

      if (account?.provider === "google") {
        const existingUser = await User.findOne({ email: profile?.email });

        if (!existingUser) {
          const newUser = new User({
            name: profile?.name,
            email: profile?.email,
            avatar: profile?.picture,
            googleId: profile?.sub,
            verified: true,
            coursesBought: [],
          });
          await newUser.save();
        }
      }

      return true;
    },
    async jwt({ token, user, account, profile }) {
  await dbConnect();

  let dbUser = null;

  // Only run this logic during the initial login (when account exists)
  if (account) {
    // Check if we are dealing with GitHub or Google OAuth
    if (account.provider === "github" && profile?.id) {
      dbUser = await User.findOne({ githubId: profile.id });
      token.image = dbUser?.avatar || profile?.avatar_url || null;
    } else if (account.provider === "google" && profile?.sub) {
      dbUser = await User.findOne({ googleId: profile.sub });
      token.image = dbUser?.avatar || profile?.picture || null;
    }

    // For credential login
    if (!dbUser && user) {
      dbUser = await User.findOne({ email: user.email });
      token.image = dbUser?.avatar || null;
    }

    if (dbUser) {
      token.id = dbUser._id.toString();
      token.phone = dbUser.phone || 9999999999;
      token.role = dbUser.role;
      token.name = dbUser.name;
      token.email = dbUser.email;
    } else if (user?.id) {
      token.id = user.id;
      token.name = user.name;
      token.email = user.email;
      token.role = (user as any).role || null;
    }

    if (!token.id) {
      console.error("No valid user ID found during JWT callback");
      throw new Error("Invalid user data in JWT callback");
    }

    token.rememberMe = (user as any)?.rememberMe || false;
    token.provider = account.provider;
  }

  // For subsequent calls, the token already contains all necessary data
  // No need to query the database again

  return token;
},
// async jwt({ token, user, account, profile }) {
//       await dbConnect();

//       let dbUser = null;

//       console.log("account", account);

//       console.log("profile", profile);

//       // Check if we are dealing with GitHub or Google OAuth
//       if (account?.provider === "github" && profile?.id) {
//         dbUser = await User.findOne({ githubId: profile.id });

//         // Use the avatar from the database if it exists, otherwise fallback to the provider's avatar
//         token.image = dbUser?.avatar || profile?.avatar_url || null;
//       } else if (account?.provider === "google" && profile?.sub) {
//         dbUser = await User.findOne({ googleId: profile.sub });
//         // Use the avatar from the database if it exists, otherwise fallback to the provider's avatar
//         token.image = dbUser?.avatar || profile?.picture || null;
//       }

//       console.log("DBUser", dbUser);

//       console.log("user", user);

//       // credential user or not?
//       if (!dbUser && user) {
//         dbUser = await User.findOne({ email: user.email });

//         // Use the avatar from the database if it exists
//         token.image = dbUser?.avatar || null;
//       }

//       if (dbUser) {
//         token.id = dbUser._id.toString(); // MongoDB ObjectId
//         token.phone = dbUser.phone || 9999999999;
//         token.role = dbUser.role;
//       } else if (user?.id) {
//         token.id = user.id; // Fallback
//       }

//       if (!token.id) {
//         console.error("No valid user ID found during JWT callback");
//         throw new Error("Invalid user data in JWT callback");
//       }

//       if (user) {
//         token.rememberMe = (user as any).rememberMe || false;
//         token.name = user.name;
//         token.email = user.email;
//         token.role = (user as any).role || dbUser.role || null;
//       }

//       token.provider = account?.provider || null;

//       return token;
//     },
    async session({ session, token }) {
      if (token) {

        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        // session.user.role =  token.role as string;
        (session.user as any).provider = token.provider as string;
        (session.user as any).phone = (token.phone as number) || null;
        (session.user as any).role = (token.role as string) || null;
      }
      session.expires = token.rememberMe
        ? (new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString() as unknown as string & Date) // 30 days
        : (new Date(
            Date.now() + 60 * 60 * 1000
          ).toISOString() as unknown as string & Date); // 1 hour

      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});

// import NextAuth from "next-auth";
// import { authConfig } from "./auth.config";

// export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);

// import { NextAuthConfig } from "next-auth";
// import GitHubProvider from "next-auth/providers/github";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcryptjs";
// import connectDB from "@/lib/dbConnect";
// import User from "@/app/models/User";

// export const authConfig: NextAuthConfig = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       async authorize(credentials) {
//         const { email, password, rememberMe } = credentials || {};

//         if (!email || !password) return null;

//         await connectDB();
//         const user = await User.findOne({ email });

//         if (!user || typeof password !== "string") return null;

//         if (bcrypt.compareSync(password, user.password)) {
//           return { id: user._id.toString(), name: user.name, email: user.email, rememberMe };
//         }

//         return null;
//       },
//     }),
//     GitHubProvider({
//       clientId: process.env.GITHUB_CLIENT_ID as string,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     }),
//   ],
//   session: {
//     strategy: "jwt",
//     maxAge: 30 * 24 * 60 * 60, // 30 days
//   },
//   pages: {
//     signIn: "/login",
//   },
//   trustHost: true,
//   callbacks: {
//     async signIn({ user, account, profile }) {
//       await connectDB();

//       if (account?.provider === "github") {
//         const existingUser = await User.findOne({ githubId: profile?.id });

//         if (!existingUser) {
//           const newUser = new User({
//             name: profile?.name || profile?.login,
//             email: profile?.email || `${profile?.id}@github.com`,
//             avatar: profile?.avatar_url,
//             githubId: profile?.id,
//             coursesBought: [],
//           });
//           await newUser.save();
//         }
//       }

//       if (account?.provider === "google") {
//         const existingUser = await User.findOne({ email: profile?.email });

//         if (!existingUser) {
//           const newUser = new User({
//             name: profile?.name,
//             email: profile?.email,
//             avatar: profile?.picture,
//             googleId: profile?.sub,
//             coursesBought: [],
//           });
//           await newUser.save();
//         }
//       }

//       return true;
//     },
//     async jwt({ token, user, account, profile }) {
//       await connectDB();

//       let dbUser = null;

//       if (account?.provider === "github" && profile?.id) {
//         dbUser = await User.findOne({ githubId: profile.id });
//         token.image = dbUser?.avatar || profile?.avatar_url || null;
//       } else if (account?.provider === "google" && profile?.sub) {
//         dbUser = await User.findOne({ googleId: profile.sub });
//         token.image = dbUser?.avatar || profile?.picture || null;
//       }

//       if (!dbUser && user) {
//         dbUser = await User.findOne({ email: user.email });
//         token.image = dbUser?.avatar || null;
//       }

//       if (dbUser) {
//         token.id = dbUser._id.toString();
//       } else if (user?.id) {
//         token.id = user.id;
//       }

//       if (!token.id) {
//         console.error("No valid user ID found during JWT callback");
//         throw new Error("Invalid user data in JWT callback");
//       }

//       if (user) {
//         token.rememberMe = (user as any).rememberMe || false;
//         token.name = user.name;
//         token.email = user.email;
//       }

//       token.provider = account?.provider || null;

//       return token;
//     },
//     async session({ session, token }) {
//       if (token) {
//         session.user.id = token.id as string;
//         session.user.name = token.name;
//         session.user.email = token.email as string;
//         session.user.image = token.image as string;
//         (session.user as any).provider = token.provider as string;
//       }

//       session.expires = token.rememberMe
//         ? (new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() as unknown as string & Date) // 30 days
//         : (new Date(Date.now() + 60 * 60 * 1000).toISOString() as unknown as string & Date); // 1 hour

//       return session;
//     },
//   },
//   secret: process.env.AUTH_SECRET,
// };
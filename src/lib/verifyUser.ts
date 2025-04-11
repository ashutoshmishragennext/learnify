"use server";

import User from "@/app/models/User";
import connectDB from "./dbConnect";

const verifyUser = async (email: string) => {
  try {
    if (!email) {
      console.error("Email is not passed!");
      return 0;
    }

    await connectDB();
    const user = await User.findOne({ email });
    if(!user){
      return 2;
    }
    return user?.verified ? 1 : 0;
  } catch (error) {
    console.error("Error verifying user:", error);
    return 0;
  }
};

export default verifyUser;

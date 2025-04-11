import User from "@/app/models/User";
import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import { auth } from "../../../../auth";


export async function GET(){
    const session = await auth();
    if(!session) return NextResponse.json({error: "Session is required!"}, {status: 400});
    try {
        await connectDB();
        await User.findOneAndUpdate({email: session?.user?.email}, {lastActiveAt: new Date()});
        return NextResponse.json({message: "User lastLoginStatus successfully updated."}, {status: 200});

    } catch (error) {
        console.error("Error occured server side", error);
    }
}
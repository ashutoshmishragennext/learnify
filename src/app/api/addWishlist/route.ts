import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import User from "@/app/models/User";
import { auth } from "../../../../auth";

export async function POST(req: Request){
    const session = await auth();
    const {courseId} = await req.json();

    try {
        await connectDB();
        const user = await User.findOne({_id: session?.user?.id});

        if(!user){
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        if (user.wishlist.includes(courseId)) {
            return NextResponse.json({message: "Course is already included"}, {status: 400});
        }
        user.wishlist.push(courseId);
        await user.save();
        return NextResponse.json({message: "Course Added to Wishlist!"}, {status: 200});        
    } 
    catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
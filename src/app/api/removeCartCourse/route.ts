import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import connectDB from "@/lib/dbConnect";
import User from "@/app/models/User";

export async function POST(req: Request) {
    try {
        await connectDB();
        const session = await auth(); // Awaiting authentication

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { courseId } = await req.json();
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        user.cart.pull(courseId); 
        await user.save();

        return NextResponse.json({ message: "Course removed successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error removing course:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

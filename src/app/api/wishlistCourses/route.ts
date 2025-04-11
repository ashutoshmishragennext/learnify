import User from "@/app/models/User";
import connectDB from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import Course from "@/app/models/Course";

export async function GET() {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();
        // console.log("Db gets connected!")
        const user = await User.findOne({ email: session?.user?.email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        // console.log("User founded!");
        // console.log("User wishlist courses: ", user.cart)
        const courses = await Course.find({ courseId: { $in: user.wishlist } });
        if(!courses){
            return NextResponse.json({error: "No courses Found!"}, {status:404});
        }
        // console.log("Courses Found: ", courses);
        return NextResponse.json(courses, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import Course from "@/app/models/Course";
import User from "@/app/models/User";
import connectDB from "@/lib/dbConnect";
import { auth } from "../../../../auth";
import { ICourse } from "@/app/models/Course";

export async function GET() {
    try {
        await connectDB();

        const session = await auth();
        let courses: ICourse[] = [];
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findOne({ _id: session.user.id });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const courseIds = user.coursesBought || [];
        if (courseIds.length === 0) {
            return NextResponse.json(courses , { status: 200 });
        }

        courses = await Course.find({ courseId: { $in: courseIds } });

        return NextResponse.json(courses , { status: 200 });
    } catch (error: unknown) {
        console.error("Error fetching courses:", error);
        return NextResponse.json({ error: error instanceof Error ? error : "Internal Server Error" }, { status: 500 });
    }
}

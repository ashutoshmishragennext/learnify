    import { NextResponse } from "next/server";
    import connectDB from "@/lib/dbConnect"; 
    import Course from "@/app/models/Course"; 
    import { auth } from "../../../../auth";

    export async function POST(req: Request) {
    try {
        await connectDB();

        const data = await req.json();

        const { name, shortDescription, original, current, duration, imageUrl, discountPercentage } = data;

        const session = await auth()

        const userId = session?.user.id;

        const newCourse = new Course({
            name,
            userId,
            image: imageUrl,
            shortDescription,
            price: {
                original,
                current,
                discountPercentage,
            },
            duration,
            lastUpdated: new Date(),
        });
        

        await newCourse.save();

        return NextResponse.json({ message: "Course created successfully", course: newCourse }, { status: 201 });
    } catch (error) {
        console.error("Error saving course:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
    }

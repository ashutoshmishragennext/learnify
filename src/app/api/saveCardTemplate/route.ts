    import { NextResponse } from "next/server";
    import connectDB from "@/lib/dbConnect"; 
    import Course from "@/app/models/Course"; 
    import cloudinary from "@/lib/cloudinary";

    export async function POST(req: Request) {
    try {
        await connectDB();

        // calculating new courseId;
        const courseId:number = await Course.countDocuments()+1;

        const data = await req.json();

        const { name, shortDescription, original, current, duration, file, discountPercentage } = data;

        // // Upload the image to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(file);
        const imageUrl = uploadResponse.secure_url;
        // console.log(imageUrl);


        // Create a new course entry
        const newCourse = new Course({
            courseId,
            name,
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
        // return NextResponse.json({message: `${courseId} is the courseId`}, {status: 200});
    } catch (error) {
        console.error("Error saving course:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
    }

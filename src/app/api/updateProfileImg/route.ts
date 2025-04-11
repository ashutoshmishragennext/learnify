import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/dbConnect";
import { auth } from "../../../../auth";
import User from "@/app/models/User"; // Import the User model

export async function PUT(req: NextRequest) {
  try {
    // Authenticate the user
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Parse FormData from the request
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { message: "Invalid or missing image file" },
        { status: 400 }
      );
    }

    // Convert the file to a buffer and base64 encode it
    const fileData = await file.arrayBuffer();
    const base64File = `data:${file.type};base64,${Buffer.from(fileData).toString("base64")}`;

    // Upload the image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(base64File);

    // Connect to the database
    await connectDB();
    // Update the user's avatar in the database
    const user = await User.findOneAndUpdate(
      { _id: session.user.id }, 
      { $set: {avatar: uploadResponse.secure_url} },        
      { new: true }                 
    );

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    session.user.image = uploadResponse.secure_url;
    return NextResponse.json(
      { message: "Profile image updated successfully", imageUrl: uploadResponse.secure_url },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error updating profile image:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

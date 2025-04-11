import Course from "@/app/models/Course";
import connectDB from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    
    const categories = await Course.distinct("category");

    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

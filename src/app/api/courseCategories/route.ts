import connectDB from "@/lib/dbConnect";
import Category from "@/app/models/Category";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find({}).select("name -_id"); // Only get the names

    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}



export async function POST(req: Request) {
  try {
    await connectDB();
    const { category } = await req.json();

    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    const existing = await Category.findOne({ name: category });
    if (existing) {
      return NextResponse.json({ message: "Category already exists" }, { status: 409 });
    }

    const newCategory = new Category({ name: category });
    await newCategory.save();

    return NextResponse.json({ message: "Category added", category }, { status: 201 });
  } catch (error) {
    console.error("Error adding category:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

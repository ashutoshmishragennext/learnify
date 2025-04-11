import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import User from "@/app/models/User";
import moment from "moment";

export async function GET() {
  await connectDB();

  try {
    const users = await User.find({}, "lastLoginAt lastActiveAt");

    const progressData = [
      { day: "Mon", progress: 0 },
      { day: "Tue", progress: 100 },
      { day: "Wed", progress: 0 },
      { day: "Thu", progress: 0 },
      { day: "Fri", progress: 0 },
      { day: "Sat", progress: 0 },
      { day: "Sun", progress: 0 },
    ];

    users.forEach((user) => {
      if (user.lastLoginAt && user.lastActiveAt) {
        const loginDay = moment(user.lastLoginAt).format("ddd"); // Get login day
        const activeTime = moment(user.lastActiveAt).diff(moment(user.lastLoginAt), "minutes"); // Active minutes

        progressData.forEach((entry) => {
          if (entry.day === loginDay) {
            entry.progress += activeTime; // Add time to respective day
          }
        });
      }
    });

    return NextResponse.json(progressData, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch progress data", error);
    return NextResponse.json({ error: "Failed to fetch progress data" }, { status: 500 });
  }
}

import Course from "@/app/models/Course";
import connectDB from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(){
    try{
        await connectDB();
        const course = await Course.findOneAndUpdate({courseId: 8}, {
            subtitles: {availability: "yes"},
            ratings: { average: 0, totalRatings: 0 },
            rewards: {totalRewards: 20, moduleRewards: [10,10]}
        });

        if(!course){
            return NextResponse.json({message: "Unable to find the course"}, {status: 404});
        }
        return NextResponse.json({message: "Data updated Successfully", course}, {status: 200});
    }
    catch(err){
        console.error("Backend error from updating db",err);
    }
}
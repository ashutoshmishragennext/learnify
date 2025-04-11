import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
// import Course from "@/app/models/Course";
// import Courses from "@/app/ExploreData/page";
// import connectDB from "@/lib/dbConnect";
// import iins from "razorpay/dist/types/iins";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest){
    const {amt} = await request.json();

    console.log("Amount Recieved in backend for : ", amt);

    if (!amt || amt <= 0) {
        return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
      }

    // await connectDB();
    // const course = await Course.findOne({courseId: cId});
    // if (!course) {
    //     return NextResponse.json({ error: "Invalid course ID." }, { status: 400 });
    // }
    // const amt = course.price.current;
    try{
        const order = await razorpay.orders.create({
            amount: amt*100, //amount in paise
            currency: "INR",
            receipt: "receipt_" + Math.random().toString(36).substring(7),
        });
        
        return NextResponse.json({orderId: order.id}, {status: 200})
    }
    catch(error:unknown){
        console.error("Error creating orders: ", error);
        return NextResponse.json({error: error instanceof Error ? error : "Error creating order"}, {status: 500})
    }
}
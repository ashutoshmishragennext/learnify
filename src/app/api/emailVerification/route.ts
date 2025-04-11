import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import crypto from "crypto";
import Verify from '@/app/models/Verify';


export async function POST(req: Request) {
    const {token} = await req.json();
    console.log("Token recieved from client side: ", token);
    await dbConnect();
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    console.log("Hashed token: ", hashedToken);
    const user = await Verify.findOne({
        token: hashedToken,
        expires: {$gt: Date.now()}
    });

    if(!user) {
        return new NextResponse("Invalid token or has expired.", {status: 400});
    }
    // User.verified = true;
    // await User.save();
    await User.findOneAndUpdate({email: user.email}, {$set: { verified: true, lastLoginAt: new Date(), lastActiveAt: new Date()}});
    await user.deleteOne();

    return NextResponse.json({message: "Email is successfully Verified."}, {status: 200});
}
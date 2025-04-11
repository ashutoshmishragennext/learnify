import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import crypto from "crypto";


export async function POST(req: Request) {
    const {token} = await req.json();
    await dbConnect();
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        resetToken: hashedToken,
        resetTokenExpiry: {$gt: Date.now()}
    });

    if(!user) {
        return new NextResponse("Invalid token or has expired.", {status: 400});
    }
    return NextResponse.json(user, {status: 200});
}
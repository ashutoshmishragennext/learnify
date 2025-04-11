import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    const { password, email } = await req.json();
    await dbConnect();

    const existingUser = await User.findOne({email});
    const hashedPassword = await bcrypt.hash(password,10);
    existingUser.password = hashedPassword;
    existingUser.resetToken = undefined;
    existingUser.resetTokenExpiry = undefined;

    try{
        await existingUser.save();
        return new NextResponse("User's password is updated.", {status: 200});
    }
    catch (err: unknown) {
        return NextResponse.json({
            error: err instanceof Error ? err.message : "Unexpected Error Occurred!"},
          { status: 200 }
        );
      }
}
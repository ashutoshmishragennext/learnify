import User from "@/app/models/User";
import connectDB from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import sendEmail from "@/lib/sendEmail";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { otp, savedPassword, email } = await req.json();

    if (!otp || !savedPassword || !email) {
      return NextResponse.json(
        { error: `All fields are required` },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (user) {
      if (user.otp === otp) {
        user.verified = true;
        user.otp = undefined;
        await user.save();
        const result = await sendEmail(email, "PasswordSent", savedPassword);
        if (result) {
          return NextResponse.json(
            { message: "User is successfully verified" },
            { status: 200 }
          );
        } else {
          return NextResponse.json(
            { error: "Error at sending mail" },
            { status: 400 }
          );
        }
      } else {
        return NextResponse.json({ error: "OTP is wrong!" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: `Error occured at backend: ${error}` },
      { status: 400 }
    );
  }
}

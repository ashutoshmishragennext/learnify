import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/app/models/User";
import crypto from "crypto";
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  await dbConnect();
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required!" }, { status: 400 });
  }

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return NextResponse.json({ error: "Email does not exist." }, { status: 400 });
  }

  try {
    const resetToken = crypto.randomBytes(20).toString("hex");
    const passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const passwordResetExpires = Date.now() + 3600000; // 1 hour expiration

    existingUser.resetToken = passwordResetToken;
    existingUser.resetTokenExpiry = passwordResetExpires;

    const resetUrl = `https://learnify-abesit-kunal-tyagis-projects-86468f26.vercel.app/ResetPassword/${resetToken}`;

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Use your email service (e.g., "Gmail", "Outlook", or custom SMTP)
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app password
      },
    });

    const mailOptions = {
      from: `"Learnify Support" <${process.env.EMAIL_USER}>`, // Sender address
      to: email, // Recipient address
      subject: "Reset Your Password: Learnify",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background: #f5f2fc; box-shadow: 0 4px 15px rgba(128, 0, 128, 0.2);">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://res.cloudinary.com/dtfe8o5ny/image/upload/v1736586694/Gemini_Generated_Image_9yp2if9yp2if9yp2_wahy7d.jpg" alt="Learnify Logo" style="width: 180px; height: auto; border-radius: 10px;">
          </div>
          <h2 style="color: #4b0082; text-align: center;">Reset Your Password</h2>
          <p style="color: #333; text-align: center;">Hello,</p>
          <p style="color: #4b0082; font-weight: bold; text-align: center;">
            We noticed that you requested a password reset for your Learnify account. Click the button below to proceed. This link will expire in <strong>1 hour</strong>.
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetUrl}" style="background: #800080; color: #fff; text-decoration: none; padding: 10px 20px; font-size: 16px; font-weight: bold; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #555; text-align: center; margin-top: 20px;">
            If you didn’t request this change, you can safely ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #777; font-size: 12px; text-align: center;">
            Need help? Contact us at <a href="mailto:support@learnify.com" style="color: #800080;">support@learnify.com</a>.
          </p>
        </div>
      `,
    };
    // Send the email
    await transporter.sendMail(mailOptions);

    await existingUser.save();

    return NextResponse.json({ message: "Reset password email sent successfully." }, { status: 200 });
  } catch (error) {
    existingUser.resetToken = undefined;
    existingUser.resetTokenExpiry = undefined;
    await existingUser.save();

    console.error("Error in ForgetPassword route:", error);
    return NextResponse.json({ error: "Error in sending email." }, { status: 500 });
  }
}

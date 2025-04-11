import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/app/models/User";
import crypto from "crypto";
import nodemailer from "nodemailer"
import Verify from "@/app/models/Verify";
import bcrypt from 'bcryptjs';
// import { traceGlobals } from "next/dist/trace/shared";

export async function POST(req: Request) {
  await dbConnect();
  const { email , name, password} = await req.json();

  if (!email && !name) {
    return NextResponse.json({ error: "Email is required!" }, { status: 400 });
  }
  const existingUser = await User.findOne({email});

  if(existingUser){
    return NextResponse.json({error: "User already Exists"}, {status: 400 });
  }
  try{
    const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        verified: false
      });
  
      await newUser.save();
    }
    catch (error) {
      console.error('Error in sendVerificationEmail route:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
    console.log("User is successfully registered!");
      // return NextResponse.json({ message: 'User created successfully' }, { status: 201 });

  try {
    const verifyToken = crypto.randomBytes(20).toString("hex");
    const emailverifyToken = crypto.createHash("sha256").update(verifyToken).digest("hex");
    const emailverifyExpires = Date.now() + 3600000; // 1 hour expiration
    await Verify.findOneAndUpdate(
      { email },
      { token: emailverifyToken, expires: emailverifyExpires },
      { new: true, upsert: true } //either update or insert
    );

    const verifyUrl = `http://localhost:3000/verifyEmail/${verifyToken}`;    
    // const verifyUrl = `https://learnify-abesit-kunal-tyagis-projects-86468f26.vercel.app/verifyEmail/${verifyToken}`;

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
      subject: "Verify Your Email: Learnify",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background: #f5f2fc; box-shadow: 0 4px 15px rgba(128, 0, 128, 0.2);">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://res.cloudinary.com/dtfe8o5ny/image/upload/v1736586694/Gemini_Generated_Image_9yp2if9yp2if9yp2_wahy7d.jpg" alt="Learnify Logo" style="width: 180px; height: auto; border-radius: 10px;">
          </div>
          <h2 style="color: #4b0082; text-align: center;">Verify Your Email</h2>
          <p style="color: #333; text-align: center;">Hello ${name}, </p>
          <p style="color: #4b0082; font-weight: bold; text-align: center;">
            We noticed that you requested a Email Verification mail for your Learnify account. Click the button below to proceed. This link will expire in <strong>1 hour</strong>.
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${verifyUrl}" style="background: #800080; color: #fff; text-decoration: none; padding: 10px 20px; font-size: 16px; font-weight: bold; border-radius: 5px; display: inline-block;">
              Verify Email
            </a>
          </div>
          <p style="color: #555; text-align: center; margin-top: 20px;">
            If you didn’t request it, you can safely ignore this email.
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

    // await user.save();

    return NextResponse.json({ message: "Email Verification link sent successfully." }, { status: 200 });
  } catch (error) {
    await Verify.insertOne(
      {
        email: email, 
        token: undefined,
        expires: undefined
      }
    )
    // user.verifyToken = undefined;
    // user.verifyTokenExpiry = undefined;
    // await user.save();

    console.error("Error in sendVerificationEmail route:", error);
    return NextResponse.json({ error: "Error in sending email." }, { status: 500 });
  }
}

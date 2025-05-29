"use server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import connectDB from "./dbConnect";
import Verify from "@/app/models/Verify";
import Course from "@/app/models/Course";
import User from "@/app/models/User";


const sendEmail = async(email:string, task:string, other?: null | undefined | number | string)=>{

    await connectDB();
    try{
        const verifyToken = crypto.randomBytes(20).toString("hex");
        const emailverifyToken = crypto.createHash("sha256").update(verifyToken).digest("hex");
        const emailverifyExpires = Date.now() + 3600000; // 1 hour expiration
        await Verify.findOneAndUpdate(
          { email },
          { token: emailverifyToken, expires: emailverifyExpires },
          { new: true, upsert: true } //either update or insert
        );
    
       let toDo; let subject, description, buttonDesc, heading;
        if(task === "Verification"){
          const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verifyEmail/${verifyToken}`;
          toDo = verifyUrl;
          subject = "Verify Your Email";
          heading = "Verify Your Email";
          description = "We noticed that you requested a Email Verification link for your Learnify account. Click the button below to proceed. This link will expire in <strong>1 hour</strong>"
          buttonDesc = "Verify Email"
        }
        else if(task === "Authentication"){
          const code = Math.floor(100000 + Math.random() * 900000); //6 digit code
          // console.log("Code is of type: ",typeof(code));
          const user = await User.findOne({email});
          if(!user){
            return false;
          }
          try {
            user.otp = code;
            await user.save();
            // console.log("OTP updated successfully:", user.otp);
          } catch (err) {
            console.error("Error saving OTP:", err);
          }
          subject = "Verify Your Email";
          heading = "Verify Your Email";
          description = `We noticed that you requested an email verification code for your Learnify account. To proceed with verifying your email, please use the following code: <strong>${code}</strong>`
          buttonDesc = ""

        }
        else if(task === "PasswordSent"){
          const password = other;
          subject = "Password for Learnify";
          heading = "Your Password";
          description = `For logging in your Learnify account. Please use the following password: <strong>${password}</strong>`
          buttonDesc = ""
        }
        else{
          const courseId = other;
          const course = await Course.findOne({courseId: courseId});
          if(!course) {
            return false;
          }
          subject = "Download Syllabus";
          heading = "Download Syllabus";
          description = "You can Download the syllabus from clicking the button below.";
          buttonDesc = "Download Syllabus"; 
          const syllabusLink = course.syllabus;
          toDo = syllabusLink;
        }

    
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
          subject: `${subject}: Learnify`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background: #f5f2fc; box-shadow: 0 4px 15px rgba(128, 0, 128, 0.2);">
              <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://res.cloudinary.com/dtfe8o5ny/image/upload/v1736586694/Gemini_Generated_Image_9yp2if9yp2if9yp2_wahy7d.jpg" alt="Learnify Logo" style="width: 180px; height: auto; border-radius: 10px;">
              </div>
              <h2 style="color: #4b0082; text-align: center;">${heading}</h2>
              <p style="color: #333; text-align: center;">Hello </p>
              <p style="color: #4b0082; font-weight: bold; text-align: center;">
                ${description}.
              </p>
              ${buttonDesc ? `
                <div style="text-align: center; margin: 20px 0;">
                  <a href="${toDo}" style="background: #800080; color: #fff; text-decoration: none; padding: 10px 20px; font-size: 16px; font-weight: bold; border-radius: 5px; display: inline-block;">
                    ${buttonDesc}
                  </a>
                </div>` : ''}
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
        return true;
        }
        catch(error: unknown){
            if(error instanceof Error){
                console.error("Problem in sending mail.");
                return false;
            }
            else{
                return false;
            }

        }
};

export default sendEmail;
import User from "@/app/models/User";
import connectDB from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import generatePassword from "@/lib/generatePassword";
import sendEmail from "@/lib/sendEmail";


export async function POST(req: Request){
    try {
        await connectDB();
        const {email} = await req.json();
        if(!email){
            return NextResponse.json({error: `Email is required!`}, {status: 400});
        }

        const user = await User.findOne({email});
        // console.log("Results from backen: ",
        //     user.verified);
        if(!user){            
                const password = await generatePassword(8);
                const hashedPassword = await bcrypt.hash(password, 10);

                const newUser = new User({
                  name: "New User",
                  email,
                  password: hashedPassword,
                });
            
                await newUser.save();
                console.log("User saved to the db");
                const result = await sendEmail(email, "Authentication");
                if(result){
                    return NextResponse.json({message: "OTP sent to your mail", Password: password}, {status: 200});
                }
                else{
                    return NextResponse.json({error: "Error at sending mail"}, {status: 400});
                }
        }
        else if(user && user.verified){
            const result = await sendEmail(email, "Authentication");
            if (result) {
              return NextResponse.json({ message: "OTP sent to your mail" }, { status: 200 });
            } else {
              return NextResponse.json({ error: "Error at sending mail" }, { status: 400 });
            }
        }
        // else if(user && !user.verified){
        //     const result = await sendEmail(email, "Authentication");
        //         if(result){
        //             return NextResponse.json({message: "OTP sent to your mail", Password: password}, {status: 200});
        //         }
        //         else{
        //             return NextResponse.json({error: "Error at sending mail"}, {status: 400});
        //         }
        // }
        else{
            return NextResponse.json({error: "Email is already in use"}, {status: 400});
        }
    } catch (error) {
        return NextResponse.json({error: `Error occured at backend: ${error}`}, {status: 400});
    }
}
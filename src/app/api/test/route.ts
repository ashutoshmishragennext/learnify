import { findUserById } from "@/actions/user";
import { NextResponse } from "next/server";

export async function GET(){
      const user = await findUserById("67fa2972893ab9dc8a17cf9a");
      // async jwt({ token }) {
      //   if (!token.sub) return token;
  
       
        
      
          return NextResponse.json(user)
}
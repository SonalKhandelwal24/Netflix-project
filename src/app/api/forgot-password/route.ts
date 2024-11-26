import { UserData } from "@/util/model/user";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'; // For generating a token (optional, but recommended)

export async function connectToDatabase() {
    if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("Connected to MongoDB");
    }
}

export async function POST(req: NextRequest) {

    try {
        // Ensure MongoDB is connected
        await connectToDatabase();

        const { email } = await req.json();
        const user = await UserData.findOne({ email});
        console.log(email);
        console.log(user)

        if(!user) {
            return NextResponse.json({ success: false, message: "User not found"}, { status: 404 });
        }

        const resetToken =  jwt.sign({ id: user._id, email:user.email }, process.env.ACCESS_TOKEN_SECRET ?? '', { expiresIn: '1h' });
        
        const resetLink = `token=${resetToken}`;
        return NextResponse.json({ success: true, message: 'Reset link generated', resetLink}, { status: 200 });
        
    } catch (error) {
        console.error("Error generating reset link:", error);
        return NextResponse.json({ success: false, message: "Failed to generate reset link" }, { status: 500 });
    }
}


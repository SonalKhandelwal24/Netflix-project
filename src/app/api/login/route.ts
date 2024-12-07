// MongoDB connection utility
import { UserData } from "@/util/model/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'; // Make sure to install bcryptjs
import jwt from 'jsonwebtoken'; // For generating a token (optional, but recommended)
import { connectToDatabase } from '@/util/db';

function createAccessToken(userId: string, userEmail: string, userName: string) {
    return jwt.sign({ id: userId, email: userEmail, username: userName}, process.env.ACCESS_TOKEN_SECRET || "", { expiresIn: '1h' });
}

export async function POST(req: NextRequest) 
{
        try {
            await connectToDatabase();

            // Parse JSON payload
            const { email, password } = await req.json();
            // console.log("Parsed Body:", { email, password }); 

            const user = await UserData.findOne({ email });
            if (!user) {
                return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 });
            }

            // Compare the password with the hashed password in the database
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 });
            }

            // Optionally, generate a JWT token if authentication is successful
            const token = createAccessToken(user._id, user.email, user.username);

            const response = NextResponse.json({success: true, message: 'Login successful', token});

            response.cookies.set('authToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Ensure secure in production
                sameSite: 'strict',
                path: '/',
                maxAge:  60 * 60, // 1 hour
            });

            return response;

        } catch (error) {
            console.error("Error during login:", error);
            return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
        }
  
}



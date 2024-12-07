// MongoDB connection utility
import { connectToDatabase } from "@/util/db";
import { UserData } from "@/util/model/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 

export async function GET() {
    try {
        // Ensure we are connected to MongoDB
        await connectToDatabase();

        // Fetch data from MongoDB
        const data = await UserData.find();
        console.log(data);

        // Return data in the response
        return NextResponse.json({ result: data, success: true }, { status: 200 });
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ success: false, error: 'Error fetching data' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();

        const { username, email, password } = await req.json();
        console.log("Received request data:", { username, email });

        const existingUser = await UserData.findOne({ email });
        if (existingUser) {
            console.log("User with this email already exists:", existingUser);
            return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const maxuser = await UserData.findOne({}).sort({ userid: -1 }).exec();
        const nextUserId = maxuser && maxuser.userid ? maxuser.userid + 1 : 1;

        const newuser = new UserData({
            userid: nextUserId,
            username,
            email, 
            password: hashedPassword
        });
        const result = await newuser.save();

        const token = jwt.sign({ id: newuser._id, email: newuser.email, username: newuser.username },
            process.env.ACCESS_TOKEN_SECRET ?? '', { expiresIn: '1h' });

        const response = NextResponse.json({success: true, message: 'Register successful', token, result});

        response.cookies.set('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Ensure secure in production
            sameSite: 'strict',
            path: '/',
            maxAge:  60 * 60, // 1 hour
        });

        return response;

    } catch (error) {
        console.error("Error saving user data:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}


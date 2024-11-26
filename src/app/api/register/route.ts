// MongoDB connection utility
import mongoose, { mongo } from 'mongoose';
import { UserData } from "@/util/model/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 

export async function connectToDatabase() {
    if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("Connected to MongoDB");
    }
}

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

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        // Ensure MongoDB is connected
        await connectToDatabase();

        const { username, email, password } = await req.json();
        console.log("Received request data:", { username, email });

        // Check if user already exists
        const existingUser = await UserData.findOne({ email });
        if (existingUser) {
            console.log("User with this email already exists:", existingUser);
            return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 });
        }
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Get the next user ID (auto-increment)
        const maxuser = await UserData.findOne({}).sort({ userid: -1 }).exec();
        const nextUserId = maxuser && maxuser.userid ? maxuser.userid + 1 : 1;

        // Create the new user
        const newuser = new UserData({
            userid: nextUserId,
            username,
            email, 
            password: hashedPassword
        });
        const result = await newuser.save();

        // Generate a JWT token
        const token = jwt.sign({ id: newuser._id, email: newuser.email, username: newuser.username },
            process.env.ACCESS_TOKEN_SECRET ?? '', { expiresIn: '1h' });

        const response = NextResponse.json({success: true, message: 'Register successful', token});

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


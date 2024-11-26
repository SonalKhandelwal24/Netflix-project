// MongoDB connection utility
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from "next/server";
import { MovieData } from '@/util/model/movie';
import { UserData } from '@/util/model/user';

export async function connectToDatabase() {
    if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("Connected to MongoDB");
    }
}

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        await connectToDatabase();

        const { email } = await req.json();

        const favrouteMovies = await UserData.find({favoriteIds});

        return NextResponse.json({ success: true, result: favrouteMovies }, { status: 200 });

    } catch (error) {
        console.error("Error during login:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }

}





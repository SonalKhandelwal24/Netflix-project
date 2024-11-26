// MongoDB connection utility
import mongoose from 'mongoose';
import { MovieData } from "@/util/model/movie"; // Ensure your model is correctly defined
import { NextRequest, NextResponse } from "next/server";


export async function connectToDatabase() {
    if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("Connected to MongoDB");
    }
}

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        await connectToDatabase();

        const totalMovies = await MovieData.find();
        console.log("Fetched All Movies:", totalMovies);

        // Respond with the random movie
        if (totalMovies) {
            return NextResponse.json({ success: true, result: totalMovies }, { status: 200 });
        } else {
            return NextResponse.json({ success: false, message: "No movies found" }, { status: 404 });
        }
    } catch (error) {
        console.error("Error in GET request:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

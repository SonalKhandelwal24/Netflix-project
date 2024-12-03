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
        // Connect to MongoDB
        await connectToDatabase();

        // Count total movies
        const movieCount = await MovieData.countDocuments();
        // console.log("Total Movies:", movieCount);

        // Generate a random index
        const randomIndex = Math.floor(Math.random() * movieCount);
        // console.log("Random Index:", randomIndex);

        // Fetch the random movie
        const randomMovie = await MovieData.findOne().skip(randomIndex);
        // console.log("Fetched Movie:", randomMovie);

        // Respond with the random movie
        if (randomMovie) {
            return NextResponse.json({ success: true, result: randomMovie }, { status: 200 });
        } else {
            return NextResponse.json({ success: false, message: "No movies found" }, { status: 404 });
        }
    } catch (error) {
        console.error("Error in GET request:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

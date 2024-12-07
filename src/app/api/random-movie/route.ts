// MongoDB connection utility
import { MovieData } from "@/util/model/movie"; // Ensure your model is correctly defined
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/util/db";

export async function GET() {
    try {
        await connectToDatabase();

        const movieCount = await MovieData.countDocuments();
        // console.log("Total Movies:", movieCount);

        const randomIndex = Math.floor(Math.random() * movieCount);
        // console.log("Random Index:", randomIndex);

        const randomMovie = await MovieData.findOne().skip(randomIndex);
        // console.log("Fetched Random Movie:", randomMovie);

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

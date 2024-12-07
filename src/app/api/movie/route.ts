// MongoDB connection utility
import { MovieData } from "@/util/model/movie"; // Ensure your model is correctly defined
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/util/db";

export async function GET() {
    try {
        await connectToDatabase();

        const totalMovies = await MovieData.find();

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

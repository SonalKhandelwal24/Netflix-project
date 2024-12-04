// MongoDB connection utility
import mongoose from 'mongoose';
import { MovieData } from "@/util/model/movie"; // Ensure your model is correctly defined
import {  NextResponse } from "next/server";

export async function connectToDatabase() {
    if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("Connected to MongoDB");
    }
}

export async function GET(
    req: Request,
    { params }: { params: { movieid: string } }
  ) {
    try {
      await connectToDatabase();
  
      const { movieid } = params; 
        // console.log("movieid:", movieid);

        if (!movieid) {
            return NextResponse.json({ success: false, message: "Movie ID is required" }, { status: 400 });
        }

        const movie = await MovieData.findOne({movieid});
        // console.log(movie);        
        if (movie) {
            return NextResponse.json({ success: true, result: movie }, { status: 200 });
        } else {
            return NextResponse.json({ success: false, message: "Movie not found" }, { status: 404 });
        }
    } catch (error) {
        console.error("Error in GET request:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

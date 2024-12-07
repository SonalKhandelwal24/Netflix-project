// MongoDB connection utility
import { MovieData } from "@/util/model/movie"; // Ensure your model is correctly defined
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/util/db";

interface Params {
  movieid: string;
}

export async function GET(req: Request, context: { params: { movieid: string } }) {
  try {
    await connectToDatabase();

    const { movieid } = context.params;
    if (!movieid) {
      return NextResponse.json({ success: false, message: "Movie ID is required" }, { status: 400 });
    }

    const movie = await MovieData.findOne({ movieid });
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

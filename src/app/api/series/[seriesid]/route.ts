// MongoDB connection utility
import mongoose from 'mongoose';
import { NextResponse } from "next/server";
import { SeriesData } from '@/util/model/series';


export async function connectToDatabase() {
    if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("Connected to MongoDB");
    }
}

export async function GET(req: Request, { params }: { params: { seriesid: string }}) {
    try {
      await connectToDatabase();
  
      const { seriesid } = params; 
        console.log("seriesid:", seriesid);

        if (!seriesid) {
            return NextResponse.json({ success: false, message: "Series ID is required" }, { status: 400 });
        }

        const series = await SeriesData.findOne({seriesid});
        console.log("series : ", series);        
        if (series) {
            return NextResponse.json({ success: true, result: series }, { status: 200 });
        } else {
            return NextResponse.json({ success: false, message: "Series not found" }, { status: 404 });
        }
    } catch (error) {
        console.error("Error in GET request:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

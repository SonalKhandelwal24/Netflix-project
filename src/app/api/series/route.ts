// MongoDB connection utility
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from "next/server";
import { SeriesData } from '@/util/model/series';

export async function connectToDatabase() {
    if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("Connected to MongoDB");
    }
}

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        await connectToDatabase();

        const totalSeries = await SeriesData.find();
        // console.log(totalSeries);
        if (totalSeries) {
            return NextResponse.json({ success: true, result: totalSeries }, { status: 200 });
        } else {
            return NextResponse.json({ success: false, message: "No Series found" }, { status: 404 });
        }
    } catch (error) {
        console.error("Error in GET request:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

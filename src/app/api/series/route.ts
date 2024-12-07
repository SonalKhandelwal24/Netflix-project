// MongoDB connection utility
import { NextResponse } from "next/server";
import { SeriesData } from '@/util/model/series';
import { connectToDatabase } from "@/util/db";

export async function GET() {
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

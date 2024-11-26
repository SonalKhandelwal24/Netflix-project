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

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        await connectToDatabase();

        const { email, movieid } = await req.json();

        // Validate inputs
        if (!email || !movieid) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        const existingMovie = await MovieData.findOne({ movieid });
        if (!existingMovie) {
            return NextResponse.json({ success: false, message: "Invalid Movie ID" }, { status: 400 });
        }

        const user = await UserData.findOneAndUpdate(
            { email: email },
            { $addToSet: { favrouteIds: movieid } }, // Prevents duplicates in the array
            { new: true } // Returns the updated document
        );

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, result: user }, { status: 200 });

    } catch (error) {
        console.error("Error during login:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }

}

export async function DELETE(req: NextRequest, res: NextResponse) {
    try {
        await connectToDatabase();

        const { email, movieid } = await req.json();

        // Validate inputs
        if (!email || !movieid) {
            return NextResponse.json({ success: false, message: 'Email and movie ID are required' }, { status: 400 });
        }

        // Check if the movie exists
        const existingMovie = await MovieData.findOne({ movieid });
        if (!existingMovie) {
            return NextResponse.json({ success: false, message: 'Movie not found' }, { status: 404 });
        }

        // Remove movieid from the user's favrouteIds
        const updatedUser = await UserData.findOneAndUpdate(
            { email },
            { $pull: { favrouteIds: movieid } }, // Remove movieid from the array
            { new: true } // Return the updated user document
        );

        // If user not found
        if (!updatedUser) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, result: updatedUser }, { status: 200 } );

    } catch (error) {
        console.error('Error during DELETE:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}



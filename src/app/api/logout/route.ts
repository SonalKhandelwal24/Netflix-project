// MongoDB connection utility
import { connectToDatabase } from "@/util/db";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        await connectToDatabase();

        // Clear the token from cookies
        const response = NextResponse.json({ success: true, message: "Logout successful" });

        // Delete the authToken cookie by setting it with an expired maxAge
        response.cookies.set('authToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Secure flag for production
            maxAge: 0, // Expire immediately
            path: '/', // Cookie available across the site
        });

        return response;

    } catch (error) {
        console.error("Error during logout:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }

}



import { UserData } from "@/util/model/user";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/util/db";
import jwt, { JwtPayload } from 'jsonwebtoken';

export async function POST(req: NextRequest) {
    await connectToDatabase();

    try {
        // Extract token and password from the request body
        const { token, password } = await req.json();
        console.log(token);

        // Verify the token using jwt.verify
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;
        if (!decoded) {
            return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 400 });
        }

        // Check if the decoded tken has a valid user ID
        const user = await UserData.findOne({ email: decoded.email, _id: decoded.id });
        console.log(user);

        if (!user) {
            return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 400 });
        }

        // Update the user's password and clear the reset token and expiry
        const pass = await bcrypt.hash(password, 10);
        console.log(pass);
        user.password = pass
        await user.save();

        return NextResponse.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.error("Error during password reset:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

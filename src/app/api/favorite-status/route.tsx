import { UserData } from "@/util/model/user";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from 'jsonwebtoken';

export async function POST(req: NextRequest, res: NextResponse) {
    const { movieid, seriesid } = await req.json();
    const token = req.cookies.get("authToken")?.value;

    if (!token) {
        return NextResponse.json({ success: false, message: "Token is missing" }, { status: 400 });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;
    const user = await UserData.findOne({ email: decoded.email });

    if (!user) {
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const isFavorite = user.favoriteIds.includes(movieid || seriesid);

    return NextResponse.json({ success: true, isFavorite }, { status: 200 });
}

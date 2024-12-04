import mongoose from 'mongoose';
import { NextRequest, NextResponse } from "next/server";
import { MovieData } from '@/util/model/movie';
import { UserData } from '@/util/model/user';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { SeriesData } from '@/util/model/series';

async function connectToDatabase() {
    if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("Connected to MongoDB");
    }
}

async function getUserFromToken(req: NextRequest) {
    const token: any = req.cookies.get('authToken')?.value;
    if (!token) {
        throw new Error('Token is missing');
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;
    if (!decoded?.email || Date.now() >= decoded.exp * 1000) {
        throw new Error('Invalid or expired token');
    }
    const user = await UserData.findOne({ email: decoded.email });
    if (!user) {
        throw new Error('User not found');
    }
    return user;
}

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        await connectToDatabase();

        const { movieid, seriesid } = await req.json();
        if (!movieid && !seriesid) {
            return NextResponse.json({ success: false, message: "Movie ID or Series ID is required" }, { status: 400 });
        }
        console.log("Added movieid", movieid);
        console.log("Added seriesid", seriesid);

        const user = await getUserFromToken(req);

        let updated = false;

        if (movieid && !user.favoriteIds.includes(movieid)) {
            user.favoriteIds.push(movieid);
            updated = true;
        }

        if (seriesid && !user.favoriteIds.includes(seriesid)) {
            user.favoriteIds.push(seriesid);
            updated = true;
        }

        if (!updated) {
            return NextResponse.json({ success: false, message: "Already in favorites" }, { status: 400 });
        }

        await user.save();

        return NextResponse.json({ success: true, result: user.favoriteIds }, { status: 200 });
    } catch (err) {
        console.error("Error:", err);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, res: NextResponse) {
    try {
        await connectToDatabase();

        const { movieid, seriesid } = await req.json();
        if (!movieid && !seriesid) {
            return NextResponse.json({ success: false, message: "Movie ID or Series ID is required" }, { status: 400 });
        }

        const user = await getUserFromToken(req);

        const initialLength = user.favoriteIds.length;

        if (movieid) {
            user.favoriteIds = user.favoriteIds.filter((id: any) => id !== movieid);
        }

        if (seriesid) {
            user.favoriteIds = user.favoriteIds.filter((id: any) => id !== seriesid);
        }

        if (initialLength === user.favoriteIds.length) {
            return NextResponse.json({ success: false, message: "ID not found in favorites" }, { status: 400 });
        }

        await user.save();

        return NextResponse.json({ success: true, result: user.favoriteIds }, { status: 200 });
    } catch (err) {
        console.error('Error removing favorite:', err);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        await connectToDatabase();

        const user = await getUserFromToken(req);

        const movies = await MovieData.find({ movieid: { $in: user.favoriteIds } });
        const series = await SeriesData.find({ seriesid: { $in: user.favoriteIds } });
        console.log("Favorite Ids : " , user.favoriteIds);
        console.log("series :", series);
        console.log(series.map(serie => serie.seriesid)); 

        return NextResponse.json({
            success: true,
            result: [
                ...movies.map((movie) => ({
                  id: movie.movieid,
                  type: 'movie',
                  title: movie.title,
                  thumbnailUrl: movie.thumbnailUrl,
                  videoUrl:movie.videoUrl,
                  description: movie.description,
                  genre: movie.genre,
                  duration: movie.duration,
                })),
                ...series.map((serie) => ({
                  id: serie.seriesid,
                  type: 'series',
                  title: serie.title,
                  thumbnailUrl: serie.thumbnailUrl,
                  videoUrl:serie.videoUrl,
                  description: serie.description,
                  genre: serie.genre,
                  duration: serie.duration,
                }))
             ]             
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching favorites:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

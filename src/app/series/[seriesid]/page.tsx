"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";

interface WatchProps {
    title: string;
    videoUrl: string;
}

interface ParamProps {
    params: Promise<{ movieid?: string; seriesid?: string }>;
}

export default function WatchPage({ params }: ParamProps) {
    const router = useRouter();
    const [movie, setMovie] = useState<WatchProps | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                const resolvedParams = await params;
                const { seriesid } = resolvedParams;

                const response = await fetch(`http://192.168.1.50:3000/api/series/${seriesid}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setMovie(data.result);
            } catch (error: any) {
                console.error("Error fetching movie data:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieData();
    }, [params]);

    if (loading) {
        return (
            <div className="h-screen w-screen flex justify-center items-center bg-black text-white">
                Loading...
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="h-screen w-screen flex justify-center items-center bg-black text-white">
                Content not found
            </div>
        );
    }

    return (
        <div className="h-screen w-screen bg-black">
            <nav
                onClick={() => router.push("/")}
                className="fixed w-full p-4 z-10 flex flex-row items-center gap-8 bg-black bg-opacity-70"
            >
                <AiOutlineArrowLeft className="text-white" size={30} />
                <p className="text-white text-lg md:text-3xl font-semibold">
                    <span className="font-light">Watching: </span>
                    {movie.title}
                </p>
            </nav>
            <video autoPlay controls className="h-full w-full" src={movie.videoUrl} crossOrigin="anonymous" />
        </div>
    );
}

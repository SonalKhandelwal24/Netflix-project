import { useEffect, useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";

interface BillBoardProps {
    thumbnailUrl: string;
    videoUrl: string;
    title: string;
    description: string;
    id: number;
}

const BillBoard = () => {
    const [data, setData] = useState<BillBoardProps | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await fetch('http://192.168.1.50:3000/api/random-movie');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const movieData = await response.json();
                setData(movieData.result);
                setError(null);
            } catch (error: any) {
                console.error("Error fetching movie data:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, []);

    if (loading) {
        return <div className="text-white text-lg">Loading...</div>;
    }

    if (error) {
        return (
            <div className="text-red-500 text-lg flex justify-center items-center h-[56.25vw]">
                <p>Failed to load the movie. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="relative lg:h-[60vh] md:h-[50vh] h-[30vh]">
            {data && (
                <>
                    <video
                        className="w-full lg:h-[60vh] md:h-[50vh] h-[30vh] object-cover brightness-[50%]"
                        loop 
                        muted 
                        autoPlay
                        poster={data.thumbnailUrl}
                        src={data.videoUrl} 
                    ></video>

                    <div className="absolute top-[30%] md:top-[40%] ml-4 md:ml-16">
                        <p className="text-white text-xl md:text-4xl lg:text-5xl h-full w-[50%] font-bold drop-shadow-xl">
                            {data.title}
                        </p>
                        <p className="text-white text-[8px] md:text-lg mt-3 md:mt-8 w-[90%] md:w-[80%] lg:w-[50%] drop-shadow-xl">
                            {data.description}
                        </p> 
                        <div className="flex flex-row items-center mt-3 md:mt-4 gap-3">
                            <button
                                className="bg-white text-white bg-opacity-30 rounded-md py-1 md:py-2 px-2 md:px-4 w-auto text-xs lg:text-lg font-semibold flex flex-row items-center hover:bg-opacity-20 transition">
                                <AiOutlineInfoCircle className="mr-1" />
                                More Info
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default BillBoard;

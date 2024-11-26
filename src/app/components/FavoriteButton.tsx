import { useEffect, useState, useCallback, useMemo } from "react";
import { AiOutlinePlus } from "react-icons/ai";

interface FavoriteButtonProps {
    movieid : string
}
const FavoriteButton: React.FC<FavoriteButtonProps> = ({movieid}) => {
    
    const [favorite, setFavorite] = useState(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavoriteMovies = async () => {
            try {
                const response = await fetch('http://192.168.1.50:3000/api/favorites');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const favoriteList = await response.json();
                setFavorite(favoriteList.result);
                setError(null);
            } catch (error: any) {
                console.error("Error fetching movie data:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFavoriteMovies();
    }, []);

    return (
        <div className="cursor-pointer group/item w-6 h-6 lg:w-10 lg:h-10 border-white border-2 rounded-full flex justify-center items-center transition hover:border-netural-300">
            <AiOutlinePlus className="text-white" size={25} />
        </div>
    )
}

export default FavoriteButton;
import { useState, useEffect, useCallback } from "react";
import { AiOutlinePlus, AiOutlineCheck } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toggleRefresh } from "../redux/slice/refreshSlice";

interface FavoriteButtonProps {
  movieid?: string;
  seriesid?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ movieid, seriesid }) => {

  const [isFavorite, setIsFavorite] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const itemType = movieid ? "Movie" : "Series"; 
  const dispatch = useDispatch();

  const fetchFavoriteStatus = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/favorite-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movieid, seriesid }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch favorite status.");
      }

      const data = await response.json();
      if (typeof data.isFavorite === "boolean") {
        setIsFavorite(data.isFavorite); 
      } else {
        throw new Error("Invalid response structure from the API.");
      }
    } catch (error: any) {
      console.error("Error fetching favorite status:", error.message);                                          
      setIsFavorite(false); 
    } finally {
      setLoading(false);
    }
  }, [movieid, seriesid]);

  useEffect(() => {
    fetchFavoriteStatus();
  }, [fetchFavoriteStatus]);

  const toggleFavorite = async () => {
    try {
      const method = isFavorite ? "DELETE" : "POST";
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/favorite`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movieid, seriesid }),
      });

      if (!response.ok) {
        throw new Error("Failed to update favorites.");
      }

      setIsFavorite(!isFavorite);
      toast.success(
        `${itemType} ${!isFavorite ? "added to" : "removed from"} favorites!`,
        { autoClose: 3000, closeOnClick: true, pauseOnHover: true }
      );
      dispatch(toggleRefresh());
    } catch (error: any) {
      console.error("Error updating favorites:", error.message);
      toast.error(error.message || "Something went wrong!", {
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };

  const Icon = isFavorite ? AiOutlineCheck : AiOutlinePlus;

  return (
    <>
      <div>
        <button
          onClick={toggleFavorite}
          className="cursor-pointer group/item w-6 h-6 lg:w-10 lg:h-10 border-white border-2 rounded-full flex justify-center items-center transition hover:border-neutral-300"
          aria-label={isFavorite ? `Remove ${itemType} from favorites` : `Add ${itemType} to favorites`}
          disabled={loading}
        >
          {!loading && <Icon className="text-white" size={25} />}
        </button>
      </div>
    </>
  );
};

export default FavoriteButton;


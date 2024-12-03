import React, { useState } from "react";
import { BsFillPlayFill } from "react-icons/bs";
import FavoriteButton from "./FavoriteButton";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import OpenModal from "./OpenModal";
import { BiChevronDown } from "react-icons/bi";

interface MovieCardProps {
  data: {
    id: number;
    thumbnailUrl: string;
    videoUrl: string;
    title: string;
    description: string;
    duration?: string;
    genre?: string;
    movieid: string;
    seriesid: string;
  };
  isFavorite: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ data }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Determine the type (movie or series) based on the presence of `movieid` or `seriesid`
  const watchUrl = data.movieid
    ? `/movies/${data.movieid}`
    : data.seriesid
      ? `/series/${data.seriesid}`
      : "/";

  const handleModalOpen = () => {
    console.log("Opening Modal");
    setIsOpen(true); // Toggle modal visibility
  };

  const handleModalClose = () => {
    console.log("Closing Modal");
    setIsOpen(false); // Close the modal
  };

  return (
    <div className="group bg-zinc-900 col-span relative h-[12vw]">
      {/* ThumbnailUrl image on the card */}
      <img
        className="pointer-cursor object-cover transition duration shadow-xl rounded-md delay-300 w-full h-[12vw]
                group-hover:opacity-90 sm:group-hover:opacity-0"
        src={data.thumbnailUrl}
        alt="ThumbnailUrl"
      />
      {/* Title of the movie */}
      <div className="w-full text-white lg:text-lg md:text-md sm:text-sm md:font-semibold mt-4 pl-1">
        {data.title}
      </div>

      {/* Hover state */}
      <div
        className="opacity-0 absolute top-0 transition duration-200 z-10 invisible sm:visible delay-300 w-full scale-0 group-hover:scale-110 group-hover:-translate-y-[6vw] group-hover:translate-x-[2vw] group-hover:opacity-100">
        <img
          className="cursor-pointer object-cover transition duration shadow-xl rounded-t-md w-full h-[12vw]"
          src={data.thumbnailUrl}
          alt="ThumbnailUrl"
        />
        <div className="z-10 bg-zinc-800 p-2 lg:p-4 absolute w-full transition shadow-md rounded-b-md">
          <div className="mb-2 lg:text-lg md:text-sm text-white italic">
            {data.title}
          </div>
          <div className="flex flex-row items-center gap-3">
            <div
              className="cursor-pointer w-6 h-6 lg:h-10 lg:w-10 bg-white rounded-full flex items-center justify-center transition hover:bg-neutral-300"
              onClick={() => router.push(watchUrl)}>
              <BsFillPlayFill size={30} />
            </div>
            <FavoriteButton movieid={data.movieid || data.seriesid} />
            <div
              onClick={handleModalOpen}
              className="cursor-pointer ml-auto group/item w-6 h-6 lg:w-10 lg:h-10 border-white border-2 rounded-full flex justify-center items-center transition hover:border-neutral-300">
              <BiChevronDown className="text-white group-hover/item:text-neutral-300" size={30}/>
            </div>
          </div>

          <ToastContainer />
          <p className="text-green-400 font-semibold mt-4">
            New <span className="text-white">2023</span>
          </p>
          <p className="text-white text-[10px] lg:text-sm">{data.duration}</p>
          <p className="text-slate-300 text-[10px] lg:text-sm">{data.genre}</p>
        </div>
      </div>

      {/* Modal */}
      <OpenModal data={data} visible={isOpen} onClose={handleModalClose} />
    </div>
  );
};

export default MovieCard;

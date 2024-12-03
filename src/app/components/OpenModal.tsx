import React, { useCallback } from "react";
import { AiOutlineClose } from "react-icons/ai";
import PlayButton from "./PlayButton";
import FavoriteButton from "./FavoriteButton";

interface OpenModalProps {
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
  visible: boolean;
  onClose: () => void;
}

const OpenModal: React.FC<OpenModalProps> = ({ data, visible, onClose }) => {
  // Don't render if not visible
  if (!visible) {
    return null;
  }

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <div className="z-50 transition duration-300 bg-black bg-opacity-80 flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0">
      <div className="relative w-auto max-w-3xl mx-auto rounded-md overflow-hidden">
        <div className="transform scale-100 duration-300 relative flex-auto bg-zinc-900 drop-shadow-md">
          <div className="relative h-96">
            <video
              className="w-full brightness-[60%] object-cover h-full"
              autoPlay
              muted
              loop
              poster={data?.thumbnailUrl}
              src={data?.videoUrl}></video>
            <div
              className="absolute top-3 right-3 h-10 w-10 bg-black bg-opacity-70 rounded-full cursor-pointer flex items-center justify-center"
              onClick={handleClose}>
              <AiOutlineClose className="text-white" size={20} />
            </div>
            <div className="absolute bottom-10 left-10">
              <p className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                {data?.title}
              </p>
              <div className="flex flex-row gap-4 items-center">
                <PlayButton movieid={data.movieid || data.seriesid} />
                <FavoriteButton movieid={data.movieid || data.seriesid} />
              </div>
            </div>
          </div>
          <div className="px-12 py-8">
            <p className="text-green-400 font-semibold text-lg">New</p>
            <p className="text-gray-300 text-lg">{data?.duration}</p>
            <p className="text-gray-300 text-lg">{data?.genre}</p>
            <p className="text-white text-lg">{data?.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenModal;


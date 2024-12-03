import { useRouter } from "next/navigation";
import { BsFillPlayFill  } from "react-icons/bs";

interface PlayButtonProps {
    movieid: string;
}

const PlayButton:React.FC<PlayButtonProps> = ({movieid}) => {

    const router = useRouter();
    
    return (
        <button
            onClick={() => router.push(`/watch/${movieid}`)}
            className="bg-white rounded-md py-1 md:py-2 px-2 md:px-4 w-auto text-xs lg:text-lg font-semibold flex flex-row items-center hover:bg-neutral-300 transition">
            <BsFillPlayFill size={25} className="mr-1"/> 
            PLAY
        </button>
    )
};

export default PlayButton;
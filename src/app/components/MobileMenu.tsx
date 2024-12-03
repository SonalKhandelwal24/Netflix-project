import Link from "next/link";
import { RiArrowDropDownFill  } from "react-icons/ri";

interface MobileMenuProps {
    visible?: boolean;
    showLanguageDropdown: boolean;
    toggleLanguageDropdown: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ visible, showLanguageDropdown, toggleLanguageDropdown}) => {

    if (!visible) {
        return null;
    }

    return (
        <div className="bg-black w-56 flex flex-col absolute top-8 left-0 py-5 border-2 border-gray-800 ">
            <div className="flex flex-col gap-4">
                <Link href={'/'} className="text-white px-3 text-center hover:underline">Home</Link>
                <Link href={'/series'} className="text-white px-3 text-center hover:underline">Series</Link>
                <Link href={'/films'} className="text-white px-3 text-center hover:underline">Films</Link>
                <Link href={'/new-popular'} className="text-white px-3 text-center hover:underline">New & Polular</Link>
                <Link href={'/my-list'} className="text-white px-3 text-center hover:underline">My List</Link>
                  {/* Browse by Languages Dropdown */}
                <div className="relative">
                    <div onClick={toggleLanguageDropdown}
                        className="flex flex-row items-center justify-between gap-2 px-3 cursor-pointer hover:underline">
                        <p className="text-white">Browse by Languages</p>
                        <RiArrowDropDownFill className={`text-white transition-transform ${showLanguageDropdown ? "rotate-180" : "rotate-0"}`} />
                    </div>
                    {showLanguageDropdown && (
                        <div className="absolute right-0 mt-2 bg-gray-600 rounded shadow-lg w-40 z-50">
                            <Link href={"/browse-by-language/hindi"}
                                className="block px-4 py-2 text-white hover:bg-gray-700 transition">
                                Hindi
                            </Link>

                            <Link href={"/browse-by-language/english"}
                                className="block px-4 py-2 text-white hover:bg-gray-700 transition">
                                English
                            </Link>

                        </div>
                    )}
                </div>
            </div>

        </div>

    )
}

export default MobileMenu;

import { useState, useCallback, useEffect } from "react";
import { BsChevronDown, BsSearch, BsBell } from "react-icons/bs";

import MobileMenu from "./MobileMenu";
import NavbarItem from "./NavbarItem";
import AccountMenu from "./AccountMenu";
import Link from "next/link";

const Navbar = () => {

    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showAccountMenu, setshowAccountMenu] = useState(false);
    const [showBackground, setShowBackground] = useState(false);
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false); // For dropdown

    const TOP_OFFSET = 66;

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY >= TOP_OFFSET) {
                setShowBackground(true);
            } else {
                setShowBackground(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const toggleMobileMenu = useCallback(() => {
        setShowMobileMenu((current) => !current);
    }, []);

    const toggleAccountMenu = useCallback(() => {
        setshowAccountMenu((current) => !current);
    }, []);

    const toggleLanguageDropdown = useCallback(() => {
        setShowLanguageDropdown((current) => !current);
    }, []);


    return (
        <nav className="w-full fixed z-40">
            <div className={`px-4 md:px-16 py-6 flex flex-row items-center transition duration-500 ${showBackground ? 'bg-zinc-900 bg-opacity-90' : ''}`}>

                {/* Netflix Logo */}
                <img className="h-8 lg:h-12" src="/Images/Logo.png" alt="Logo" />

                {/* Menu on Large screen */}
                <div className="lg:flex flex-row gap-7 hidden ml-8">
                    <NavbarItem label="Home" href='/' />
                    <NavbarItem label="Series" href='/series' />
                    <NavbarItem label="Movies" href='/movies' />
                    <NavbarItem label="New & Polular" href='/new-popular' />
                    <NavbarItem label="My List" href='/my-list' />
                    {/* Browse by Languages */}
                    <div className="relative">
                        <div onClick={toggleLanguageDropdown} className="flex flex-row items-center gap-2 cursor-pointer">
                            <p className="text-white">Browse by languages</p>
                            <BsChevronDown className={`text-white transition ${showLanguageDropdown ? "rotate-180" : "rotate-0"}`}/>
                        </div>
                        {showLanguageDropdown && (
                            <div className="absolute top-8 left-0 bg-zinc-800 rounded shadow-lg w-40 text-sm">
                                <Link href="/browse-by-language/hindi" className="block px-4 py-2 text-white hover:bg-zinc-700 transition">
                                    Hindi
                                </Link>
                                <Link href="/browse-by-language/english" className="block px-4 py-2 text-white hover:bg-zinc-700 transition">
                                    English
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Menu on Mobile screen */}
                <div onClick={toggleMobileMenu} className="lg:hidden flex flex-row items-center gap-2 ml-8 cursor-pointer relative">
                    <p className="text-white text-sm">Browser</p>
                    <BsChevronDown className={`text-white transition ${showMobileMenu ? 'rotate-180' : 'rotate-0'}`} />
                    <MobileMenu visible={showMobileMenu}  showLanguageDropdown={showLanguageDropdown} toggleLanguageDropdown={toggleLanguageDropdown} />
                </div>

                {/* Account details */}
                <div className="flex flex-row ml-auto gap-7 items-center">
                    <div className="text-gray-200 hover:text-gray-300 cursor-pointer transition">
                        <BsSearch />
                    </div>
                    <div className="text-gray-200 hover:text-gray-300 cursor-pointer transition">
                        <BsBell />
                    </div>

                    <div onClick={toggleAccountMenu} className="flex flex-row items-center gap-2 cursor-pointer relative">
                        <div className="w-6 h-6 lg:w-10 lg:h-10 rounded-md overflow-hidden">
                            <img src="/Images/user1.png" alt="User" />
                        </div>
                        <BsChevronDown className={`text-white ${showAccountMenu ? 'rotate-180' : 'rotate-0'}`} />
                        {showAccountMenu && <AccountMenu />}
                    </div>
                </div>

            </div>
        </nav>
    )
};

export default Navbar;



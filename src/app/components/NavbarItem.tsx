import Link from "next/dist/client/link";
import React from "react";

interface NavbarItemProps {
    label: string;
    href: string;
}

const NavbarItem: React.FC<NavbarItemProps> = ({label, href}) => {
  
  return(
    <div className="text-white cursor-pointer hover:text-gray-300 transition">
      <Link href={href}  className="text-white hover:text-gray-300 transition">
      {label}
      </Link>
    </div>
  )
};

export default NavbarItem;

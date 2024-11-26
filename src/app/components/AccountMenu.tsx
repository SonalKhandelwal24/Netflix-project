import { jwtDecode } from "jwt-decode"; // Fix import (remove curly braces)
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Cookies from 'js-cookie';

interface AccountMenuProps {
    visible?: boolean;
}

const AccountMenu = () => {
    // if (!visible) {
    //     return null;
    // }

    const router = useRouter();
    const [email, setEmail] = useState<string | null>(null); // Ensure `email` can be null
    const expiredToast = () =>
        toast.error("Session expired. Please log in again.", {
            autoClose: 5000,
            closeOnClick: true,
            pauseOnHover: true,
        });

    useEffect(() => {
        const token = localStorage.getItem("authtoken");
        if (token) {
            try {
                // Explicitly type the decoded token
                const decodedToken = jwtDecode<{ email: string; exp: number }>(token);

                const currentTime = Math.floor(Date.now() / 1000);
                if (decodedToken.exp && decodedToken.exp < currentTime) {
                    expiredToast();
                    localStorage.removeItem("authtoken");
                    router.push("/login");
                } else {
                    setEmail(decodedToken.email);
                }
            } catch (error) {
                toast.error("Invalid session. Redirecting to login.");
                localStorage.removeItem("authtoken"); // Ensure token is cleared
                router.push("/login");
            }
        } else {
            router.push("/login");
        }
    }, []);

    const signOut = async () => {
        try {
            const response = await fetch('http://192.168.1.50:3000/api/logout', {
                method: "POST"
            });
            const data = await response.json();
            if(data.success) {
                console.log(data.message)
                toast.success("You have been logged out successfully.", { autoClose: 2000 });
                router.push("/login");
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="bg-black w-56 absolute top-14 right-0 py-5 flex flex-col border-2 border-gray-800">
            <ToastContainer />
            <div className="flex flex-col gap-3">
                <div className="px-3 group/item flex flex-row gap-3 items-center w-full">
                    <img className="w-8 rounded-md" src="/Images/user1.png" alt="User" />
                    <p className="text-white text-sm group-hover/item:underline">
                        {email || "Guest"}
                    </p>
                </div>

                <hr className="bg-gray-600 border-0 my-4 h-px" />

                <div onClick={signOut} className="text-white text-center px-3 text-sm hover:underline" >
                    Sign out of Netflix
                </div>
            </div>
        </div>
    );
};

export default AccountMenu;

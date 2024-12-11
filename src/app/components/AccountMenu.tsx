import { jwtDecode } from "jwt-decode"; // Fix import (remove curly braces)
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

const AccountMenu = () => {
    
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
                console.log('Error occurred', error);
                toast.error("Invalid session. Redirecting to login.");
                localStorage.removeItem("authtoken"); 
                router.push("/login");
            }
        } else {
            router.push("/login");
        }
    }, [router]);

    const signOut = async () => {
        try {
            const response = await fetch(`${process.env.BASE_URL}/api/logout`, {
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
                    <Image className="w-8 rounded-md" src="/Images/user1.png" alt="User" width={24} height={24}  />
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

"use client"
import { useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode";
import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function page() {
    
    const router = useRouter();
    const [email, setEmail] = useState('');

    const expiredToast = () => toast.error("Session expired. Please log in again.", { autoClose: 5000, closeOnClick: true, pauseOnHover: true });

    useEffect(() => {
        const token = localStorage.getItem('authtoken');
        if(token) {
            try {
                const decodedToken : {email : string, exp: number} = jwtDecode(token);
                const currentTime = Math.floor(Date.now() / 1000);
                if(decodedToken && decodedToken.exp < currentTime) {
                    expiredToast();
                    localStorage.getItem("authtoken");   
                    router.push('/login');
                } else {
                    setEmail(decodedToken.email);
                }
            } catch (error) {
                console.error("Invalid token:", error);
                router.push('/login');
            }
        } else {
            router.push('/login');
        }
    }, [router])
    
    return(
        <div className="relative h-full w-full bg-[url('/Images/profile.png')] bg-no-repeat bg-center bg-fixed bg-cover">
        <div className="flex justify-center items-center h-full bg-black bg-opacity-70">
            <div className="flex flex-col">
                <h1 className="text-white text-3xl md:text-6xl text-center">Who is watching?</h1>
                <div className="flex text-center justify-center gap-8 mt-10">
                {/* User 1 */}
                    <div className="group w-44 mx-auto" onClick={() => router.push('/')}>
                        <div className="w-44 h-44 rounded-md border-2 border-transparent group-hover:cursor-pointer group-hover:border-white overflow-hidden">
                            <img src="/Images/user1.png" alt="User Profile" />
                        </div>                        
                        <div className="mt-4 text-white md:text-2xl text-xl text-center group-hover:text-gray-400">{email}</div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
    
};

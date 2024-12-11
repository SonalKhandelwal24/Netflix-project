"use client"
import React, { Suspense, SetStateAction, useState } from "react";
import Input from "../components/Input";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";

export default function ResetPassword() {

    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmpassword] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams?.get('token');

    const resetToast = () => toast.success("Saved password successfully", {autoClose: 5000, closeOnClick: true, pauseOnHover: true });
    const warningToast = () => toast.warning("Error to save password", {autoClose: 5000, closeOnClick: true, pauseOnHover: true });
    const alertToast = () => toast.warning("Password do not match", {autoClose: 5000, closeOnClick: true, pauseOnHover: true });

    const handlePasswordReset = async () => 
        {
        if(password !== confirmpassword) {
            alertToast();
            return;
        }
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({token, password})
        });

        const data = await response.json();
        if (data.success) {
            resetToast();
            router.push('/login');
        } else {
            warningToast();
            console.log("Error:", data.message);
        }
    }

    return (
        <>
        <ToastContainer position="top-right" />
        <div className="relative h-full w-full bg-[url('/Images/Image.png')] bg-no-repeat bg-center bg-fixed bg-cover">
            <div className="bg-black w-full h-full lg:bg-opacity-50 md:bg-opacity-50 sm:bg-opacity-50">
                <nav className="px-16 py-5 lg:ml-40">
                    <Image src="/Images/Logo.png" alt="Logo" className="h-20" width={180} height={80}  />
                </nav>
                <div className="flex justify-center">
                    <div className="bg-black bg-opacity-80 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md md:w-3/5 rounded-md w-full">
                        <h2 className="text-white text-4xl mb-8 font-semibold"> Reset Password </h2>
                        <div className="flex flex-col gap-4">
                            <Input
                                label="New Password"
                                onChange={(e: { target: { value: SetStateAction<string>; }; }) => setPassword(e.target.value)}
                                id="password"
                                type="password"
                                value={password} />
                            <Input
                                label="Confirm New Password"
                                onChange={(e: { target: { value: SetStateAction<string>; }; }) => setConfirmpassword(e.target.value)}
                                id="confirmpassword"
                                type="password"
                                value={confirmpassword} />
                        </div>
                        <button onClick={handlePasswordReset} className="bg-red-600 py-3 text-white rounded-md w-full mt-6 hover:bg-red-700 transition">
                            Save Reset Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
}



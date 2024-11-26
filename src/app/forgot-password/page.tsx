"use client"
import { SetStateAction, useState } from "react";
import Input from "../components/Input";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ForgotPassword() {

    const [email, setEmail] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const resetLink = searchParams.get('token');

    const sendEmailToast = () => toast.success("Send link to email Successfully", { autoClose: 5000, closeOnClick: true, pauseOnHover: true });
    const errorEmailToast = () => toast.error("Error in send link to email", { autoClose: 5000, closeOnClick: true, pauseOnHover: true });

    const handleResetRequest = async () => {

        let response = await fetch('http://192.168.1.50:3000/api/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });

        let data = await response.json();
        if (data.success) {
            sendEmailToast();
            console.log("Reset link:", data.resetLink);
            router.push(`/send-email-link?${data.resetLink}`);
        } else {
            errorEmailToast();
            console.error(`Error:, ${data.message}`);
        }
    }

    return (
        <>
            <ToastContainer position="top-right" />
            <div className="relative h-full w-full bg-[url('/Images/Image.png')] bg-no-repeat bg-center bg-fixed bg-cover">
                <div className="bg-black w-full h-full lg:bg-opacity-50 md:bg-opacity-50 sm:bg-opacity-50">
                    <nav className="px-16 py-5 lg:ml-40">
                        <img src="/Images/Logo.png" alt="Logo" className="h-20" />
                    </nav>
                    <div className="flex justify-center">
                        <div className="bg-black bg-opacity-80 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md md:w-3/5 rounded-md w-full">
                            <h2 className="text-white text-4xl mb-8 font-semibold"> Reset Password Link </h2>
                            <div className="flex flex-col gap-4">
                                <Input
                                    label="Email"
                                    onChange={(e: { target: { value: SetStateAction<string>; }; }) => setEmail(e.target.value)}
                                    id="email"
                                    type="email"
                                    value={email} />
                            </div>
                            <button onClick={handleResetRequest} className="bg-red-600 py-3 text-white rounded-md w-full mt-6 hover:bg-red-700 transition">
                                Send Email Link
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}



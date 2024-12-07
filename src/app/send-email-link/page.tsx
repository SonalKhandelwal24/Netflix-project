"use client"

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

export default function SendEmailLink() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const resetLink = searchParams.get('token');

    return (
        <div className="relative h-full w-full bg-[url('/Images/Image.png')] bg-no-repeat bg-center bg-fixed bg-cover">
            <div className="bg-black w-full h-full lg:bg-opacity-50 md:bg-opacity-50 sm:bg-opacity-50">
                <nav className="px-16 py-5 lg:ml-40">
                    <Image src="/Images/Logo.png" alt="Logo" className="h-20"  width={180} height={80} />
                </nav>
                <div className="flex justify-center">
                    <div className="bg-black bg-opacity-80 px-16 py-16 self-center lg:w-2/5 lg:max-w-md md:w-3/5 rounded-md w-full">
                        <button onClick={() => { router.push(`/reset-password?token=${resetLink}`) }} className="bg-red-600 py-3 text-white rounded-md w-full mt-6 hover:bg-red-700 transition">
                            Click here to Reset Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

}



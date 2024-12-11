"use client"
import { SetStateAction, useCallback, useState } from "react";
import Input from "../components/Input";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";

export default function Login() {

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [variant, setVariant] = useState('login');
    const router = useRouter();
console.log(process.env.BASE_URL);
    const toggleVariant = useCallback(() => {
        setVariant((currenrtVariant) => currenrtVariant === 'login' ? 'register' : 'login');
    }, [])

    const registerToast = () => toast.success("User registered successfully", { autoClose: 5000, closeOnClick: true, pauseOnHover: true });
    const loginToast = () => toast.success("User logged in successfully", { autoClose: 5000, closeOnClick: true, pauseOnHover: true });
    const unsuccessful = () => toast.error("Wrong Email and Pasword", { autoClose: 5000, closeOnClick: true, pauseOnHover: true });

    const addUsers = async () => {
        // const endpoint = `${process.env.BASE_URL}${variant === 'login' ? '/api/login' : '/api/register'}`;
        const endpoint = `/api/login`;
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        console.log(data);
        if (data.success) {
            setUsername('');
            setEmail('');
            setPassword('');
            router.push('/profiles')
            if (variant === 'login') {
                loginToast();
                localStorage.setItem('authtoken', data.token);
                router.push('/profiles');
            } else {
                registerToast();
                localStorage.setItem('authtoken', data.token);
                router.push('/profiles');
            }
        } else {
            unsuccessful();
            console.log("Error:", data.message);
        }
    }

    return (
        <>
            <ToastContainer position="top-right" />
            <div className="relative h-full w-full bg-[url('/Images/Image.png')] bg-no-repeat bg-center bg-fixed bg-cover">
                <div className="bg-black w-full h-full lg:bg-opacity-50 md:bg-opacity-50 sm:bg-opacity-50">
                    <nav className="px-16 py-5 lg:ml-40">
                        <Image src="/Images/Logo.png" alt="Logo" className="h-20" width={180} height={80} />
                    </nav>
                    <div className="flex justify-center">
                        <div className="bg-black bg-opacity-80 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md md:w-3/5 rounded-md w-full">
                            <h2 className="text-white text-4xl mb-8 font-semibold">
                                {variant === 'login' ? 'Login' : 'Register'}
                            </h2>
                            <div className="flex flex-col gap-5">
                                {variant === 'register' && (
                                    <Input
                                        label="Username"
                                        onChange={(e: { target: { value: SetStateAction<string>; }; }) => setUsername(e.target.value)}
                                        id="name"
                                        type="text"
                                        value={username} />
                                )}
                                <Input
                                    label="Email"
                                    onChange={(e: { target: { value: SetStateAction<string>; }; }) => setEmail(e.target.value)}
                                    id="email"
                                    type="email"
                                    value={email} />
                                <Input
                                    label="Password"
                                    onChange={(e: { target: { value: SetStateAction<string>; }; }) => setPassword(e.target.value)}
                                    id="password"
                                    type="password"
                                    value={password} />
                                {variant === 'login' && (
                                    <span className="text-white text-right hover:underline cursor-pointer" onClick={() => router.push('/forgot-password')}>Forgot Password</span>
                                )}
                            </div>
                            <button onClick={addUsers} className="bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition">
                                {variant == 'login' ? 'Login' : 'Register'}
                            </button>
                            <p className="text-neutral-500 mt-12">
                                {variant === 'login' ? 'New to Netflix?' : 'Already have an account?'}
                                <span onClick={toggleVariant} className="text-white ml-1 hover:underline cursor-pointer">
                                    {variant === 'login' ? 'Create an Account' : 'Login'}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}



"use client"
import "../../../styles/globals.css"
import Navbar from "@/components/navbar";
import { useContext, useState } from "react";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { warn, notify } from "@/app/layout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/components/auth/AuthContext";
import { baseApiUrl } from "@/apis";

export default function AdminLoginPage() {

    const [ error, setError ] = useState('')
    const [ response, setResponse ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const router = useRouter();
    const { adminLogin } = useContext(AuthContext);
    const [ loginForm, setLoginForm ] = useState({
        username: "",
        password: "",
    });

    const handleChange = (event) => {
        setError('');
        setResponse('');
        const { name, value } = event.target;
        setLoginForm((prevState) => {
            return {
            ...prevState,
            [name]: value,
            };
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true)
        setResponse('')
        setError('')
        
        try {
            const res = await axios.post(`${baseApiUrl}/auth/admin-login`, loginForm, {
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            if (res.data.user) {
                setResponse("Login successful! You're being redirected.")
                adminLogin(res.data.access_token, res.data.user, res.data.user.id)
                router.push("/admin/dashboard");
            }
            else {
                setResponse(res.data.message);
            }
            setLoading(false);
        } catch (err) {
            setError(err.response.data.detail);
            setLoading(false);
        }
    };

    if (error) {
		warn(`${error}`);
	}

	if (response) {
		notify(`${response}`)
	}


    return (
        <>
            <Navbar />
            <div className="md:w-[500px] px-7 md:px-0 mx-auto pb-20 md:pb-0 my-16 font-poppins">
                <div className="pb-20">
                    <p className=" font-bold text-[40px]">Welcome Back Admin.</p>
                    <p>Enter your details to access your account.</p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col text-[16px]">

                    <label htmlFor="email">Email Address</label>
                    <input type="text" value={loginForm.username} onChange={handleChange} name="username" className=" border border-gray-300 rounded-md mb-2 p-2" required/>

                    <label htmlFor="password">Password</label>
                    <input type="password" value={loginForm.password} onChange={handleChange} name="password" className=" border border-gray-300 rounded-md mb-2 p-2" required/>

                    <button className="bg-[#145DA0] p-3 text-white rounded-md my-3 disabled:bg-[#2696ff]" disabled={loading} >{loading ? 'Loading...' : 'Login'}</button>
                </form>
                <p className="text-[16px] py-2">Don&apos;t have an account? <Link href="/auth/signup" className="text-blue-700 hover:underline">Signup</Link></p>
            </div>
            <ToastContainer />
        </>
    )
}
import {React, useState} from "react";
import Link from "next/link";
import { warn, notify } from "@/app/layout";
import { ToastContainer } from "react-toastify";
import axios from "axios";

export default function LoginForm() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [response, setResponse] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEmailChange = (e) => {
        setResponse('');
        setError('');
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setResponse('');
        setError('');
        setPassword(e.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true)
        setResponse('')
        setError('')
        
        const formData = {
            username: email,
            password: password
        }

        try {
            const res = await axios.post('http://localhost:8000/auth/login', formData, {
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            if (res.data.user) {
                setResponse("Login successful! You're being redirected.")
                const userId = res.data.user.id;
                const accessToken = res.data.access_token;
                console.log(userId, accessToken);
            }
            else {
                setResponse(res.data.message);
            }
            setLoading(false);
            console.log(res.data.message)
        } catch (err) {
            setError(err.response.data.detail);
            console.log(err.response.data.detail);
            setLoading(false);
        }
    };

    if (error) {
		warn(`${error}`);
	}

	// display success message component
	if (response) {
		notify(`${response}`)
	}

    return(
        <>
            <div className="w-[500px] mx-auto">
                <div className="pb-20">
                    <p className=" font-bold text-[40px]">Welcome Back</p>
                    <p>Enter your details to access your account.</p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col text-[16px]">

                    <label htmlFor="email">Email Address</label>
                    <input type="text" value={email} onChange={handleEmailChange} className=" border border-gray-300 rounded-md mb-2 p-2" required/>

                    <label htmlFor="password">Password</label>
                    <input type="password" value={password} onChange={handlePasswordChange} className=" border border-gray-300 rounded-md mb-2 p-2" required/>

                    <button className="bg-[#145DA0] p-3 text-white rounded-md my-3">{loading ? 'Loading...' : 'Login'}</button>
                </form>
                <p className="text-[16px] py-2">Don't have an account? <Link href="/auth/signup" className="text-blue-700 hover:underline">Signup</Link></p>
            </div>
            <ToastContainer />
        </>
    )
}
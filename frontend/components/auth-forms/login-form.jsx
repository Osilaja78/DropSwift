import {React, useState, useContext} from "react";
import Link from "next/link";
import { warn, notify } from "@/app/layout";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { AuthContext } from "../auth/AuthContext";

export default function LoginForm() {

    const [response, setResponse] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, user, accessToken, isLoggedIn } = useContext(AuthContext);

    const router = useRouter();

    const [loginForm, setLoginForm] = useState({
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
            const res = await axios.post('http://localhost:8000/auth/login', loginForm, {
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            if (res.data.user) {
                setResponse("Login successful! You're being redirected.")
                login(res.data.access_token, res.data.user, res.data.user.id)
                router.push("/dashboard");
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

    // handle google sign in
    const handleGoogleSignIn = async (tokenResponse) => {
        setLoading(true)
        setResponse(null)
        setError('')

        try {
            const res = await axios.post(`http://localhost:8000/auth/google-login?token=${tokenResponse.credential}`, {
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            if (res.data.user) {
                setResponse("Login successful! You're being redirected.");
                console.log(res.data);
                login(res.data.access_token, res.data.user, res.data.user.id);
                router.push("/dashboard");
            }
            else {
                setResponse(res.data.message);
            }
            setLoading(false);
        } catch (err) {
            console.log(err.response.data.detail);
            setError(err.response.data.detail);
            setLoading(false);
        }
    }

    const handleGoogleSignInError = (err) => {
        setLoading(false);
        console.log(err);
        setError("Something went wrong! Please try again.")
    };
    
    if (error) {
		warn(`${error}`);
	}

	if (response) {
		notify(`${response}`)
	}


    return(
        <>
            <div className="md:w-[500px] px-7 md:px-0 mx-auto pb-20 md:pb-0">
                <div className="pb-20">
                    <p className=" font-bold text-[40px]">Welcome Back</p>
                    <p>Enter your details to access your account.</p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col text-[16px]">

                    <label htmlFor="email">Email Address</label>
                    <input type="text" value={loginForm.username} onChange={handleChange} name="username" className=" border border-gray-300 rounded-md mb-2 p-2" required/>

                    <label htmlFor="password">Password</label>
                    <input type="password" value={loginForm.password} onChange={handleChange} name="password" className=" border border-gray-300 rounded-md mb-2 p-2" required/>

                    <button className="bg-[#145DA0] p-3 text-white rounded-md my-3">{loading ? 'Loading...' : 'Login'}</button>
                </form>
                <p className="text-[16px] py-2">Don&apos;t have an account? <Link href="/auth/signup" className="text-blue-700 hover:underline">Signup</Link></p>
                <p className="text-center my-5">OR</p>
                <GoogleLogin onSuccess={handleGoogleSignIn} onError={handleGoogleSignInError}/>
            </div>
            <ToastContainer />
        </>
    )
}
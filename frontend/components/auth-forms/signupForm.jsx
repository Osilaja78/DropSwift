import React from "react";
import Link from "next/link";
import { useState } from "react";
// import { notify, warn } from "@/app/layout";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { GoogleLogin } from "@react-oauth/google";

export default function SignupForm() {

    const [response, setResponse] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [googleUserToken, setGoogleUserToken] = useState(null)

    const [signupForm, setSignupForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm_password: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setSignupForm((prevState) => {
            return {
            ...prevState,
            [name]: value,
            };
        });
    };

    const toastParams = {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
    };

    const warn = (val) => toast.error(`${val}`, toastParams);
    const notify = (val) => toast.success(`${val}`, toastParams);

    // main action for signup form
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true)
        setResponse(null)
        setError('')
        
        const formData = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
            confirm_password: confirmPassword
        }

        try {
            const res = await axios.post('http://localhost:8000/user', signupForm);
            setResponse(res.data.message);
            setLoading(false);
            console.log(res.data.message)
            } catch (err) {
                setError(err.response.data.detail);
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

    // handle google signup
    const handleGoogleSignIn = async (tokenResponse) => {
        setLoading(true)
        setResponse(null)
        setError('')
        setGoogleUserToken(tokenResponse);

        try {
            const res = await axios.post(`http://localhost:8000/auth/google-login?token=${tokenResponse.credential}`, {
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            if (res.data.user) {
                setResponse("Signup successful! You're being redirected.")
                const userId = res.data.user.id;
                const accessToken = res.data.access_token;
                console.log(userId, accessToken);
            }
            else {
                setResponse(res.data.message);
            }
            setLoading(false);
            console.log(res)
        } catch (err) {
            setError(err.response.data.detail);
            setLoading(false);
        }
    }

    const handleGoogleSignInError = (err) => {
        setLoading(false);
        console.log(err);
      };  

    return(
        <>
            <div className="w-[500px] mx-auto">
                <div className="pb-16">
                    <p className=" font-bold text-[40px]">Get Started</p>
                    <p>Get ready for a whole new shopping experience.</p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col text-[16px]">
                    <label htmlFor="fname">First Name</label>
                    <input type="text" value={signupForm.firstName} onChange={handleChange} name="first_name" className="border border-gray-300 rounded-md mb-2 p-2" required/>

                    <label htmlFor="lname">Last Name</label>
                    <input type="text" value={signupForm.lastName} onChange={handleChange} name="last_name" className="border border-gray-300 rounded-md mb-2 p-2" required/>

                    <label htmlFor="email">Email Address</label>
                    <input type="text" value={signupForm.email} onChange={handleChange} name="email" className="border border-gray-300 rounded-md mb-2 p-2" required/>

                    <label htmlFor="password">Password</label>
                    <input type="password" value={signupForm.password} onChange={handleChange} name="password" className="border border-gray-300 rounded-md mb-2 p-2" required/>

                    <label htmlFor="password">Confirm Password</label>
                    <input type="password" value={signupForm.confirmPassword} onChange={handleChange} name="confirm_password" className="border border-gray-300 rounded-md mb-2 p-2" required/>

                    <div className="flex items-center gap-4 pl-2 py-2">
                        <input type="checkbox" id="policy" name="policy" value="Policy" />
                        <label htmlFor="policy"> I agree to the Terms and Policy.</label>
                    </div>
                    <button className="bg-[#145DA0] p-3 text-white rounded-md">{loading ? 'Loading...' : 'Signup'}</button>
                </form>
                <p className="text-[16px] py-2">Already have an account? <Link href="/auth/signin" className="text-blue-700 hover:underline">Login</Link></p>
                <p className="text-center my-5">OR</p>
                <GoogleLogin onSuccess={handleGoogleSignIn} onError={handleGoogleSignInError}/>
            </div>
            <ToastContainer />

        </>
    )
}
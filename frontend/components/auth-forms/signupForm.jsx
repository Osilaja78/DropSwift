import React from "react";
import Link from "next/link";
import { useState } from "react";
// import { notify, warn } from "@/app/layout";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function SignupForm() {

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [response, setResponse] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleFirstNameChange = (e) => {
        setError('');
        setResponse('');
        setFirstName(e.target.value);
    }

    const handleLastNameChange = (e) => {
        setError('');
        setResponse('');
        setLastName(e.target.value);
    }

    const handleEamilChange = (e) => {
        setError('');
        setResponse('');
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setError('');
        setResponse('');
        setPassword(e.target.value);
    }

    const handleConfrimPasswordChange = (e) => {
        setError('');
        setResponse('');
        setConfirmPassword(e.target.value);
    }

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
            const res = await axios.post('http://localhost:8000/user', formData);
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


    return(
        <>
            <div className="w-[500px] mx-auto">
                <div className="pb-16">
                    <p className=" font-bold text-[40px]">Get Started</p>
                    <p>Get ready for a whole new shopping experience.</p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col text-[16px]">
                    <label htmlFor="fname">First Name</label>
                    <input type="text" value={firstName} onChange={handleFirstNameChange} className="border border-gray-300 rounded-md mb-2 p-2" required/>

                    <label htmlFor="lname">Last Name</label>
                    <input type="text" value={lastName} onChange={handleLastNameChange} className="border border-gray-300 rounded-md mb-2 p-2" required/>

                    <label htmlFor="email">Email Address</label>
                    <input type="text" value={email} onChange={handleEamilChange} className="border border-gray-300 rounded-md mb-2 p-2" required/>

                    <label htmlFor="password">Password</label>
                    <input type="password" value={password} onChange={handlePasswordChange} className="border border-gray-300 rounded-md mb-2 p-2" required/>

                    <label htmlFor="password">Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={handleConfrimPasswordChange} className="border border-gray-300 rounded-md mb-2 p-2" required/>

                    <div className="flex items-center gap-4 pl-2 py-2">
                        <input type="checkbox" id="policy" name="policy" value="Policy" />
                        <label htmlFor="policy"> I agree to the Terms and Policy.</label>
                    </div>
                    <button className="bg-[#145DA0] p-3 text-white rounded-md">{loading ? 'Loading...' : 'Signup'}</button>
                </form>
                <p className="text-[16px] py-2">Already have an account? <Link href="/auth/login" className="text-blue-700 hover:underline">Login</Link></p>
            </div>
            <ToastContainer />
        </>
    )
}
"use client"
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { warn, notify } from "@/app/layout";
import "../../../styles/globals.css";
import { baseApiUrl } from "@/apis";

export default function VerifyToken() {

    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token')
    
    useEffect(() => {
        const verifyToken = async (e) => {
            setLoading(true)

            try {
                const res = await axios.get(`${baseApiUrl}/auth/verify-token?token=${token}`);
                setResponse(res.data.message);
                setLoading(false);
                setTimeout(() => {
                    router.push("/auth/signin")
                }, 2000);
            } catch (err) {
                setError(err.response.data.detail);
                setLoading(false);
            }
        }
        verifyToken();
    }, []);

    if (error) {
		warn(`${error}`);
	}

	if (response) {
		notify(`${response}`)
	}

    return (
        <>
            <section className="h-[100vh]">
                {loading ? <p className="text-[50px] text-center">Loading...</p> : ''}
                <ToastContainer />
            </section>
        </>
    )
}
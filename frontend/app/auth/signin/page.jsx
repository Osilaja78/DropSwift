"use client"
import Navbar from "@/components/navbar";
import "../../../styles/globals.css";
import Lottie from "lottie-react"
import animationData from "../../../public/shopping-lady.json";
import LoginForm from "@/components/auth-forms/login-form";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function Signup() {
    return (
        <>
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
                <Navbar />
                <div className="md:grid md:grid-cols-2 items-center">
                    <Lottie animationData={animationData} className="py-32 col-span-1 bg-gray-100"/>
                    <LoginForm className="md:col-span-1" />
                </div>
            </GoogleOAuthProvider>
        </>
    )
}
"use client"
import Navbar from "@/components/navbar";
import "../../../styles/globals.css";
import SignupForm from "@/components/auth-forms/signupForm";
import Lottie from "lottie-react"
import animationData from "../../../public/shopping-cart-loader.json";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function Signup() {
    return (
        <>
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
                <Navbar />
                <div className="md:grid md:grid-cols-2 items-center">
                    <Lottie animationData={animationData} className=" col-span-1 bg-gray-100"/>
                    <SignupForm className="md:col-span-1" />
                </div>
            </GoogleOAuthProvider>
        </>
    )
}
"use client"
import Navbar from "@/components/navbar";
import "../../../styles/globals.css";
import SignupForm from "@/components/auth-forms/signupForm";
import Lottie from "lottie-react"
import animationData from "../../../public/shopping-cart-loader.json";

export default function Signup() {
    return (
        <>
            <Navbar />
            <div className="grid grid-cols-2 items-center">
                <Lottie animationData={animationData} className=" col-span-1 bg-gray-100"/>
                <SignupForm className="col-span-1" />
            </div>
        </>
    )
}
"use client"
import Navbar from "@/components/navbar";
import "../../../styles/globals.css";
import Lottie from "lottie-react"
import animationData from "../../../public/shopping-lady.json";
import LoginForm from "@/components/auth-forms/login-form";
import Link from "next/link";

export default function Signup() {
    return (
        <>
            <Navbar />
            <div className="grid grid-cols-2 items-center">
                <Lottie animationData={animationData} className="py-32 col-span-1 bg-gray-100"/>
                <LoginForm className="col-span-1" />
            </div>
        </>
    )
}
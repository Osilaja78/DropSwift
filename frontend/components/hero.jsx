import React from "react";
import '../styles/globals.css';
import Link from "next/link";

const HeroSection = () => {
  return (
    <>
        <div className="bg-main mt-[-135px] h-[100vh]">
			{/* <div className="absolute top-[200px] text-white text-center "> */}
			<div className="centered-div max-w-[550px] text-center text-white">
				<h1 className="text-[40px]">Welcome to DropSwift</h1>
				<p className="text-[20px]">
				Discover a new way to shop with convenience and efficiency. 
				At DropSwift, we bring you an exceptional e-commerce experience 
				that combines quality products with the power of dropshipping.
				</p>
				<Link href="/products"><button className="p-5 bg-white rounded-[45px] text-gray-700 text-2xl font-[510] mt-6">Start Shopping</button></Link>
			</div>
			
        </div>
    </>
  );
};

export default HeroSection;

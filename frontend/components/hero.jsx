import React from "react";
import '../styles/globals.css';
import Link from "next/link";
import SearchBar from "./searchBar";

export default function HeroSection() {
  return (
    <>
        <div className="bg-main mt-[-135px] h-[700px] font-poppins">
			<div className="max-w-[550px] absolute top-[200px] md:top-[150px] px-8 md:px-0 md:left-[30%] md:right-[20%] text-center text-white">
				<h1 className="text-[30px] md:text-[40px]">Welcome to DropSwift</h1>
				<p className="text-[15px] md:text-[22px]">
				Discover a new way to shop with convenience and efficiency. 
				At DropSwift, we bring you an exceptional e-commerce experience 
				that combines quality products with the power of dropshipping.
				</p>
				<Link href="/products"><button className="hidden xl:block p-5 bg-white rounded-[45px] text-gray-700 text-2xl mt-6 mx-auto">Start Shopping</button></Link>
				<div className="mt-10 text-left xl:hidden">
					<SearchBar />
				</div>
			</div>
        </div>
    </>
  );
};

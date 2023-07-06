import React from "react";
import Logo from '../public/logo.svg';
import Image from "next/image";

export default function Footer() {
    return (
        <>
            <section className="font-poppins bg-gray-100">
                <div className="flex flex-col md:grid md:grid-cols-5 w-[90%] m-auto py-20">
                    <div className='flex flex-col gap-8 items-center col-span-2'>
                        <div className="flex items-center">
                            <Image src={Logo} alt="logo"/>
                            <h1 className='text-3xl'>DropSwift</h1>
                        </div>
                        <p>
                            Explore a vast selection of top-notch products
                            <br /> across various categories.
                        </p>
                    </div>
                    <div className="col-span-3 flex flex-col md:flex-row mx-8 md:mx-0 justify-between text-gray-600 gap-5 md:gap-0 mt-5 md:mt-0">
                        <div>
                            <p className="text-[25px]">Shop</p>
                            <ul>
                                <li>Categories</li>
                                <li>Best Selling</li>
                            </ul>
                        </div>
                        <div>
                            <p className="text-[25px]">Support</p>
                            <ul>
                                <li>FAQs</li>
                                <li>Terms Of Use</li>
                                <li>Help</li>
                            </ul>
                        </div>
                        <div>
                            <p className="text-[25px]">Socials</p>
                            <ul>
                                <li>FAQs</li>
                                <li>Terms</li>
                                <li>Help</li>
                            </ul>
                        </div>
                        <div>
                            <p className="text-[25px]">Payment Methods</p>
                            <ul>
                                <li>FAQs</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
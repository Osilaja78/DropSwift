import React from 'react'
import '../styles/globals.css'
import HeroSection from '@/components/hero'

export default function Home() {
    return (
        <>
            <HeroSection />
            <section>
                <div className='max-w-[550px] mt-20'>
                    <p className="text-[20px]">
                    Explore our vast collection of products, shop with confidence, 
                    and let us handle the rest. Say goodbye to traditional hassles 
                    and say hello to effortless shopping.
                    </p>
                    <button className="p-5 bg-[#0C2D48] rounded-[45px] text-gray-700 text-2xl font-[510] mt-6">Explore</button>
                </div>
                <div></div>
            </section>
        </>
    )
}
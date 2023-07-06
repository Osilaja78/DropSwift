import React from "react";
import ProductCharger from '../../public/product-charger.png';
import Image from "next/image";

export default function SpecialOffer() {

    return (
        <>
            <section className="w-[90%] m-auto pb-10 font-poppins">
                <div className='max-w-max m-auto text-[30px] md:text-[40px] py-16 tracking-wider'>
                    <p>Today's Special Offer</p>
                    <div className='w-[100px] m-auto h-[2px] bg-[#256f9a]'></div>
                </div>
                <div className="flex items-center max-w-[600px] m-auto h-[180px] md:h-[300px]">
                    <div className="bg-[#256f9a] h-full rounded-l-[40px] p-5 md:p-10">
                        <Image src={ProductCharger} alt="product image" className="w-[300px] md:max-w-[200px]"/>
                    </div>
                    <div className="bg-[#0c2d48] h-full rounded-r-[40px] p-10">
                        <p className="text-white text-[16px] md:text-[20px]">
                            Order now and get a discount as a special gift.
                        </p>
                        <button className="bg-white px-5 py-3 mt-3 text-[14px] md:text-[17px] text-[#0c2d48] rounded-3xl">Buy now</button>
                    </div>
                </div>
            </section>
        </>
    )
}
import React from 'react';
import '../styles/globals.css';
import HeroSection from '@/components/hero';
import BestSelling from '@/components/products/bestSellingSection';
import FeaturedProducts from '@/components/products/featuredSection';
import EverydayEssentials from '@/components/products/everydayEssentialsSection';
import SpecialOffer from '@/components/products/specialOffer';
import Footer from '@/components/footer';
import Image from 'next/image';
import OfferStar from '../public/offer-star.svg'

export default function Home() {
    return (
        <>
            <HeroSection />
            <section className='flex w-[80%] justify-between mx-auto my-10'>
                <div className='max-w-[550px] mt-20'>
                    <p className="text-[20px]">
                    Explore our vast collection of products, shop with confidence, 
                    and let us handle the rest. Say goodbye to traditional hassles 
                    and say hello to effortless shopping.
                    </p>
                    <button className="p-5 bg-[#0C2D48] rounded-[45px] text-white text-2xl font-[510] mt-6">Explore</button>
                </div>
                <div className='flex gap-10'>
                    <div className='flex flex-col gap-5'>
                        <div className=' w-[60px] h-[65px] bg-slate-400'></div>
                        <div className=' w-[60px] h-[65px] bg-slate-400'></div>
                        <div className=' w-[60px] h-[65px] bg-slate-400'></div>
                        <div className=' w-[60px] h-[65px] bg-slate-400'></div>
                    </div>
                    <div className='flex flex-col gap-5'>
                        <div className=' w-[60px] h-[65px] bg-slate-400'></div>
                        <div className=' w-[60px] h-[65px] bg-slate-400'></div>
                        <div className=' w-[60px] h-[65px] bg-slate-400'></div>
                        <div className=' w-[60px] h-[65px] bg-slate-400'></div>
                    </div>
                    <div className='flex flex-col gap-5'>
                        <div className=' w-[60px] h-[65px] bg-slate-400'></div>
                        <div className=' w-[60px] h-[65px] bg-slate-400'></div>
                        <div className=' w-[60px] h-[65px] bg-slate-400'></div>
                        <div className=' w-[60px] h-[65px] bg-slate-400'></div>
                    </div>
                </div>
            </section>
            {/* ******************* WE OFFER SECTION ****************8 */}
            <section className='w-[90%] m-auto pb-20'>
                <div className='max-w-max m-auto text-[40px] py-16 tracking-wider'>
                    <p>We Offer</p>
                    <div className='w-full h-[2px] bg-[#256f9a]'></div>
                </div>
                <div className='flex gap-20 justify-around'>
                    <div className='bg-gray-300 rounded-lg p-10 max-w-[250px]'>
                        <Image src={OfferStar} alt='star' />
                        <p>Quality Assurance</p>
                        <p>
                            We prioritize quality, and every product offered through DropSwift 
                            undergoes a rigorous selection process.
                        </p>
                    </div>
                    <div className='bg-gray-300 rounded-lg p-10 max-w-[250px]'>
                        <Image src={OfferStar} alt='star' />
                        <p>Worldwide Shipping</p>
                        <p>
                            Embrace the convenience of online shopping without borders.
                        </p>
                    </div>
                    <div className='bg-gray-300 rounded-lg p-10 max-w-[250px]'>
                        <Image src={OfferStar} alt='star' />
                        <p>Guaranteed Satisfaction.</p>
                        <p>
                            Your satisfaction is our utmost priority, and we stand behind the quality of every item we sell
                        </p>
                    </div>
                    <div className='bg-gray-300 rounded-lg p-10 max-w-[250px]'>
                        <Image src={OfferStar} alt='star' />
                        <p>Guaranteed Satisfaction.</p>
                        <p>
                            Your satisfaction is our utmost priority, and we stand behind the quality of every item we sell
                        </p>
                    </div>
                </div>
            </section>
            <section>
                <BestSelling />
            </section>
            <section>
                <FeaturedProducts />
            </section>
            <section>
                <EverydayEssentials />
            </section>
            <section>
                <SpecialOffer />
            </section>
        </>
    )
}
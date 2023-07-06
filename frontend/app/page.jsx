"use client"
import '../styles/globals.css';
import HeroSection from '@/components/hero';
import BestSelling from '@/components/products/bestSellingSection';
import FeaturedProducts from '@/components/products/featuredSection';
import EverydayEssentials from '@/components/products/everydayEssentialsSection';
import SpecialOffer from '@/components/products/specialOffer';
import Image from 'next/image';
import OfferStar from '../public/offer-star.svg';
import HomeNavbar from '@/components/homeNavbar';
import Link from 'next/link';
import homepageAnimation from "../public/homeAnimation";
import Lottie from 'lottie-react';

export default function Home() {
    return (
        <>
            <HomeNavbar />
            <HeroSection />
            <section className='font-poppins flex flex-col md:flex-row items-center w-[90%] justify-around mx-auto my-10 gap-10 md:gap-0 text-center md:text-left'>
                <div className='max-w-[550px] md:pl-10 px-5 md:px-0 pt-5 md:pt-0'>
                    <p className="text-[20px]">
                    Explore our vast collection of products, shop with confidence, 
                    and let us handle the rest. Say goodbye to traditional hassles 
                    and say hello to effortless shopping.
                    </p>
                    <Link href="/products"><button className="p-5 bg-[#0C2D48] rounded-[45px] text-white text-2xl font-[510] mt-6">Explore</button></Link>
                </div>
                <div>
                    <Lottie animationData={homepageAnimation} className='max-w-[600px]'/>
                </div>
            </section>
            {/* ******************* WE OFFER SECTION ****************8 */}
            <section className='w-[90%] m-auto pb-20 font-poppins'>
                <div className='max-w-max m-auto text-[30px] md:text-[40px] md:py-16 tracking-wider'>
                    <p>We Offer</p>
                    <div className='w-full h-[2px] bg-[#256f9a]'></div>
                </div>
                <div className='flex flex-col flex-wrap md:flex-row max-w-max m-auto gap-20 justify-around'>
                    <div className='bg-gray-200 rounded-lg p-10 max-w-[250px]'>
                        <Image src={OfferStar} alt='star' />
                        <p>Quality Assurance</p>
                        <p>
                            We prioritize quality, and every product offered through DropSwift 
                            undergoes a rigorous selection process.
                        </p>
                    </div>
                    <div className='bg-gray-200 rounded-lg p-10 max-w-[250px]'>
                        <Image src={OfferStar} alt='star' />
                        <p>Worldwide Shipping</p>
                        <p>
                            Embrace the convenience of online shopping without borders.
                        </p>
                    </div>
                    <div className='bg-gray-200 rounded-lg p-10 max-w-[250px]'>
                        <Image src={OfferStar} alt='star' />
                        <p>Guaranteed Satisfaction.</p>
                        <p>
                            Your satisfaction is our utmost priority, and we stand behind the quality of every item we sell
                        </p>
                    </div>
                    <div className='bg-gray-200 rounded-lg p-10 max-w-[250px]'>
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
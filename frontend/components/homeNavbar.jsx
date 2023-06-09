"use client"
import {React, useState, useContext, useEffect} from 'react';
import Image from 'next/image';
import Logo from '../public/logo.svg';
import Arrow from '../public/arrow-down.svg';
import Accounts from '../public/accounts.svg';
import Help from '../public/help.svg';
import Link from 'next/link';
import { AuthContext } from './auth/AuthContext';
import { useRouter } from 'next/navigation';
import CategoriesComponent from './categoriesComponent';
import SearchBar from './searchBar';
import menuIcon from '../public/hamburgerMenu.svg';
import MobileNavigation from './mobileNav';
import closeMobileNavIcon from '../public/hamburgerClose.svg';

export default function HomeNavbar() {

    const [account, setAccount] = useState(false);
    const [catsComponent, setCatsComponent] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const { isLoggedIn, logout, categories } = useContext(AuthContext);
    const router = useRouter();

    const handleAccountClick = () => {
        setAccount(!account);
    }

    const handleCategoriesClick = () => {
        setCatsComponent(!catsComponent);
    }

    const handleMobileNavClick = () => {
        setMobileNavOpen(!mobileNavOpen);
    }

    const handleLoginClick = () => {
        router.push("/auth/signin");
    }

    let AccountComponent = <div className='absolute bg-white rounded-lg text-black top-12 right-32 p-5 text-[17px]'>
        <ul>
            <li onClick={ isLoggedIn ? logout : handleLoginClick} className='text-center bg-[#0C2D48] text-white rounded-md px-3 py-2 cursor-pointer'>{ isLoggedIn ? "Sign Out" : "Sign In"}</li>
            <hr className='my-5'/>
            <li><Link href="/dashboard">Dashboard</Link></li>
        </ul>
    </div>

    let Categories;
    if (categories) {
        Categories = <div className='absolute bg-white border border-gray-200 rounded-lg text-black top-12 p-5 text-[17px] shadow-2xl z-10'>
                        <CategoriesComponent />
                    </div>
    }

    return (
        <>
            <nav className='flex justify-between items-start my-8 mx-5 md:mx-32 text-white'>
                <Link href="/">
                    <div className='flex gap-4 md:gap-8 items-center mt-[-15px]'>
                        <Image src={Logo} alt='logo'/>
                        <h1 className='text-3xl'>DropSwift</h1>
                    </div>
                </Link>
                <div className='hidden xl:flex flex-col relative z-10 w-[500px]'>
                    <SearchBar />
                </div>
                <ul className='hidden md:flex relative gap-10 text-2xl mt-3'>
                    <div onClick={handleCategoriesClick} className='flex gap-3 items-center cursor-pointer'>
                        <li>Categories</li>
                        <Image className='mt-2 cursor-pointer' src={Arrow} alt='arrow'/>
                    </div>
                    {catsComponent && Categories}
                    <div onClick={handleAccountClick} className='flex gap-3 items-center cursor-pointer'>
                        <Image className='mt-2' src={Accounts} alt='accounts'/>
                        <li>Account</li>
                        <Image className='mt-2' src={Arrow} alt='arrow'/>
                    </div>
                    {account ? AccountComponent : ''}
                    <div className='flex gap-3 items-center cursor-pointer'>
                        <Image className='mt-2' src={Help} alt='help'/>
                        <li>Help</li>
                    </div>
                </ul>
                <Image onClick={handleMobileNavClick} src={mobileNavOpen ? closeMobileNavIcon : menuIcon} className='md:hidden z-30' alt='menu-icon'/>
                {mobileNavOpen && <MobileNavigation />}
            </nav>
        </>
    )
}
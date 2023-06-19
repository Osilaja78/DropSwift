"use client"
import {React, useState} from 'react';
import Image from 'next/image';
import Logo from '../public/logo.svg';
import Arrow from '../public/arrow-down.svg';
import Accounts from '../public/accounts.svg';
import Help from '../public/help.svg';
import Search from '../public/search-icon.svg';

export default function HomeNavbar() {

    const [account, setAccount] = useState(false)

    const handleAccountClick = () => {
        setAccount(!account);
    }

    let AccountComponent = <div className='absolute bg-white rounded-lg text-black top-12 right-32 p-5 text-[17px]'>
        <ul>
            <li className='text-center bg-[#0C2D48] text-white rounded-md px-3 py-2'>Login</li>
            <hr className='my-5'/>
            <li>Dashboard</li>
        </ul>
    </div>

    return (
        <>
            <nav className='flex justify-between items-center mx-32 my-8 text-white'>
                <div className='flex gap-8 items-center'>
                    <Image src={Logo} alt='logo'/>
                    <h1 className='text-3xl'>DropSwift</h1>
                </div>
                <div className='bg-white px-5 py-3 w-[500px] rounded-3xl text-black'>
                    <form action="" className='flex justify-between items-center'>
                        <input type="search" name="search" id="search" placeholder='Search Products' className='border-none outline-none w-full' />
                        <div className='bg-gray-300 rounded-full p-2'>
                            <Image className='cursor-pointer' src={Search} alt='search'/>
                        </div>
                    </form>
                </div>
                <ul className='flex relative gap-10 text-2xl'>
                    <div className='flex gap-3 items-center cursor-pointer'>
                        <li>Categories</li>
                        <Image className='mt-2 cursor-pointer' src={Arrow} alt='arrow'/>
                    </div>
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
            </nav>
        </>
    )
}
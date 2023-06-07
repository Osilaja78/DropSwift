import React from 'react';
import Image from 'next/image';
import Logo from '../public/logo.svg';
import Arrow from '../public/arrow-down.svg';
import Accounts from '../public/accounts.svg';
import Help from '../public/help.svg';
import Search from '../public/search-icon.svg';

export default function Navbar() {
    return (
        <>
            <nav className='flex justify-between items-center mx-32 my-8 text-white'>
                <div className='flex gap-8 items-center'>
                    <Image src={Logo} />
                    <h1 className='text-3xl'>DropSwift</h1>
                </div>
                <div className='bg-white px-5 py-3 w-[500px] rounded-3xl text-black'>
                    <form action="" className='flex justify-between items-center'>
                        <input type="search" name="search" id="search" placeholder='Search Products' className='border-none outline-none w-full' />
                        <div className='bg-gray-300 rounded-full p-2'>
                            <Image className='cursor-pointer' src={Search} />
                        </div>
                    </form>
                </div>
                <ul className='flex relative gap-10 text-2xl'>
                    <div className='flex gap-3 items-center cursor-pointer'>
                        <li>Categories</li>
                        <Image className='mt-2 cursor-pointer' src={Arrow} />
                    </div>
                    <div className='flex gap-3 items-center cursor-pointer'>
                        <Image className='mt-2' src={Accounts} />
                        <li>Account</li>
                        <Image className='mt-2' src={Arrow} />
                    </div>
                    <div className='flex gap-3 items-center cursor-pointer'>
                        <Image className='mt-2' src={Help} />
                        <li>Help</li>
                    </div>
                </ul>
            </nav>
        </>
    )
}
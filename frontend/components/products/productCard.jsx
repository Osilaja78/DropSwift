"use client"
import React, { useContext, useState } from 'react';
import Image from 'next/image';
import Stars from '../../public/stars.svg';
import Cart from '../../public/cart.svg';
import { addToCart } from '@/apis';
import { AuthContext } from '../auth/AuthContext';
import { ToastContainer } from 'react-toastify';
import { notify, warn } from '@/app/layout';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ProductCard = ({ image, name, stars, price, id }) => {

    const { accessToken } = useContext(AuthContext);
    const [ response, setResponse ] = useState('');
    const [ error, setError ] = useState('');

    const router = useRouter();

    const starElements = Array.from({ length: stars }, (_, index) => (
          <Image key={index} src={Stars}/>
    ));

    const handleAddToCart = async () => {
        setError('');
        setResponse('');
        try {
            const res = await addToCart(id, accessToken);
            setResponse(res.message);
        } catch (err) {
            if (err == "Error: 401") {
                setError("Unauthorized, please login.");
            } else if (err == "Error: 400") {
                setError("Product already exist in your cart!");
            } else {
                setError(err);
            }
        }
    }
    
    if (error) {
		warn(`${error}`);
	}

	if (response) {
		notify(`${response}`)
	}

    return (
        <div className="cursor-pointer">
            <Link href={{pathname: `/product/${id}`}}>
                <div className='bg-gray-100 rounded-3xl max-w-[150px] h-[150px] md:max-w-[200px] md:h-[200px] relative px-6 py-10'>
                    <Image src={image} alt={name ? name : "Product Image" } className='w-[100%] h-[100%]'/>
                </div>
            </Link>
            <Link href={{pathname: `/product/${id}`}}>
                <h2 className='text-[18px] py-2 px-2 break-words'>{name}</h2>
            </Link>
            <div className="stars flex px-2">{starElements}</div>
            <div className="price pt-2 text-[15px] px-2">${price}</div>
            <Image onClick={handleAddToCart} src={Cart} alt='cart' className='bg-[#0C2D48] p-2 rounded-full float-right mt-[-20px]' width={45}/>
            <ToastContainer />
        </div>
    );
  };
  
  export default ProductCard;
  
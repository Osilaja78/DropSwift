import React, { useContext, useState } from 'react';
import Image from 'next/image';
import Stars from '../../public/stars.svg';
import removeIcon from '../../public/remove-icon.svg';
import { removeFromCart } from '@/apis';
import { AuthContext } from '../auth/AuthContext';
import { warn, notify } from '@/app/layout';
import { ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';

const DashboardProductCard = ({ image, name, stars, price, status, id, qty, cart }) => {

    const { accessToken, logout } = useContext(AuthContext);
    const [ error, setError ] = useState('');
    const [ response, setResponse ] = useState('');

    const router = useRouter();

    const starElements = Array.from({ length: stars }, (_, index) => (
          <Image key={index} alt='stars' src={Stars}/>
    ));

    const handleRemoveFromCart = async () => {
        console.log("Inside remove from cart...")
        console.log(accessToken);
        try {
            const res = await removeFromCart(id, accessToken)
            console.log(res);
            setResponse(res.detail);
        } catch (err) {
            console.log(err);
            if (err == "Error: 401") {
                setError("Unauthorized, please login.");
                logout();
                router.push("/auth/signin");
            } else if (err == "Error: 400") {
                setError("You do not have this product in your cart. Please REFRESH the page!")
            } else {
                setError(err);
            }
        }
        console.log("After remove from cart...")
    }

    if (error) {
		warn(`${error}`);
	}

	if (response) {
		notify(`${response}`)
	}
    

    return (
        <div className="cursor-pointer flex items-center justify-between">
            <div className='flex gap-10 items-center'>
                <div className='bg-gray-100 rounded-3xl max-w-[150px] h-[150px] relative px-6 py-10'>
                    <Image src={image} alt={name} className='w-[100%] h-[100%]'/>
                </div>
                <h2 className='text-[18px] py-2 px-2'>{name}</h2>
            </div>
            <div className="stars flex px-2">{starElements}</div>
            <div className="price pt-2 text-[15px] px-2">${price}</div>
            <div className="price pt-2 text-[15px] px-2">{status}</div>
            { qty && <div className="price pt-2 text-[15px] px-2">Qty: {qty}</div>}
            { cart && <button onClick={handleRemoveFromCart} className="bg-[#0C2D48] p-5 text-white text-[20px] rounded-xl ml-10"><Image src={removeIcon} alt='remove'/></button>}
            <ToastContainer />
        </div>
    );
  };
  
  export default DashboardProductCard;
  
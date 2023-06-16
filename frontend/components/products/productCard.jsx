import React from 'react';
import Image from 'next/image';
import Stars from '../../public/stars.svg';
import Cart from '../../public/cart.svg'

const ProductCard = ({ image, name, stars, price }) => {

    const starElements = Array.from({ length: stars }, (_, index) => (
          <Image key={index} src={Stars}/>
      ));
    

    return (
        <div className="cursor-pointer">
            <div className='bg-gray-100 rounded-3xl w-[200px] h-[200px] px-6 py-12'>
                <Image src={image} alt={name} className=''/>
            </div>
            <h2 className='text-[18px] py-2 px-2'>{name}</h2>
            <div className="stars flex px-2">{starElements}</div>
            <div className="price pt-2 text-[15px] px-2">${price}</div>
            <Image src={Cart} className='bg-[#0C2D48] p-2 rounded-full float-right mt-[-20px]' width={45}/>
        </div>
    );
  };
  
  export default ProductCard;
  
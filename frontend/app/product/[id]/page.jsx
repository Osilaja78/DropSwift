"use client"
import "../../../styles/globals.css";
import Navbar from "@/components/navbar";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import productSpinner from "../../../public/product-spinner.png";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import Head from "next/head";
import Stars from "../../../public/stars.svg";
import { AuthContext } from "@/components/auth/AuthContext";
import { addToCart } from "@/apis";
import { warn, notify } from "@/app/layout";
import { ToastContainer } from "react-toastify";

export default function ProductDetails() {

    const router = useRouter();
    const params = useParams();
    const productId = params.id;

    const { accessToken, logout } = useContext(AuthContext);
    const [ error, setError ] = useState('');
    const [ response, setResponse ] = useState('');

    const [productDetail, setProductDetail] = useState(null);

    useEffect(() => {
        if (productId) {
            const fetchProduct = async () => {
                try {
                    const res = await axios.get(`http://localhost:8000/product/${productId}`)
                    setProductDetail(res.data);
                    console.log(res.data);
                } catch (err) {
                    router.push("/404")
                }
            }
            fetchProduct();
        }
    }, [])

    const handleAddToCart = async () => {
        setError('');
        setResponse('');
        try {
            const res = await addToCart(productId, accessToken);
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

    let starElements;
    if (productDetail) {
        starElements = Array.from({ length: productDetail.rating }, (_, index) => (
            <Image key={index} src={Stars}/>
        ));
    }

    if (error) {
		warn(`${error}`);
	}

	if (response) {
		notify(`${response}`)
	}

    return (
        <>
            <Head>
                <title>Product name</title>
            </Head>
            <Navbar />
            <div className="w-[80%] m-auto my-20">
                <nav className="flex items-center gap-2 text-[15px] text-gray-500">
                    <Link href="/products">Products</Link>
                    {productDetail && (
                        <>
                        <span>&gt;</span>
                        <Link href={{pathname: "/products/", query: {category: productDetail.category} }}>{productDetail.category}</Link>
                        </>
                    )}
                    {productDetail && (
                        <>
                        <span>&gt;</span>
                        <span>{productDetail.product_name}</span>
                        </>
                    )}
                </nav>
                { productDetail && (<div className="mt-10 flex flex-col md:flex-row">
                    <div className="max-w-[400px]">
                        <div className="max-w-[400px] h-auto bg-gray-200 rounded-xl px-10 py-20">
                            <Image src={productSpinner} alt="product image"/>
                        </div>
                        <div className="flex justify-between mt-3">
                            <div className="bg-gray-200 rounded-lg p-3">
                                <Image src={productSpinner} alt="product image" width={110} height={110}/>
                            </div>
                            <div className="bg-gray-200 rounded-lg p-3">
                                <Image src={productSpinner} alt="product image" width={110} height={110}/>
                            </div>
                            <div className="bg-gray-200 rounded-lg p-3">
                                <Image src={productSpinner} alt="product image" width={110} height={110}/>
                            </div>
                        </div>
                    </div>
                    <div className="md:ml-10 mt-10 md:mt-0 max-w-[500px] flex flex-col gap-5 font-poppins">
                        <h1 className="text-[40px]">{ productDetail.product_name }</h1>
                        <p className="text-[18px]">{productDetail.description}</p>
                        <div className="stars flex px-2">{starElements}</div>
                        <div className="price pt-2 text-[20px] px-2">${productDetail.price}</div>
                        <p className="text-[16px] mt-3">Status: <span className="text-green-600">Available</span></p>
                        <button onClick={handleAddToCart} className="bg-[#0C2D48] text-white p-5 rounded-lg max-w-max">Add to cart</button>
                    </div>
                </div>)}
            </div>
            <ToastContainer />
        </>
    )
}
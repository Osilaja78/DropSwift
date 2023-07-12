"use client"
import "../../../styles/globals.css";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Navbar from "@/components/navbar";
import { useSearchParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import productSpinner from "../../../public/product-spinner.png";
import { AuthContext } from "@/components/auth/AuthContext";
import axios from "axios";
import Image from "next/image";

export default function CheckoutPage() {

    const { accessToken, logout, userDetails, setUserDetails } = useContext(AuthContext);

    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams.get("productId");

    const [productDetail, setProductDetail] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState();

    const calculateTotalPrice = (quantity) => {
        const pricePerUnit = productDetail.price;
        return quantity * pricePerUnit;
    }

    const handleQuantityChange = (e) => {
        const newQuantity = parseInt(e.target.value, 10);
        console.log("New quantity -> ", newQuantity);
        setQuantity(newQuantity);
        const newTotalPrice = calculateTotalPrice(newQuantity);
        setTotalPrice(newTotalPrice);
    }

    useEffect(() => {
        console.log("fetching product...", productId)
        if (productId) {
            console.log("Inside fetch products...")
            const fetchProduct = async () => {
                try {
                    const res = await axios.get(`http://localhost:8000/product/${productId}`)
                    setProductDetail(res.data);
                } catch (err) {
                    console.log(err);
                    router.push("/404");
                }
            }
            fetchProduct();
        }
    }, [])

    useEffect(() => {
        if (!userDetails[0]) {
            const fetchUserDetails = async () => {
                try {
                    const res = await axios.get(`http://localhost:8000/user/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                const details = res.data.details;

                setUserDetails(details);

                } catch (err) {
                    logout();
                    console.error("Error fetching user details:", err);
                    router.push("/auth/signin");
                }
            };
            fetchUserDetails();
        }
    }, [])

    const handleProceed = async () => {
        try {
            const response = await axios.post("https://api.flutterwave.com/v3/payments", {
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_FLW_SECRET_KEY}`
                },
                json: {
                    tx_ref: "hooli-tx-1920bbtytty",
                    amount: totalPrice,
                    currency: "USD",
                    redirect_url: `http://localhost:3000/r/checkout?productId=${productId}`,
                    meta: {
                        product_id: productId,
                    },
                    customer: {
                        email: "osilajaabdulhameed@gmail.com",
                        phonenumber: "09074954578",
                        name: "Hameed Osilaja"
                    },
                    customizations: {
                        title: `Payment for ${productDetail.product_name}`,
                        // logo: "http://www.piedpiper.com/app/themes/joystick-v27/images/logo.png"
                    }
                }
            }).json();
            console.log(response);
            window.open(response.data.link, '_blank');
        } catch (err) {
            console.log(err.code);
            console.log(err.response.body);
        }
    }
    
    return (
        <ProtectedRoute>
            <Navbar />
            <div className="w-[80%] m-auto py-20 font-poppins">
                <p className="text-[30px]">Checkout Page</p>
                { productDetail && (<div className="mt-10 flex flex-col md:flex-row">
                    <div className="max-w-[200px] h-auto bg-gray-200 rounded-xl px-10 py-20">
                        <Image src={productSpinner} alt="product image"/>
                    </div>
                    <div className="md:ml-10 mt-10 md:mt-0 max-w-[500px] flex flex-col gap-5 font-poppins">
                        <h1 className="text-[40px]">{ productDetail.product_name }</h1>
                        <p className="text-[18px]">{productDetail.description}</p>
                        <div className="price pt-2 text-[20px] px-2">${productDetail.price}</div>
                    </div>
                </div>)}
                <form action="" className="flex gap-3 my-10 items-center">
                    <label htmlFor="quantity">Quantity:</label>
                    <input type="number" name="quantity" min={1} onChange={handleQuantityChange} className="border p-2 rounded-lg w-[65px]" />
                    <i className="text-gray-300 text-[15px]">Please enter quantity.</i>
                </form>
                <div>
                    <p className="text-[20px] p-3 mt-5 mb-3 bg-gray-100 max-w-max">Confirm you address details.</p>
                    {userDetails[0] && <div>
                        <p className="p-3">Address: {userDetails[0].address_one}, {userDetails[0].address_two}, {userDetails[0].city}, {userDetails[0].country ? userDetails[0].country : ''}</p>
                        <p className="p-3">Phone: {userDetails[0].phone}</p>
                        <p className="p-3">Postal Code: {userDetails[0].postal_code}</p>
                    </div>}
                    <i className="text-gray-300 text-[15px]">You can update your address details on your dashboard.</i>
                </div>
                <div>
                    <p className="text-[20px] p-3 mt-5 mb-3 bg-gray-100 max-w-[300px]">Summary.</p>
                    <div className="ml-4 flex flex-col gap-3">
                        <p>Quantity: {quantity}</p>
                        <p>Total: ${totalPrice ? totalPrice : productDetail.price}</p>
                    </div>
                </div>
                <button onClick={handleProceed} className="bg-[#0C2D48] px-5 py-4 text-white text-[16px] rounded-xl mt-10">Proceed</button>
            </div>
        </ProtectedRoute>
    )
}
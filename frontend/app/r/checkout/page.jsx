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
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { warn, notify } from "@/app/layout";
import { ToastContainer } from "react-toastify";
import { baseApiUrl } from "@/apis";


export default function CheckoutPage() {

    const { accessToken, logout, userDetails, setUserDetails, user, setUser } = useContext(AuthContext);

    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams.get("productId");

    const [productDetail, setProductDetail] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState();
    const [response, setResponse] = useState('');

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
            const fetchProduct = async () => {
                try {
                    const res = await axios.get(`${baseApiUrl}/product/${productId}`)
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
                    const res = await axios.get(`${baseApiUrl}/user/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                const details = res.data.details;
                const userData = {
                    firstName: res.data.first_name,
                    lastName: res.data.last_name,
                    email: res.data.email
                }

                setUserDetails(details);
                setUser(userData);

                } catch (err) {
                    logout();
                    console.error("Error fetching user details:", err);
                    router.push("/auth/signin");
                }
            };
            fetchUserDetails();
        }
    }, [])

    const config = productDetail && user ? {
        public_key: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY,
        tx_ref: Date.now(),
        amount: "100.00",
        currency: "USD",
        payment_options: "card,mobilemoney,ussd",
        customer: {
          email: user.email,
          phone_number: userDetails[0].phone,
          name: user.firstName + ' ' + user.lastName,
        },
        customizations: {
          title: "DropSwift Payment",
          description: `Payment for ${productDetail.product_name}`,
        //   logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
        },
    } : null ;

    const handleFlutterPayment = useFlutterwave(config);

    const handleProceed = () => {
        handleFlutterPayment({
            callback: (response) => {
                console.log(response);
                closePaymentModal();

                if (response.status === "successful") {
                        const proceed = async () => {
                            try {
                                const orderData = {
                                    product_id: productId,
                                    no_of_order: quantity
                                };
                        
                                const res = await axios.post(`${baseApiUrl}/add-order`, orderData, {
                                    headers: {
                                        Authorization: `Bearer ${accessToken}`,
                                    },
                                });

                                setResponse(res.data.message);
                                router.push("/dashboard");
                            } catch (error) {
                                if (error.response.data.detail === "token has been expired") {
                                    logout();
                                    router.push("/auth/signin");
                                } else {
                                    console.error("Error saving user's orders:", error);
                                }
                            }
                        };
                        proceed();
                };
            },
            onClose: () => {
                router.push("/dashboard");
            },
        })
    }

    if (response) {
		notify(`${response}`)
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
                    <p className="text-[20px] p-3 mt-5 mb-3 bg-gray-100 max-w-max">Confirm your address details.</p>
                    {userDetails[0] && <div>
                        <p className="p-3">Address: {userDetails[0].address_one}, {userDetails[0].address_two}, {userDetails[0].city}, {userDetails[0].country ? userDetails[0].country : ''}</p>
                        <p className="p-3">Phone: {userDetails[0].phone}</p>
                        <p className="p-3">Postal Code: {userDetails[0].postal_code}</p>
                    </div>}
                    <i className="text-gray-300 text-[15px]">You can update your address details on your dashboard.</i>
                </div>
                {productDetail && (<div>
                    <p className="text-[20px] p-3 mt-5 mb-3 bg-gray-100 max-w-[300px]">Summary.</p>
                    <div className="ml-4 flex flex-col gap-3">
                        <p>Quantity: {quantity}</p>
                        <p>Total: ${totalPrice ? totalPrice : productDetail.price}</p>
                    </div>
                </div>)}
                <button onClick={handleProceed} className="bg-[#0C2D48] px-5 py-4 text-white text-[16px] rounded-xl mt-10">Proceed</button>
            </div>
            <ToastContainer />
        </ProtectedRoute>
    )
}
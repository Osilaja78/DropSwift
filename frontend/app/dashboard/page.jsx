"use client"
import Navbar from "@/components/navbar";
import "../../styles/globals.css"
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AuthContext } from "@/components/auth/AuthContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Lottie from "lottie-react";
import cartLoader from "../../public/cart-loader";
import OrdersComponent from "@/components/dashboard/orders";
import CartComponent from "@/components/dashboard/cart";
import AddressBook from "@/components/dashboard/addressBook";
import { useRouter } from "next/navigation";

export default function Dashboard() {

    const [loading, setLoading] = useState(false);
    const [activeLink, setActiveLink] = useState("address");
    const {
        accessToken, user, setUser, setCart,
        setUserDetails, setOrders, logout,
        setIsLoggedIn, isLoggedIn
    } = useContext(AuthContext);

    const router = useRouter()
    const handleLinkClick = (link) => {
        setActiveLink(link);
    };

    const handleLogout = () => {
        logout();
        router.push("/");
    }

    let loadingAnimation;
    if (loading) {
        loadingAnimation =  <div className="fixed inset-0 z-20 flex justify-center items-center bg-opacity-50 bg-gray-800">
                                <Lottie animationData={cartLoader} className="w-[200px]"/>
                            </div>
    }
    
    setIsLoggedIn(true);
    useEffect(() => {
        setLoading(true);
        const fetchUserDetails = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/user/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const cartData = res.data.cart;
            const ordersData = res.data.orders;
            const details = res.data.details;
            const userData = {
                firstName: res.data.first_name,
                lastName: res.data.last_name,
                email: res.data.email
            }

            setUser(userData);
            setCart(cartData);
            setUserDetails(details);
            setOrders(ordersData);
            setLoading(false);

            } catch (err) {
                setLoading(false);
                logout();
                console.error("Error fetching user details:", err);
                router.push("/auth/signin");
            }
        };

        fetchUserDetails();
    }, []);

    return (
        <ProtectedRoute>
            <Navbar />
            {loading && (loadingAnimation)}
            <div className=" grid grid-cols-4 mt-20 w-[90%] m-auto">
                <div className=" col-span-1">
                    <div className="py-3 px-6 max-w-[250px]">
                        <hr />
                        <ul className="text-[16px] space-y-1">
                        <li onClick={() => handleLinkClick("address")} className={activeLink === "address" ? "bg-[#0C2D48] p-5 text-white cursor-pointer" : "bg-gray-100 p-5 cursor-pointer"}>My Account</li>
                            <li onClick={() => handleLinkClick("orders")} className={activeLink === "orders" ? "bg-[#0C2D48] p-5 text-white cursor-pointer" : "bg-gray-100 p-5 cursor-pointer"}>Orders</li>
                            <li onClick={() => handleLinkClick("cart")} className={activeLink === "cart" ? "bg-[#0C2D48] p-5 text-white cursor-pointer" : "bg-gray-100 p-5 cursor-pointer"}>Cart</li>
                            <li onClick={handleLogout} className="bg-gray-100 p-5 cursor-pointer">Logout</li>
                        </ul>
                        <hr />
                    </div>
                </div>
                <div className=" col-span-3">
                    {user ? <p className="text-[25px]">Welcome {user.firstName} ✌🏼</p> : ''}
                    <hr className="my-5"/>
                    <div className={activeLink == "orders" ? "block" : "hidden"}>
                        <OrdersComponent />
                    </div>
                    <div className={activeLink === "cart" ? "block" : "hidden"}>
                        <CartComponent />
                    </div>
                    <div className={activeLink === "address" ? "block" : "hidden"}>
                        <AddressBook />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
"use client"
import { useContext, useEffect, useState } from "react";
import "../../../styles/globals.css"
import Navbar from "@/components/navbar";
import { AuthContext } from "@/components/auth/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import cartLoader from "../../../public/cart-loader";
import AdminOrdesComponent from "@/components/admin/adminOrdersComponent";
import AdminAddProductComponent from "@/components/admin/adminAddProduct";
import AdminCategoriesComponent from "@/components/admin/adminCategoriesComponent";
import ChangeOrderStatusComponent from "@/components/admin/changeOrderStatus";

export default function AdminDashboard() {

    const { user, logout, accessToken } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [activeLink, setActiveLink] = useState("orders");

    const router = useRouter()

    const handleLogout = () => {
        logout();
        router.push("/");
    }

    const handleLinkClick = (link) => {
        setActiveLink(link);
    };

    let loadingAnimation;
    if (loading) {
        loadingAnimation =  <div className="fixed inset-0 z-20 flex justify-center items-center bg-opacity-50 bg-gray-800">
                                <Lottie animationData={cartLoader} className="w-[200px]"/>
                            </div>
    }

    return (
        <ProtectedRoute>
            <Navbar />
            <div className="md:grid md:grid-cols-4 mt-10 md:mt-20 w-[90%] m-auto font-poppins">
                <div className="hidden md:block md:col-span-1">
                    <div className="py-3 px-6 max-w-[250px]">
                        <hr />
                        <ul className="text-[14px] space-y-1">
                            <li onClick={() => handleLinkClick("orders")} className={activeLink === "orders" ? "bg-[#0C2D48] p-5 text-white cursor-pointer" : "bg-gray-100 p-5 cursor-pointer"}>All orders</li>
                            <li onClick={() => handleLinkClick("order-status")} className={activeLink === "order-status" ? "bg-[#0C2D48] p-5 text-white cursor-pointer" : "bg-gray-100 p-5 cursor-pointer"}>Change Order Status</li>
                            <li onClick={() => handleLinkClick("products")} className={activeLink === "products" ? "bg-[#0C2D48] p-5 text-white cursor-pointer" : "bg-gray-100 p-5 cursor-pointer"}>Add Products</li>
                            <li onClick={() => handleLinkClick("categories")} className={activeLink === "categories" ? "bg-[#0C2D48] p-5 text-white cursor-pointer" : "bg-gray-100 p-5 cursor-pointer"}>Add Categories</li>
                            <li onClick={() => handleLinkClick("admin-action")} className={activeLink === "admin-action" ? "bg-[#0C2D48] p-5 text-white cursor-pointer" : "bg-gray-100 p-5 cursor-pointer"}>Admin Action</li>
                            <li onClick={handleLogout} className="bg-gray-100 p-5 cursor-pointer">Logout</li>
                        </ul>
                        <hr />
                    </div>
                </div>
                <div className="md:hidden">
                    <ul className="flex">
                        <li onClick={() => handleLinkClick("orders")} className={activeLink === "orders" ? "bg-[#0C2D48] p-5 text-white cursor-pointer" : "bg-gray-100 p-5 cursor-pointer"}>All orders</li>
                        <li onClick={() => handleLinkClick("order-status")} className={activeLink === "order-status" ? "bg-[#0C2D48] p-5 text-white cursor-pointer" : "bg-gray-100 p-5 cursor-pointer"}>Change Order Status</li>
                        <li onClick={() => handleLinkClick("products")} className={activeLink === "products" ? "bg-[#0C2D48] p-5 text-white cursor-pointer" : "bg-gray-100 p-5 cursor-pointer"}>Add Products</li>
                        <li onClick={() => handleLinkClick("categories")} className={activeLink === "categories" ? "bg-[#0C2D48] p-5 text-white cursor-pointer" : "bg-gray-100 p-5 cursor-pointer"}>Add Categories</li>
                        <li onClick={() => handleLinkClick("admin-action")} className={activeLink === "admin-action" ? "bg-[#0C2D48] p-5 text-white cursor-pointer" : "bg-gray-100 p-5 cursor-pointer"}>Admin Action</li>
                    </ul>
                </div>
                <div className="md:col-span-3 mt-5 md:mt-0">
                    {user ? <p className="text-[25px]">Welcome admin {user.first_name} ✌🏼</p> : ''}
                    <hr className="my-5"/>
                    <div className={activeLink == "orders" ? "block" : "hidden"}>
                        <AdminOrdesComponent />
                    </div>
                    <div className={activeLink == "order-status" ? "block" : "hidden"}>
                        <ChangeOrderStatusComponent />
                    </div>
                    <div className={activeLink === "products" ? "block" : "hidden"}>
                        <AdminAddProductComponent />
                    </div>
                    <div className={activeLink === "categories" ? "block" : "hidden"}>
                        <AdminCategoriesComponent />
                    </div>
                    <div className={activeLink === "admin-action" ? "block" : "hidden"}>
                        <p>Admin action component here...</p>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}
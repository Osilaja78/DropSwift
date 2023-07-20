import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import Lottie from "lottie-react";
import cartLoader from "../../public/cart-loader";
import { useRouter } from "next/navigation";
import { baseApiUrl } from "@/apis";

export default function AdminOrdesComponent() {

    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState(null);
    const { accessToken, logout } = useContext(AuthContext);

    const router = useRouter();

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    }

    const params = {
        status: filter
    };

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${baseApiUrl}/order`, {
                    params: params,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                const ordersData = res.data;
                setOrders(ordersData);
                setLoading(false);
            } catch (err) {
                setLoading(false);
                logout();
                console.error("Error fetching order details:", err);
                router.push("/admin/signin");
            }
        };
        fetchOrders()
    }, [filter])

    let loadingAnimation;
    if (loading) {
        loadingAnimation =  <div className="fixed inset-0 z-20 flex justify-center items-center bg-opacity-50 bg-gray-800">
                                <Lottie animationData={cartLoader} className="w-[200px]"/>
                            </div>
    }

    return (
        <div>
            <div className="text-[12px] md:text-[14px]">
                <label htmlFor="status" className="text-[15px] md:text-[19px] px-5 md:p-5">Sort By:</label>

                <select id="status" onChange={handleFilterChange} className="border border-gray-300 bg-gray-50 rounded-2xl p-3 cursor-pointer">
                    <option value="">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>
            {loading && loadingAnimation}
            {orders && 
            <table className="w-[100%] text-center mt-10">
                <thead>
                    <tr className="border-b">
                        <th className="w-[24%]">Customer</th>
                        <th className="w-[24%]">Product ID</th>
                        <th>Status</th>
                        <th>Quantity</th>
                        <th className="w-[24%]">Order ID</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) =>(
                        <tr key={order.order_id} className="gap-5 border-b">
                            <td>{order.user.email}</td>
                            <td>{order.product_id}</td>
                            <td>{order.order_status}</td>
                            <td>{order.no_of_orders}</td>
                            <td>{order.order_id}</td>
                        </tr>
                    ))}
                </tbody>
            </table>}
        </div>
    )
}
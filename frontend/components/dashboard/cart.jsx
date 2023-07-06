import DashboardProductCard from "../products/dashboradProductCard";
import { useContext } from "react";
import ProductSpinner from "../../public/product-spinner.png";
import { AuthContext } from "../auth/AuthContext";
import Image from "next/image";
import emptyCart from "../../public/empty-cart.svg";

export default function CartComponent() {

    const { cart } = useContext(AuthContext);

    let emptyComponent;
    if (!cart[0]) {
        emptyComponent = <div className="w-max m-auto flex flex-col items-center">
            <Image src={emptyCart} alt="empty"/>
            <p className="text-[30px] text-gray-400">Empty!</p>
        </div>
    }

    return (
        <>
            { cart[0] ? <ul className="flex flex-col gap-5 mb-20">
                {cart.map((products) => (
                <li key={products.product_id}>
                    <DashboardProductCard
                        image={ProductSpinner}
                        name={products.product.product_name}
                        stars={products.product.rating}
                        price={products.product.price}
                        id={products.product_id}
                        cart="true"
                    />
                    <hr className="mt-5"/>
                </li>))}
            </ul> : emptyComponent }
        </>
    )
}
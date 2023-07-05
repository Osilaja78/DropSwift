"use client"
import React, { useEffect, useState, useContext } from "react";
import "../../../styles/globals.css"
import Navbar from "@/components/navbar";
import ProductCard from "@/components/products/productCard";
import ProductCharger from "../../../public/product-charger.png";
import ProductSpinner from "../../../public/product-spinner.png";
import Lottie from "lottie-react";
import cartLoader from "../../../public/cart-loader";
import { AuthContext } from "@/components/auth/AuthContext";
import { getProducts } from "@/apis";
import CategoriesComponent from "@/components/categoriesComponent";

export default function ProductsCategories({catName}) {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState(null);

    const queries = ([
        {key: "category", value: catName}
    ]);

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    }

    if (filter) {
        if (filter === "true") {
            queries.push({key: "newest", value: filter})
        } else if (filter === "lowest") {
            queries.push({key: "price", value: filter})
        } else if (filter === "highest") {
            queries.push({key: "price", value: filter})
        }
    }

    const params = {};
    queries.forEach((query) => {
        params[query["key"]] = query["value"];
    });

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await getProducts(params);
                const productData = res;
                setProducts(productData);
                setLoading(false);
            } catch (err) {
                setLoading(false);
                console.log(err);
            }
        }
        setLoading(false);
        fetchProducts();
    }, [filter])

    let loadingAnimation;
    if (loading) {
        loadingAnimation = <div className="max-w-max m-auto mt-30">
            <Lottie animationData={cartLoader} className="w-[200px]"/>
        </div>
    }

    return (
        <>
            <Navbar />
            <div className="grid grid-cols-4 py-20 w-[90%] m-auto">
                <div className="col-span-1">
                    <div className="border border-gray-300 rounded-2xl py-3 px-6 max-w-[250px]">
                        <p className="text-[25px] text-center">Categories</p>
                        <hr />
                        <CategoriesComponent />
                    </div>
                </div>
                <div className="col-span-3">
                    <div className="flex justify-between">
                        <p className="text-[20px]">Products in the category "{catName}".</p>
                        <div className="text-[16px]">
                            <label htmlFor="sort" className="text-[19px] p-5">Sort By:</label>

                            <select id="sort" onChange={handleFilterChange} className="border border-gray-300 bg-gray-50 rounded-2xl p-3 cursor-pointer">
                                <option value="true">Recently Added</option>
                                <option value="lowest">Lowest Price</option>
                                <option value="highest">Highest Price</option>
                            </select> 
                        </div>
                    </div>
                    { loading ? loadingAnimation : 
                        <ul className="flex flex-wrap gap-4 mt-10">
                            {products.map((product) => (
                            <li key={product.product_id}>
                                <ProductCard
                                    image={ProductSpinner}
                                    name={product.product_name}
                                    stars={product.rating}
                                    price={product.price}
                                    id={product.product_id}
                                />
                            </li>
                        ))}
                    </ul>}
                </div>
            </div>
        </>
    )
}
"use client"
import React, { useEffect, useState, useContext } from "react";
import "../../styles/globals.css";
import Navbar from "@/components/navbar";
import ProductCard from "@/components/products/productCard";
import ProductCharger from "../../public/product-charger.png";
import ProductSpinner from "../../public/product-spinner.png";
import Lottie from "lottie-react";
import cartLoader from "../../public/cart-loader";
import { getProducts } from "@/apis";
import CategoriesComponent from "@/components/categoriesComponent";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Products() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState(null);

    const searchParams = useSearchParams();
    const categoryName = searchParams.get('category');
    const searchTerm = searchParams.get('search')

    const queries = ([]);

    if (categoryName) {
        queries.push({key: "category", value: categoryName})
    }

    if (searchTerm) {
        queries.push({key: "name", value: searchTerm})
    }

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
                console.log(res);
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
    }, [filter, categoryName,searchTerm])

    let loadingAnimation;
    if (loading) {
        loadingAnimation = <div className="max-w-max m-auto mt-30">
            <Lottie animationData={cartLoader} className="w-[200px]"/>
        </div>
    }

    return (
        <>
            <Navbar />
            <div className="md:grid md:grid-cols-4 md:py-20 px-5 md:px-0 md:w-[90%] m-auto pb-20 font-poppins">
                <div className="hidden md:block col-span-1">
                    <div className=" border border-gray-300 rounded-2xl py-3 px-6 max-w-[250px]">
                        <p className="text-[25px] text-center">Categories</p>
                        <hr />
                        <CategoriesComponent />
                    </div>
                </div>
                <div className="md:col-span-3 mt-10 md:mt-0">
                    <div className="flex flex-col md:flex-row gap-5 md:gap-0 justify-between">
                        {categoryName && <p className="text-[16px] md:text-[20px]">Products in the category "{categoryName}".</p>}
                        {searchTerm && <p className="text-[16px] md:text-[20px]">Search results for "{searchTerm}"</p>}
                        <div className="text-[12px] md:text-[16px]">
                            <label htmlFor="sort" className="text-[15px] md:text-[19px] px-5 md:p-5">Sort By:</label>

                            <select id="sort" onChange={handleFilterChange} className="border border-gray-300 bg-gray-50 rounded-2xl p-3 cursor-pointer">
                                <option value="true">Recently Added</option>
                                <option value="lowest">Lowest Price</option>
                                <option value="highest">Highest Price</option>
                            </select> 
                        </div>
                    </div>
                    { products[0] ? <div>
                        { loading ? loadingAnimation : 
                            <ul className="flex flex-wrap gap-4 mt-10 justify-between md:justify-normal">
                                {products.map((product) => (
                                <li key={product.product_id}>
                                    <ProductCard
                                        image={product.main_image_url !== "string" && product.main_image_url !== "" ? product.main_image_url : ProductSpinner}
                                        name={product.product_name}
                                        stars={product.rating}
                                        price={product.price}
                                        id={product.product_id}
                                    />
                                </li>
                            ))}
                        </ul>}
                    </div> :
                    <p className="text-center text-[30px] text-gray-500 mt-20">No results...</p>}
                </div>
            </div>
        </>
    )
}
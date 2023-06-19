import React from "react";
import "../../styles/globals.css";
import Navbar from "@/components/navbar";
import ProductCard from "@/components/products/productCard";
import ProductCharger from "../../public/product-charger.png";
import ProductSpinner from "../../public/product-spinner.png";

export default function Products() {
    return (
        <>
            <Navbar />
            <div className="grid grid-cols-4 py-20 w-[90%] m-auto">
                <div className="col-span-1">
                    <div className="border border-gray-300 rounded-2xl py-3 px-6 max-w-[250px]">
                        <p className="text-[25px] text-center">Categories</p>
                        <hr />
                        <ul className="text-[16px] space-y-2 py-2">
                            <li>Home Appliances</li>
                            <li>Home Appliances</li>
                            <li>Home Appliances</li>
                            <li>Home Appliances</li>
                            <li>Home Appliances</li>
                            <li>Home Appliances</li>
                        </ul>
                    </div>
                </div>
                <div className="col-span-3">
                    <div className="flex justify-between">
                        <p className="text-[20px]">Search results for "Electronics".</p>
                        <div className="text-[16px]">
                            <label htmlFor="sort" className="text-[19px] p-5">Sort By:</label>

                            <select id="sort" className="border border-gray-300 bg-gray-50 rounded-2xl p-3 cursor-pointer">
                                <option value="volvo">Recently Added</option>
                                <option value="saab">Lowest Price</option>
                                <option value="opel">Highest Price</option>
                                <option value="audi">Popularity</option>
                            </select> 
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-10">
                        <ProductCard 
                            image={ProductCharger}
                            name="Flying Fidget Spinner"
                            stars={4.5}
                            price={19.99}
                        />
                        <ProductCard 
                            image={ProductSpinner}
                            name="Flying Fidget Spinner"
                            stars={4.5}
                            price={19.99}
                        />
                        <ProductCard 
                            image={ProductCharger}
                            name="Flying Fidget Spinner"
                            stars={4.5}
                            price={19.99}
                        />
                        <ProductCard 
                            image={ProductSpinner}
                            name="Flying Fidget Spinner"
                            stars={4.5}
                            price={19.99}
                        />
                        <ProductCard 
                            image={ProductCharger}
                            name="Flying Fidget Spinner"
                            stars={4.5}
                            price={19.99}
                        />
                        <ProductCard 
                            image={ProductSpinner}
                            name="Flying Fidget Spinner"
                            stars={4.5}
                            price={19.99}
                        />
                        <ProductCard 
                            image={ProductCharger}
                            name="Flying Fidget Spinner"
                            stars={4.5}
                            price={19.99}
                        />
                        <ProductCard 
                            image={ProductSpinner}
                            name="Flying Fidget Spinner"
                            stars={4.5}
                            price={19.99}
                        />
                        <ProductCard 
                            image={ProductCharger}
                            name="Flying Fidget Spinner"
                            stars={4.5}
                            price={19.99}
                        />
                        <ProductCard 
                            image={ProductSpinner}
                            name="Flying Fidget Spinner"
                            stars={4.5}
                            price={19.99}
                        />
                        <ProductCard 
                            image={ProductCharger}
                            name="Flying Fidget Spinner"
                            stars={4.5}
                            price={19.99}
                        />
                        <ProductCard 
                            image={ProductSpinner}
                            name="Flying Fidget Spinner"
                            stars={4.5}
                            price={19.99}
                        />
                        <ProductCard 
                            image={ProductCharger}
                            name="Flying Fidget Spinner"
                            stars={4.5}
                            price={19.99}
                        />
                        <ProductCard 
                            image={ProductSpinner}
                            name="Flying Fidget Spinner"
                            stars={4.5}
                            price={19.99}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
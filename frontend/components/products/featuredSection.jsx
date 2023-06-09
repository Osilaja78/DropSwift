import React from "react";
import ProductCard from "./productCard";
import ProductSpinner from '../../public/product-spinner.png'

export default function FeaturedProducts() {

    return (
        <>
            <section className="w-[90%] m-auto pb-20 font-poppins">
                <p className="text-[30px] my-16">Featured Products</p>
                <div className="flex flex-col flex-wrap md:flex-row max-w-max m-auto gap-24">
                    <ProductCard 
                        image={ProductSpinner}
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
                        image={ProductSpinner}
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
                        image={ProductSpinner}
                        name="Flying Fidget Spinner"
                        stars={4.5}
                        price={19.99}
                    />
                </div>
            </section>
        </>
    )
}
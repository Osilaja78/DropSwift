import React from "react";
import ProductCard from "./productCard";
import ProductSpinner from '../../public/product-spinner.png'

export default function BestSelling() {

    return (
        <>
            <section className="w-[90%] m-auto pb-20">
                <p className="text-[30px] my-16">Best Selling</p>
                <div className="flex gap-24">
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
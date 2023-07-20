import { useState } from "react";
import Search from "../public/search-icon.svg";
import Image from "next/image";
import axios from "axios";
import Link from "next/link";
import { baseApiUrl } from "@/apis";

export default function SearchBar() {

    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        fetchSearchSuggestions(value);
    };

    const fetchSearchSuggestions = async (value) => {
        try {
            if (value === "") {
                setSuggestions([]);
            } else {
                const res = await axios.get(`${baseApiUrl}/products?name=${value}`);
                const suggestionsData = res.data;
                setSuggestions(suggestionsData);
            }
        } catch (error) {
            console.error("Error fetching search suggestions:", error);
        }
    }

    return (
        <div>
            <div className='bg-white px-5 py-3 max-w-[500px] rounded-3xl text-black shadow-xl'>
                <form action="" className='flex justify-between items-center'>
                    <input type="search" name="search" id="search" onChange={handleInputChange} placeholder='Search Products' className='border-none outline-none w-full' />
                    <div className='bg-gray-300 rounded-full p-2'>
                        <Image className='cursor-pointer' src={Search} alt='search'/>
                    </div>
                </form>
                { suggestions[0] && 
                <div className="relative">
                    <hr className="mt-3"/>
                    <ul className="m-5 relative">
                        { suggestions.map((suggestion) => (
                            <Link key={suggestion.product_id} href={{pathname: "/products/", query: {search: searchQuery}}}><li className="py-2 px-1 hover:bg-gray-100">{ suggestion.product_name }</li></Link>
                        ))}
                    </ul>
                </div>}
            </div>
        </div>
    )
}
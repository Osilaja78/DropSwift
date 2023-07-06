import { AuthContext } from "@/components/auth/AuthContext";
import axios from "axios";
import { resolve } from "styled-jsx/css";

// API call to get the list of all categories available
export async function getCategories() {
    return new Promise((resolve, reject) => {
        axios.get(`http://localhost:8000/category`)
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                const errorMessage = err;
                reject(new Error(errorMessage));
            });
    });
}

// API call to get products with specified parameters like category, price, newest.
export async function getProducts(params) {
    return new Promise((resolve, reject) => {
        axios.get(`http://localhost:8000/products`, {
            params: params
        }).then((res) => {
            resolve(res.data);
        })
        .catch((err) => {
            reject(new Error(err))
        });
    });
}

// API call to add products to cart
export async function addToCart(id, accessToken) {
    const formData = {
        product_id: id
    }
    
    return new Promise((resolve, reject) => {
        axios.post(`http://localhost:8000/add-to-cart`, formData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then((res) => {
            resolve(res.data);
        })
        .catch((err) => {
            console.log(err);
            if (err.response.status === 401) {
                reject(new Error(err.response.status))
            } else if (err.response.status === 400) {
                reject(new Error(err.response.status))
            } else {
                reject(new Error(err))
            }
        });
    });
}

// API call to remove a product from cart
export async function removeFromCart(id, accessToken) {
    const formData = {
        product_id: id
    }
    console.log(formData);
    return new Promise((resolve, reject) => {
        axios.post(`http://localhost:8000/delete-from-cart`, formData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then((res) => {
            resolve(res.data);
        })
        .catch((err) => {
            if (err.response.status === 401) {
                reject(new Error(err.response.status))
            } else if (err.response.status === 400) {
                reject(new Error(err.response.status))
            } else {
                reject(new Error(err))
            }
        });
    });
}

export default function Slugify(str) {
    const new_str = str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

    return new_str;
}
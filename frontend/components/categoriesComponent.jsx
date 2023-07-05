import { useContext, useEffect } from "react";
import { AuthContext } from "./auth/AuthContext";
import { getCategories } from "@/apis";
import Link from "next/link";

export default function CategoriesComponent() {

    const { categories, setCategories } = useContext(AuthContext);

    useEffect(() => {
        if (!categories[0]) {
            const fetchCategories = async () => {
                try {
                    const res = await getCategories();
                    setCategories(res);
                    console.log(res);
                } catch (error) {
                    console.error('Error fetching categories:', error);
                }
            }
            fetchCategories();
        }
    }, [])
    
    return (
        <div>
            { categories[0] ? <ul className="text-[16px] space-y-2 py-2">
                {categories.map((cat) => (
                    <Link key={cat.category_id} href={`/products/${cat.name}`}><li>{cat.name}</li></Link>
                ))}
            </ul> : <p className="text-center mt-10">Loading...</p>}
        </div>
    )
}
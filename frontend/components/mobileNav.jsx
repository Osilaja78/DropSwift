import Image from "next/image";
import { useState, useContext } from "react";
import arrorDown from "../public/arrow-down.svg";
import helpIcon from "../public/help.svg";
import CategoriesComponent from "./categoriesComponent";
import Link from "next/link";
import { AuthContext } from "./auth/AuthContext";
import { useRouter } from "next/navigation";

export default function MobileNavigation() {

    const [account, setAccount] = useState(false);
    const [catsComponent, setCatsComponent] = useState(false);
    const { isLoggedIn, logout } = useContext(AuthContext);
    const router = useRouter();

    const handleAccountClick = () => {
        setAccount(!account);
    }

    const handleCategoriesClick = () => {
        setCatsComponent(!catsComponent);
    }

    const handleLoginClick = () => {
        router.push("/auth/signin");
    }

    let accountComponent, categoriesComponent;
    accountComponent = <div className="text-[17px] pl-5">
                        <ul>
                            <li className="py-4"><Link href="/dashboard">Dashboard</Link></li>
                        </ul>
                    </div>
    
    categoriesComponent = <div className="pl-5">
                            <CategoriesComponent />
                        </div>

    return (
        <>
            <nav className="font-poppins bg-gray-50 h-[100vh] p-10 absolute top-0 left-0 w-full z-10 text-[20px] text-gray-500">
                <ul className="flex flex-col gap-10 mt-14">
                    <div onClick={handleCategoriesClick} className="flex flex-col gap-2 cursor-pointer">
                        <div className="flex gap-3 items-center">
                            <li>Categories</li>
                            <Image src={arrorDown} alt="arrow-down"/>
                        </div>
                        {catsComponent && categoriesComponent}
                    </div>
                    <div onClick={handleAccountClick} className="flex flex-col gap-2 cursor-pointer">
                        <div className="flex gap-3 items-center">
                            <li>Account</li>
                            <Image src={arrorDown} alt="arrow-down"/>
                        </div>
                        {account && accountComponent}
                    </div>
                    <div className="flex gap-2">
                        <Image src={helpIcon} alt="arrow-down"/>
                        <li>Help</li>
                    </div>
                    <li onClick={ isLoggedIn ? logout : handleLoginClick } className='text-center bg-[#0C2D48] text-white rounded-md px-5 py-4 cursor-pointer'>{ isLoggedIn ? "Sign Out" : "Sign In"}</li>
                </ul>
            </nav>
        </>
    )
}

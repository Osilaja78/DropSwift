"use client"
import React, { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "./AuthContext";
import { usePathname } from "next/navigation";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, accessToken} = useContext(AuthContext);  
  const router = useRouter();
  const pathname = usePathname();

  let localToken, localUserId;
  if (typeof window !== 'undefined') {
    localToken = window.sessionStorage.getItem("accessToken");
    localUserId = window.sessionStorage.getItem("userId");
  }

  useEffect(() => {
    if (!localToken || !accessToken) {
      // User is not logged in, redirect to login page
      if (pathname === "/admin/dashboard") {
        router.push("/admin/signin");
      } else {
        router.push("/auth/signin");
      }
    }
  }, [isLoggedIn, accessToken, router]);

  return <>{children}</>;
};

export default ProtectedRoute;

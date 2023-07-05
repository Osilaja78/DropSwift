"use client"
import React, { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, accessToken} = useContext(AuthContext);  
  const router = useRouter();

  let localToken, localUserId;
  if (typeof window !== 'undefined') {
    localToken = window.sessionStorage.getItem("accessToken");
    localUserId = window.sessionStorage.getItem("userId");
  }

  useEffect(() => {
    if (!localToken || !accessToken) {
      // User is not logged in, redirect to login page
      router.push("/auth/signin");
    }
  }, [isLoggedIn, accessToken, router]);

  return <>{children}</>;
};

export default ProtectedRoute;

"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminAuthFallback() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // First check if we have specific admin flag
        if (localStorage.getItem("isAdmin") === "true") {
          console.log("Admin flag found in localStorage");
          setIsAdmin(true);
          setLoading(false);
          return;
        }
        
        // Then check if we have admin user data in localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.isAdmin) {
            console.log("Admin user found in localStorage");
            localStorage.setItem("isAdmin", "true"); // Set the flag for future checks
            setIsAdmin(true);
            setLoading(false);
            return;
          }
        }
        
        // If no admin in localStorage, check for token
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setLoading(false);
          return; // No token, not an admin
        }
        
        console.log("Token found, validating admin status...");
        
        // Validate token and check admin status
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/v1/users/validate-token`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("Token validation response:", data);
          
          if (data.data?.user?.isAdmin) {
            // Store user data for future checks
            localStorage.setItem("user", JSON.stringify(data.data.user));
            setIsAdmin(true);
          }
        } else {
          console.log("Token validation failed or user is not admin");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);
  
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        <p className="mt-4 text-gray-600">Verifying admin access...</p>
      </div>
    );
  }
  
  if (!isAdmin) {
    return (
      <main className="flex flex-col justify-center items-center h-screen text-xl text-red-600 gap-8">
        <p className="font-medium">Access Denied – Admins only</p>
        <div className="text-center text-gray-700 text-sm mb-4">
          {!localStorage.getItem("user")
            ? "You are not logged in"
            : "Your account does not have admin privileges"}
        </div>
        <Link
          href="/login"
          className="bg-amber-400 hover:bg-amber-500 px-6 py-3 w-32 h-12 flex justify-center items-center rounded-md text-white font-medium transition-colors"
        >
          Login
        </Link>
      </main>
    );
  }
  
  return null; // If admin, render nothing and allow the layout to proceed
}

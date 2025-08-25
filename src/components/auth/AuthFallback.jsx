"use client";

import { useEffect } from "react";

export default function AuthFallback() {
  useEffect(() => {
    // Only run on client side
    const checkTokenFallback = async () => {
      try {
        // Check if we already have a user in localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          console.log("Found user in localStorage");
          return; // Already handled
        }

        // Check if we have a token in localStorage but no cookies
        const token = localStorage.getItem("accessToken");
        if (!token) return; // No token to verify

        console.log("Found token in localStorage, validating...");

        // Try to validate the token with your backend
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER}/api/v1/users/validate-token`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include", // Important to receive cookies
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Token validated successfully");

          // Store user data for components that need it
          if (data.data) {
            localStorage.setItem("user", JSON.stringify(data.data));
          }

          // Force a hard refresh to ensure the cookie is used in subsequent requests
          window.location.reload();
        } else {
          console.log("Token validation failed, removing token");
          localStorage.removeItem("accessToken");
        }
      } catch (error) {
        console.error("Error in auth fallback:", error);
      }
    };

    checkTokenFallback();
  }, []);

  return null; // This component doesn't render anything
}

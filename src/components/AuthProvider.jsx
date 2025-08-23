"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

export default function AuthProvider({ children, initialUser }) {
  const { isAuthenticated, user, loading, refreshToken } = useAuth();

  // Set up automatic token refresh interval
  useEffect(() => {
    if (isAuthenticated) {
      // Refresh token every 14 minutes (access token usually expires in 15 minutes)
      const interval = setInterval(() => {
        console.log("⏰ Automatic token refresh...");
        refreshToken();
      }, 14 * 60 * 1000); // 14 minutes

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, refreshToken]);

  // Handle token expiry in real-time
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "tokenExpired" && e.newValue === "true") {
        console.log("🔄 Token expired, attempting refresh...");
        refreshToken();
        localStorage.removeItem("tokenExpired");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [refreshToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return children;
}

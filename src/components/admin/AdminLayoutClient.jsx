"use client";

import { useState, useEffect } from 'react';
import { SidebarAdmin } from "@/components/admin/SidebarAdmin";
import AdminAuthFallback from "@/components/admin/AdminAuthFallback";

export default function AdminLayoutClient({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for admin status
    const checkAdminUser = () => {
      try {
        // First check explicit admin flag
        if (localStorage.getItem("isAdmin") === "true") {
          console.log("Admin flag found in localStorage");
          setIsAdmin(true);
          setLoading(false);
          return;
        }
        
        // Then check user object
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          if (user && user.isAdmin) {
            localStorage.setItem("isAdmin", "true"); // Set flag for future
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminUser();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <>
      <AdminAuthFallback />
      {isAdmin && <SidebarAdmin>{children}</SidebarAdmin>}
    </>
  );
}

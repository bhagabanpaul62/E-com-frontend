"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

export default function WishlistButton({
  productId,
  className = "",
  size = "default",
}) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if product is in wishlist on mount
  useEffect(() => {
    if (!productId) return;

    const checkWishlistStatus = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER}/api/wishlist/check/${productId}`,
          { withCredentials: true }
        );

        if (response.data && response.data.success && response.data.data) {
          setIsInWishlist(response.data.data.isInWishlist);
        }
      } catch (error) {
        console.error("Error checking wishlist status:", error);
        // Silent fail - default to not in wishlist
      } finally {
        setIsChecking(false);
      }
    };

    checkWishlistStatus();
  }, [productId]);

  const toggleWishlist = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isInWishlist) {
        // Remove from wishlist
        await axios.delete(
          `${process.env.NEXT_PUBLIC_SERVER}/api/wishlist/remove/${productId}`,
          { withCredentials: true }
        );
        setIsInWishlist(false);
        toast.success("Removed from wishlist");
      } else {
        // Add to wishlist
        await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER}/api/wishlist/add`,
          { productId },
          { withCredentials: true }
        );
        setIsInWishlist(true);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);

      // Handle unauthorized error
      if (error.response && error.response.status === 401) {
        toast.error("Please log in to manage your wishlist");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to update wishlist"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Size classes
  const sizeClasses = {
    sm: "p-2 rounded-md",
    default: "py-3 px-4 rounded-lg",
    lg: "py-4 px-6 rounded-xl",
  };

  const buttonSize = sizeClasses[size] || sizeClasses.default;

  return (
    <button
      onClick={toggleWishlist}
      disabled={isLoading || isChecking}
      className={`flex items-center justify-center space-x-2 bg-white border-2 ${
        isInWishlist
          ? "border-red-500 text-red-500"
          : "border-gray-300 text-gray-700"
      } hover:bg-gray-50 font-medium transition-colors ${buttonSize} ${className}`}
    >
      <Heart
        className={`${size === "sm" ? "h-4 w-4" : "h-5 w-5"}`}
        fill={isInWishlist ? "currentColor" : "none"}
      />
      {size !== "sm" && (
        <span>{isInWishlist ? "In Wishlist" : "Add to Wishlist"}</span>
      )}
    </button>
  );
}

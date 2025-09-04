"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart } from "@/redux/features/cart/cartSlice";
import { ShoppingCart } from "lucide-react";

export default function CartIcon() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { totalItems } = useSelector((state) => state.cart);

  useEffect(() => {
    // Fetch cart data when component mounts or user changes
    if (user) {
      dispatch(fetchCart());
    }

    // Set up periodic refresh of cart data
    const refreshInterval = setInterval(() => {
      if (user) {
        dispatch(fetchCart());
      }
    }, 15000); // Refresh every 15 seconds

    return () => clearInterval(refreshInterval);
  }, [dispatch, user]);

  return (
    <div className="relative">
      <div className="flex items-center text-gray-700">
        <ShoppingCart className="h-6 w-6" />
        {user && totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </div>
    </div>
  );
}

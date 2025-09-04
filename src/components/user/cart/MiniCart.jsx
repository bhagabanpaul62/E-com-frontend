"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeCartItem } from "@/redux/features/cart/cartSlice";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ShoppingBag, X } from "lucide-react";

export default function MiniCart({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { items, totalItems, totalPrice, loading } = useSelector(
    (state) => state.cart
  );
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user && isOpen) {
      dispatch(fetchCart());
    }
  }, [dispatch, isOpen, user]);

  const handleRemoveItem = (productId, variantId = null) => {
    dispatch(removeCartItem({ productId, variantId }));
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-medium">Your Cart ({totalItems})</h3>
        <button onClick={onClose} className="text-gray-500">
          <X className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="p-4 text-center">Loading...</div>
      ) : items.length === 0 ? (
        <div className="p-4 text-center">
          <div className="mx-auto w-12 h-12 mb-3">
            <ShoppingBag className="w-full h-full text-gray-300" />
          </div>
          <p>Your cart is empty</p>
        </div>
      ) : (
        <>
          <div className="max-h-80 overflow-y-auto">
            {items.map((item) => (
              <div
                key={`${item.product._id}-${item.variantId || "default"}`}
                className="p-4 border-b flex gap-2"
              >
                <div className="w-16 h-16 bg-gray-100 relative rounded overflow-hidden">
                  {item.product &&
                  item.product.images &&
                  item.product.images[0] ? (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name || "Product"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col">
                  <h4 className="font-medium line-clamp-1">
                    {item.product?.name || "Product"}
                  </h4>
                  <div className="text-sm text-gray-500">
                    {item.variantId && item.product?.variants ? (
                      <span>
                        {item.product.variants.find(
                          (v) => v._id === item.variantId
                        )?.name || "Variant"}
                      </span>
                    ) : item.variantId ? (
                      <span>Variant</span>
                    ) : null}
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span>
                      {item.quantity} × ${item.product?.price || 0}
                    </span>
                    <button
                      onClick={() =>
                        handleRemoveItem(item.product._id, item.variantId)
                      }
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span className="font-medium">${totalPrice.toFixed(2)}</span>
            </div>
            <Button
              className="w-full bg-amber-500 text-white hover:bg-amber-600 flex items-center justify-center gap-2"
              onClick={() => {
                onClose();
                window.location.href = "/cart";
              }}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>View Cart & Checkout</span>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

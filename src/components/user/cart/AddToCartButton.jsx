"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "@/redux/features/cart/cartSlice";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import CartQuantity from "./CartQuantity";

export default function AddToCartButton({ product, variantId = null }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!user) {
      // Redirect to login or show login modal
      alert("Please login to add items to cart");
      return;
    }

    dispatch(
      addItemToCart({
        productId: product._id,
        quantity,
        variantId: variantId,
      })
    );
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <CartQuantity
          quantity={quantity}
          onDecrease={decreaseQuantity}
          onIncrease={increaseQuantity}
          min={1}
          max={product.totalStock || 99}
        />
        <Button
          onClick={handleAddToCart}
          disabled={loading}
          className="flex-1 bg-amber-500 text-white hover:bg-amber-600 flex items-center justify-center space-x-2"
        >
          <ShoppingCart className="h-5 w-5" />
          <span>{loading ? "Adding..." : "Add to Cart"}</span>
        </Button>
      </div>
    </div>
  );
}

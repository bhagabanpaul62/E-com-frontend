"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "@/redux/features/cart/cartSlice";
import { Button } from "@/components/ui/button";

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
        <div className="flex items-center border rounded-md">
          <button
            onClick={decreaseQuantity}
            className="px-3 py-1 text-lg font-medium border-r"
            disabled={quantity <= 1}
          >
            -
          </button>
          <span className="px-4 py-1 text-lg font-medium">{quantity}</span>
          <button
            onClick={increaseQuantity}
            className="px-3 py-1 text-lg font-medium border-l"
          >
            +
          </button>
        </div>
        <Button
          onClick={handleAddToCart}
          disabled={loading}
          className="flex-1 bg-black text-white hover:bg-gray-800"
        >
          {loading ? "Adding..." : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}

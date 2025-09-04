"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "@/redux/features/cart/cartSlice";
import { Button } from "@/components/ui/button";
import CartQuantity from "./CartQuantity";
import { ShoppingBag, Trash2, ArrowLeft, AlertCircle } from "lucide-react";

export default function CartPage() {
  const dispatch = useDispatch();
  const { items, totalItems, totalPrice, loading } = useSelector(
    (state) => state.cart
  );
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [dispatch, user]);

  const handleUpdateQuantity = (productId, quantity, variantId = null) => {
    if (quantity < 1) return;
    dispatch(
      updateCartItem({
        productId,
        quantity,
        variantId,
      })
    );
  };

  const handleRemoveItem = (productId, variantId = null) => {
    dispatch(removeCartItem({ productId, variantId }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">
            Please log in to view your cart
          </h1>
          <Link href="/login">
            <Button className="bg-black text-white hover:bg-gray-800">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 mb-6">
            <ShoppingBag className="w-full h-full text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link href="/">
            <Button className="bg-amber-500 hover:bg-amber-600 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left">Product</th>
                    <th className="py-3 px-4 text-center">Price</th>
                    <th className="py-3 px-4 text-center">Quantity</th>
                    <th className="py-3 px-4 text-right">Subtotal</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr
                      key={`${item.product._id}-${item.variantId || "default"}`}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-4">
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
                          <div>
                            <h3 className="font-medium">
                              {item.product?.name || "Product"}
                            </h3>
                            {item.variantId && item.product?.variants && (
                              <div className="text-sm text-gray-500">
                                {item.product.variants.find(
                                  (v) => v._id === item.variantId
                                )?.name || "Variant"}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        ${(item.product?.price || 0).toFixed(2)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center">
                          <CartQuantity
                            quantity={item.quantity}
                            onDecrease={() =>
                              handleUpdateQuantity(
                                item.product._id,
                                item.quantity - 1,
                                item.variantId
                              )
                            }
                            onIncrease={() =>
                              handleUpdateQuantity(
                                item.product._id,
                                item.quantity + 1,
                                item.variantId
                              )
                            }
                            min={1}
                            max={item.product.totalStock || 99}
                          />
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() =>
                            handleRemoveItem(item.product._id, item.variantId)
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-between">
              <Button
                onClick={handleClearCart}
                variant="outline"
                className="border-gray-300 text-gray-700 flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Cart
              </Button>
              <Link href="/">
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <Link href="/checkout">
                <Button className="w-full bg-amber-500 text-white hover:bg-amber-600">
                  Proceed to Checkout
                </Button>
              </Link>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800 flex items-start">
                <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <p>
                  Prices and shipping costs are not confirmed until you've
                  reached checkout.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

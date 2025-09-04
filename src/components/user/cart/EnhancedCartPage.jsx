"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  addItemToCart,
} from "@/redux/features/cart/cartSlice";
import { Button } from "@/components/ui/button";
import CartQuantity from "./CartQuantity";
import {
  ShoppingBag,
  Trash2,
  ArrowLeft,
  AlertCircle,
  Heart,
  Check,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Package,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

export default function EnhancedCartPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items, totalItems, totalPrice, loading } = useSelector(
    (state) => state.cart
  );
  const { user } = useSelector((state) => state.user);
  const [savedForLater, setSavedForLater] = useState([]);
  const [expandedSection, setExpandedSection] = useState("all");

  // Estimated delivery date
  const standardDelivery = new Date();
  standardDelivery.setDate(standardDelivery.getDate() + 5);

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
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(refreshInterval);
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

  const handleSaveForLater = (item) => {
    setSavedForLater([...savedForLater, item]);
    handleRemoveItem(item.product._id, item.variantId);
  };

  const handleMoveToCart = (item, index) => {
    dispatch(
      addItemToCart({
        productId: item.product._id,
        quantity: item.quantity,
        variantId: item.variantId,
      })
    );
    const newSavedItems = [...savedForLater];
    newSavedItems.splice(index, 1);
    setSavedForLater(newSavedItems);
  };

  const handleGiftOptionChange = (e) => {
    setGiftOptions({
      ...giftOptions,
      isGift: e.target.checked,
    });
  };

  const handleGiftMessageChange = (e) => {
    setGiftOptions({
      ...giftOptions,
      giftMessage: e.target.value,
    });
  };

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection("all");
    } else {
      setExpandedSection(section);
    }
  };

  const calculateTotal = () => {
    let total = totalPrice;

    // Add shipping cost based on order value
    if (totalPrice < 2000) {
      total += 100; // Standard shipping fee
    }
    // Free shipping for orders ₹2000 and above

    // Add tax (GST: 18%)
  

    return {
      subtotal: totalPrice,
      shipping: totalPrice < 2000 ? 100 : 0,
      
      total: total,
    };
  };

  const totals = calculateTotal();

  // Mock recommended products based on cart items
  const recommendedProducts = [
    {
      id: "rec1",
      name: "Wireless Earbuds",
      price: 1999,
      image: "https://placehold.co/100x100/png",
      rating: 4.5,
      reviewCount: 1250,
    },
    {
      id: "rec2",
      name: "Phone Stand",
      price: 899,
      image: "https://placehold.co/100x100/png",
      rating: 4.2,
      reviewCount: 850,
    },
    {
      id: "rec3",
      name: "Fast Charging Cable",
      price: 599,
      image: "https://placehold.co/100x100/png",
      rating: 4.3,
      reviewCount: 975,
    },
  ];

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">
            Please log in to view your cart
          </h1>
          <Link href="/login">
            <Button className="bg-amber-500 text-white hover:bg-amber-600">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading your cart...</p>
        </div>
      ) : items.length === 0 && savedForLater.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm p-8">
          <div className="mx-auto w-24 h-24 mb-6">
            <ShoppingBag className="w-full h-full text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Your Amazon Cart is empty</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Your shopping cart lives to serve. Give it purpose — fill it with
            groceries, clothing, household supplies, electronics, and more.
          </p>
          <Link href="/">
            <Button className="bg-amber-500 hover:bg-amber-600 text-white">
              Continue Shopping
            </Button>
          </Link>
          {!user && (
            <div className="mt-6">
              <p className="text-sm mb-2">Already have an account?</p>
              <Link href="/login">
                <Button variant="outline" className="mx-2">
                  Sign in
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="outline" className="mx-2">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-2">
            {/* Main Cart Section */}
            {items.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">
                      Shopping Cart ({totalItems} items)
                    </h2>
                    <span className="text-sm text-gray-500">Price</span>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <div
                      key={`${item.product._id}-${item.variantId || "default"}`}
                      className="p-4 flex flex-col md:flex-row md:items-start"
                    >
                      <div className="w-24 h-24 bg-gray-100 relative rounded overflow-hidden flex-shrink-0 mx-auto md:mx-0">
                        {item.product.mainImage ? (
                          <Image
                            src={item.product.mainImage}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="flex-grow md:ml-4 mt-4 md:mt-0">
                        <div className="flex flex-col md:flex-row md:justify-between">
                          <div className="md:flex-grow">
                            <h3 className="font-medium text-lg">
                              <Link
                                href={`/product/${item.product._id}`}
                                className="hover:text-amber-600"
                              >
                                {item.product.name}
                              </Link>
                            </h3>

                            {item.product.stock > 0 ? (
                              <p className="text-sm text-green-600">In Stock</p>
                            ) : (
                              <p className="text-sm text-red-600">
                                Out of Stock
                              </p>
                            )}

                            {item.variantId && (
                              <div className="text-sm text-gray-500">
                                {item.product.variants?.find(
                                  (v) => v._id === item.variantId
                                )?.name || "Variant"}
                              </div>
                            )}

                            {item.product.discountPercentage > 0 && (
                              <div className="text-sm text-red-600 mt-1">
                                {item.product.discountPercentage}% off
                              </div>
                            )}

                            <div className="flex flex-wrap items-center gap-4 mt-2">
                              <div className="flex items-center">
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
                                  max={
                                    item.product.stock > 0
                                      ? item.product.stock
                                      : 99
                                  }
                                  size="small"
                                />
                              </div>

                              <div className="flex space-x-4">
                                <button
                                  onClick={() =>
                                    handleRemoveItem(
                                      item.product._id,
                                      item.variantId
                                    )
                                  }
                                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                  Delete
                                </button>
                                <button
                                  onClick={() => handleSaveForLater(item)}
                                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                                >
                                  <Heart className="w-3 h-3 mr-1" />
                                  Save for later
                                </button>
                              </div>
                            </div>

                            <div className="text-sm text-gray-600 mt-2">
                              <Clock className="w-3 h-3 inline mr-1" />
                              Arrives by{" "}
                              {standardDelivery.toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                          </div>

                          <div className="text-right mt-2 md:mt-0 font-medium">
                            ₹{(item.product.price * item.quantity).toFixed(0)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t bg-gray-50 text-right">
                  <div className="text-lg font-medium">
                    Subtotal ({totalItems} items):{" "}
                    <span className="font-bold">₹{totalPrice.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Saved For Later Section */}
            {savedForLater.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="p-4 border-b">
                  <h2 className="text-xl font-bold">
                    Saved for later ({savedForLater.length} items)
                  </h2>
                </div>

                <div className="divide-y divide-gray-200">
                  {savedForLater.map((item, index) => (
                    <div
                      key={`saved-${item.product._id}-${
                        item.variantId || "default"
                      }-${index}`}
                      className="p-4 flex flex-col md:flex-row md:items-start"
                    >
                      <div className="w-24 h-24 bg-gray-100 relative rounded overflow-hidden flex-shrink-0 mx-auto md:mx-0">
                        {item.product.mainImage ? (
                          <Image
                            src={item.product.mainImage}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="flex-grow md:ml-4 mt-4 md:mt-0">
                        <div className="flex flex-col md:flex-row md:justify-between">
                          <div className="md:flex-grow">
                            <h3 className="font-medium text-lg">
                              <Link
                                href={`/product/${item.product._id}`}
                                className="hover:text-amber-600"
                              >
                                {item.product.name}
                              </Link>
                            </h3>

                            {item.product.stock > 0 ? (
                              <p className="text-sm text-green-600">In Stock</p>
                            ) : (
                              <p className="text-sm text-red-600">
                                Out of Stock
                              </p>
                            )}

                            {item.variantId && (
                              <div className="text-sm text-gray-500">
                                {item.product.variants?.find(
                                  (v) => v._id === item.variantId
                                )?.name || "Variant"}
                              </div>
                            )}

                            <div className="mt-2">
                              <button
                                onClick={() => handleMoveToCart(item, index)}
                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                Move to cart
                              </button>
                            </div>
                          </div>

                          <div className="text-right mt-2 md:mt-0 font-medium">
                            ₹{item.product.price.toFixed(0)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Products */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-4 border-b">
                <h2 className="text-xl font-bold">
                  Recommended based on your shopping trends
                </h2>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4"></div>
              </div>
            </div>
          </div>

          {/* Order Summary Column */}
          {items.length > 0 && (
            <div className="lg:col-span-1">
              {/* Checkout Card */}
              <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
                <div className="mb-4">
                  {totals.subtotal > 0 && (
                    <div className="flex items-start mb-2">
                      <Check className="text-green-600 w-5 h-5 mr-2 flex-shrink-0 mt-1" />
                      <p className="text-sm">
                        Your order qualifies for FREE Shipping by choosing
                        Standard delivery at checkout.
                      </p>
                    </div>
                  )}
                </div>

                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span>Items ({totalItems}):</span>
                    <span>₹{totals.subtotal.toFixed(0)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping & handling:</span>
                    <span>
                      {totals.shipping > 0
                        ? `₹${totals.shipping.toFixed(0)}`
                        : "FREE"}
                    </span>
                  </div>

                  
                </div>

                <div className="border-t border-b py-2 mb-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Order total:</span>
                    <span>₹{totals.total.toFixed(0)}</span>
                  </div>
                </div>

                {/* Delivery information */}
                <div className="mb-6">
                  <h3 className="font-medium text-sm mb-2">
                    Delivery Information:
                  </h3>

                  <div className="space-y-2">
                    <div className="border rounded-md p-3 border-amber-500 bg-amber-50">
                      <div className="flex">
                        <Package className="w-5 h-5 mr-2 text-amber-500" />
                        <div>
                          <p className="font-medium">Standard Delivery</p>
                          <p className="text-xs text-gray-500">
                            Arrives by{" "}
                            {standardDelivery.toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-xs text-gray-700">
                            {totalPrice >= 2000 ? "FREE" : "₹100"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white mb-3"
                  onClick={() => router.push("/checkout")}
                >
                  Proceed to Checkout
                </Button>

                {/* Buyer protection info */}
                <div className="text-xs text-gray-600 flex items-start mt-4">
                  <ShieldCheck className="w-4 h-4 mr-2 flex-shrink-0" />
                  <p>
                    Items in your order are protected by our secure payment
                    system
                  </p>
                </div>
              </div>

              {/* Recently viewed items */}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

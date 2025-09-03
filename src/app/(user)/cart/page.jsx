"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Trash2,
  Heart,
  Plus,
  Minus,
  Star,
  Shield,
  Truck,
  Zap,
  AlertCircle,
  Tag,
  Info,
  X,
  Check,
  ArrowLeft,
} from "lucide-react";

const CartPage = () => {
  // Sample cart data
  const [cartItems, setCartItems] = useState([
    {
      _id: "1",
      productId: {
        name: "iPhone 15 Pro Max",
        brand: "Apple",
        image: "/api/placeholder/300/300",
        rating: 4.8,
        reviewCount: 12500,
        originalPrice: 159900,
        discount: 8,
      },
      variant: { Color: "Natural Titanium", Storage: "256GB" },
      price: 147100,
      quantity: 1,
      inStock: true,
      stockCount: 3,
      warranty: "1 Year Warranty",
      fastDelivery: true,
    },
    {
      _id: "2",
      productId: {
        name: "MacBook Pro 14-inch M3",
        brand: "Apple",
        image: "/api/placeholder/300/300",
        rating: 4.9,
        reviewCount: 8950,
        originalPrice: 199900,
        discount: 5,
      },
      variant: { Color: "Space Gray", RAM: "16GB", Storage: "512GB" },
      price: 189905,
      quantity: 1,
      inStock: true,
      stockCount: 15,
      warranty: "1 Year Warranty",
      fastDelivery: true,
    },
    {
      _id: "3",
      productId: {
        name: "Sony WH-1000XM5 Headphones",
        brand: "Sony",
        image: "/api/placeholder/300/300",
        rating: 4.7,
        reviewCount: 5420,
        originalPrice: 34990,
        discount: 12,
      },
      variant: { Color: "Black" },
      price: 30792,
      quantity: 2,
      inStock: false,
      stockCount: 0,
      warranty: "1 Year Warranty",
      fastDelivery: false,
    },
  ]);

  const [selectedItems, setSelectedItems] = useState(new Set(["1", "2"]));
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [showPromoInput, setShowPromoInput] = useState(false);

  // Sample promo codes
  const promoCodes = {
    SAVE10: { discount: 10, description: "10% off on orders above ₹50,000" },
    FIRST20: { discount: 20, description: "20% off for first-time buyers" },
    WELCOME15: { discount: 15, description: "15% off on electronics" },
  };

  // Calculations
  const subtotal = cartItems
    .filter((item) => selectedItems.has(item._id) && item.inStock)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const deliveryCharges = subtotal >= 1999 ? 0 : 99;
  const promoDiscount = appliedPromo
    ? Math.round((subtotal * appliedPromo.discount) / 100)
    : 0;
  const total = subtotal + deliveryCharges - promoDiscount;

  const allSelected =
    selectedItems.size === cartItems.filter((item) => item.inStock).length &&
    selectedItems.size > 0;

  // Handlers
  const toggleItemSelection = (itemId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(
        new Set(
          cartItems.filter((item) => item.inStock).map((item) => item._id)
        )
      );
    }
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((items) =>
      items.map((item) =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId) => {
    setCartItems((items) => items.filter((item) => item._id !== itemId));
    setSelectedItems((selected) => {
      const newSelected = new Set(selected);
      newSelected.delete(itemId);
      return newSelected;
    });
  };

  const removeSelectedItems = () => {
    setCartItems((items) =>
      items.filter((item) => !selectedItems.has(item._id))
    );
    setSelectedItems(new Set());
  };

  const moveToWishlist = (itemId) => {
    // Implementation for move to wishlist
    removeItem(itemId);
  };

  const moveSelectedToWishlist = () => {
    selectedItems.forEach((itemId) => moveToWishlist(itemId));
  };

  const applyPromoCode = () => {
    const promo = promoCodes[promoCode.toUpperCase()];
    if (promo) {
      setAppliedPromo({ code: promoCode.toUpperCase(), ...promo });
      setShowPromoInput(false);
      setPromoCode("");
    } else {
      alert("Invalid promo code");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
          <p className="text-lg text-gray-600 mt-4">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 lg:mb-8">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <Link
              href="/"
              className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Shopping Cart
              </h1>
              <p className="text-sm lg:text-base text-gray-600 mt-1">
                {cartItems.length} items in your cart
              </p>
            </div>
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex sm:hidden items-center space-x-2">
            <button
              onClick={removeSelectedItems}
              disabled={selectedItems.size === 0}
              className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 text-sm"
            >
              <Trash2 className="h-4 w-4" />
              <span>Remove ({selectedItems.size})</span>
            </button>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added anything to your cart yet. Start
              shopping to fill it up!
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl hover:from-amber-500 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4 lg:space-y-6 order-2 lg:order-1">
              {/* Select All */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 lg:p-4">
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 lg:space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 lg:w-5 lg:h-5 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
                    />
                    <span className="font-medium text-gray-900 text-sm lg:text-base">
                      Select All (
                      {cartItems.filter((item) => item.inStock).length} items)
                    </span>
                  </label>
                  <div className="hidden sm:flex items-center space-x-2 lg:space-x-4">
                    <button
                      onClick={removeSelectedItems}
                      disabled={selectedItems.size === 0}
                      className="flex items-center space-x-1 lg:space-x-2 px-2 lg:px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 text-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="hidden lg:inline">Remove Selected</span>
                    </button>
                    <button
                      onClick={moveSelectedToWishlist}
                      disabled={selectedItems.size === 0}
                      className="flex items-center space-x-1 lg:space-x-2 px-2 lg:px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 text-sm"
                    >
                      <Heart className="h-4 w-4" />
                      <span className="hidden lg:inline">Move to Wishlist</span>
                    </button>
                  </div>
                  <div className="flex sm:hidden items-center text-xs text-gray-600">
                    <span>{selectedItems.size} selected</span>
                  </div>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden ${
                      !item.inStock ? "opacity-75" : ""
                    }`}
                  >
                    <div className="p-3 lg:p-6">
                      {/* Mobile Layout */}
                      <div className="block lg:hidden">
                        {/* Top Row: Checkbox, Image, Basic Info */}
                        <div className="flex items-start space-x-3 mb-3">
                          <div className="pt-1">
                            <input
                              type="checkbox"
                              checked={selectedItems.has(item._id)}
                              onChange={() => toggleItemSelection(item._id)}
                              disabled={!item.inStock}
                              className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500 disabled:opacity-50"
                            />
                          </div>

                          <Link href={`/product/${item._id}`} className="relative block">
                            <img
                              src={item.productId.image}
                              alt={item.productId.name}
                              className="w-20 h-20 object-cover rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                            />
                            {!item.inStock && (
                              <div className="absolute inset-0 bg-red-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                                <span className="bg-red-500 text-white text-xs font-bold px-1 py-0.5 rounded">
                                  Out of Stock
                                </span>
                              </div>
                            )}
                            {item.fastDelivery && item.inStock && (
                              <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold px-1 py-0.5 rounded-full flex items-center">
                                <Zap className="h-2 w-2 mr-0.5" />
                                Fast
                              </div>
                            )}
                          </Link>

                          <div className="flex-1 min-w-0">
                            <Link 
                              href={`/product/${item._id}`}
                              className="block hover:text-amber-600 transition-colors"
                            >
                              <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1 hover:text-amber-600">
                                {item.productId.name}
                              </h3>
                            </Link>
                            <p className="text-amber-600 font-medium text-xs">
                              {item.productId.brand}
                            </p>

                            {/* Variant Info */}
                            {item.variant && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {Object.entries(item.variant).map(
                                  ([key, value]) => (
                                    <span
                                      key={key}
                                      className="bg-gray-100 text-gray-700 text-xs px-1.5 py-0.5 rounded"
                                    >
                                      {key}: {value}
                                    </span>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Price Row */}
                        <div className="flex items-center justify-between mb-3 px-7">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-gray-900">
                              ₹{item.price.toLocaleString()}
                            </span>
                            {item.productId.originalPrice > item.price && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{item.productId.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          {item.productId.discount > 0 && (
                            <div className="text-green-600 text-sm font-medium">
                              {item.productId.discount}% off
                            </div>
                          )}
                        </div>

                        {/* Features Row */}
                        <div className="flex items-center justify-between mb-3 px-7">
                          <div className="flex items-center space-x-3">
                            {item.warranty && (
                              <div className="flex items-center text-xs text-green-600">
                                <Shield className="h-3 w-3 mr-1" />
                                {item.warranty}
                              </div>
                            )}
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-amber-400 fill-current" />
                              <span className="text-xs font-medium text-gray-700 ml-1">
                                {item.productId.rating}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions Row */}
                        <div className="flex items-center justify-between px-7">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() =>
                                updateQuantity(item._id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1 || !item.inStock}
                              className="p-1.5 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-3 py-1.5 font-medium text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item._id, item.quantity + 1)
                              }
                              disabled={!item.inStock}
                              className="p-1.5 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => moveToWishlist(item._id)}
                              className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Heart className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => removeItem(item._id)}
                              className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Stock Warning */}
                        {item.inStock && item.stockCount <= 10 && (
                          <div className="flex items-center text-orange-600 text-xs mt-2 px-7">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Only {item.stockCount} left in stock
                          </div>
                        )}
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden lg:block">
                        <div className="flex items-start space-x-4">
                          {/* Checkbox */}
                          <div className="pt-2">
                            <input
                              type="checkbox"
                              checked={selectedItems.has(item._id)}
                              onChange={() => toggleItemSelection(item._id)}
                              disabled={!item.inStock}
                              className="w-5 h-5 text-amber-600 rounded border-gray-300 focus:ring-amber-500 disabled:opacity-50"
                            />
                          </div>

                          {/* Product Image */}
                          <Link href={`/product/${item._id}`} className="relative block">
                            <img
                              src={item.productId.image}
                              alt={item.productId.name}
                              className="w-24 h-24 object-cover rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                            />
                            {!item.inStock && (
                              <div className="absolute inset-0 bg-red-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                  Out of Stock
                                </span>
                              </div>
                            )}
                            {item.fastDelivery && item.inStock && (
                              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                                <Zap className="h-3 w-3 mr-1" />
                                Fast
                              </div>
                            )}
                          </Link>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <Link 
                                  href={`/product/${item._id}`}
                                  className="block hover:text-amber-600 transition-colors"
                                >
                                  <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 hover:text-amber-600">
                                    {item.productId.name}
                                  </h3>
                                </Link>
                                <p className="text-amber-600 font-medium text-sm">
                                  {item.productId.brand}
                                </p>

                                {/* Variant Info */}
                                {item.variant && (
                                  <div className="flex items-center space-x-2 mt-1">
                                    {Object.entries(item.variant).map(
                                      ([key, value]) => (
                                        <span
                                          key={key}
                                          className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                                        >
                                          {key}: {value}
                                        </span>
                                      )
                                    )}
                                  </div>
                                )}

                                {/* Warranty & Features */}
                                <div className="flex items-center space-x-4 mt-2">
                                  {item.warranty && (
                                    <div className="flex items-center text-xs text-green-600">
                                      <Shield className="h-3 w-3 mr-1" />
                                      {item.warranty}
                                    </div>
                                  )}
                                  {item.fastDelivery && (
                                    <div className="flex items-center text-xs text-blue-600">
                                      <Truck className="h-3 w-3 mr-1" />
                                      Fast Delivery
                                    </div>
                                  )}
                                </div>

                                {/* Rating */}
                                <div className="flex items-center space-x-2 mt-2">
                                  <div className="flex items-center">
                                    <Star className="h-4 w-4 text-amber-400 fill-current" />
                                    <span className="text-sm font-medium text-gray-700 ml-1">
                                      {item.productId.rating}
                                    </span>
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    (
                                    {item.productId.reviewCount.toLocaleString()}{" "}
                                    reviews)
                                  </span>
                                </div>
                              </div>

                              {/* Price Section */}
                              <div className="text-right ml-4">
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg font-bold text-gray-900">
                                    ₹{item.price.toLocaleString()}
                                  </span>
                                  {item.productId.originalPrice >
                                    item.price && (
                                    <span className="text-sm text-gray-500 line-through">
                                      ₹
                                      {item.productId.originalPrice.toLocaleString()}
                                    </span>
                                  )}
                                </div>
                                {item.productId.discount > 0 && (
                                  <div className="text-green-600 text-sm font-medium">
                                    {item.productId.discount}% off
                                  </div>
                                )}
                                <div className="text-xs text-gray-500 mt-1">
                                  ₹
                                  {(
                                    item.price * item.quantity
                                  ).toLocaleString()}{" "}
                                  total
                                </div>
                              </div>
                            </div>

                            {/* Stock Info */}
                            {item.inStock && item.stockCount <= 10 && (
                              <div className="flex items-center text-orange-600 text-sm mt-2">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                Only {item.stockCount} left in stock
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center space-x-4">
                                {/* Quantity Controls */}
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                  <button
                                    onClick={() =>
                                      updateQuantity(
                                        item._id,
                                        item.quantity - 1
                                      )
                                    }
                                    disabled={
                                      item.quantity <= 1 || !item.inStock
                                    }
                                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <span className="px-4 py-2 font-medium">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      updateQuantity(
                                        item._id,
                                        item.quantity + 1
                                      )
                                    }
                                    disabled={!item.inStock}
                                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => moveToWishlist(item._id)}
                                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Heart className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => removeItem(item._id)}
                                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary - Mobile appears first, Desktop appears second */}
            <div className="lg:col-span-1 order-1 lg:order-2">
              <div className="sticky top-20 lg:top-24 space-y-4 lg:space-y-6">
                {/* Price Details */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Price Details
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm lg:text-base">
                        Price ({selectedItems.size} items)
                      </span>
                      <span className="font-medium">
                        ₹{subtotal.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm lg:text-base">
                        Delivery Charges
                      </span>
                      <span
                        className={`font-medium ${
                          deliveryCharges === 0 ? "text-green-600" : ""
                        }`}
                      >
                        {deliveryCharges === 0 ? "FREE" : `₹${deliveryCharges}`}
                      </span>
                    </div>

                    {appliedPromo && (
                      <div className="flex justify-between items-center text-green-600">
                        <span className="text-sm lg:text-base">
                          Coupon Discount
                        </span>
                        <span className="font-medium">
                          -₹{promoDiscount.toLocaleString()}
                        </span>
                      </div>
                    )}

                    {subtotal < 1999 && deliveryCharges > 0 && (
                      <div className="bg-blue-50 text-blue-700 text-sm p-3 rounded-lg">
                        <div className="flex items-center">
                          <Info className="h-4 w-4 mr-2" />
                          Add ₹{(1999 - subtotal).toLocaleString()} more to get
                          FREE delivery
                        </div>
                      </div>
                    )}

                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total Amount</span>
                        <span className="text-amber-600">
                          ₹{total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Promo Code
                    </h3>
                    <Tag className="h-5 w-5 text-amber-600" />
                  </div>

                  {appliedPromo ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-green-800">
                            {appliedPromo.code}
                          </div>
                          <div className="text-sm text-green-600">
                            {appliedPromo.description}
                          </div>
                        </div>
                        <button
                          onClick={() => setAppliedPromo(null)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {showPromoInput ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            placeholder="Enter promo code"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm lg:text-base"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={applyPromoCode}
                              className="flex-1 bg-amber-400 text-white py-2 rounded-lg hover:bg-amber-500 transition-colors font-medium text-sm lg:text-base"
                            >
                              Apply
                            </button>
                            <button
                              onClick={() => setShowPromoInput(false)}
                              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm lg:text-base"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowPromoInput(true)}
                          className="w-full border-2 border-dashed border-amber-300 text-amber-600 py-3 rounded-lg hover:border-amber-400 hover:bg-amber-50 transition-colors font-medium text-sm lg:text-base"
                        >
                          + Apply Promo Code
                        </button>
                      )}
                    </>
                  )}
                </div>

                {/* Checkout Button */}
                <button
                  disabled={selectedItems.size === 0}
                  className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white py-3 lg:py-4 rounded-xl font-semibold text-base lg:text-lg hover:from-amber-500 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {selectedItems.size === 0
                    ? "Select items to checkout"
                    : `Proceed to Checkout (${selectedItems.size} items)`}
                </button>

                {/* Safe Shopping */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 lg:h-6 w-5 lg:w-6 text-green-600" />
                    <div>
                      <div className="font-semibold text-gray-900 text-sm lg:text-base">
                        Safe & Secure
                      </div>
                      <div className="text-xs lg:text-sm text-gray-600">
                        100% secure checkout
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;

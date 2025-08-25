// Simplified modern e-commerce product card
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHeart, FaRegHeart, FaStar, FaShoppingCart } from "react-icons/fa";

function ProductCard({
  product,
  className = "",
  view = "grid",
  compact = false,
  onAddToCart,
  onToggleWishlist,
}) {
  const isListView = view === "list";
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Price calculations
  const basePrice = product?.price || 0;
  const mrpPrice = product?.mrpPrice || 0;
  const discountPercentage = useMemo(() => {
    if (product?.discount) return product.discount;
    if (mrpPrice > basePrice && mrpPrice > 0) {
      return Math.round(((mrpPrice - basePrice) / mrpPrice) * 100);
    }
    return 0;
  }, [product?.discount, mrpPrice, basePrice]);

  const displayImage = product?.mainImage || product?.images?.[0] || "";

  const renderStars = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);

    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i < fullStars ? "text-yellow-400" : "text-gray-300"}
        />
      );
    }
    return stars;
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    onToggleWishlist?.(product, !isWishlisted);
  };

  const addToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
  };

  if (isListView) {
    return (
      <Link href={`/product/${product?._id}`} className="block">
        <div
          className={`bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 p-4 ${className}`}
        >
          <div className="flex gap-4">
            {/* Image */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
              {displayImage ? (
                <Image
                  src={displayImage}
                  alt={product?.name || "Product"}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-2xl">�</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
                {product?.name}
              </h3>

              {/* Rating */}
              {product?.averageRating > 0 && (
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex text-sm">
                    {renderStars(product.averageRating)}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({product?.totalReview || 0})
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-semibold text-gray-900">
                  ₹{basePrice?.toLocaleString()}
                </span>
                {mrpPrice > basePrice && (
                  <>
                    <span className="text-sm text-gray-500 line-through">
                      ₹{mrpPrice?.toLocaleString()}
                    </span>
                    <span className="text-sm text-orange-600 font-medium">
                      {discountPercentage}% off
                    </span>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={addToCart}
                  className="px-4 py-2 bg-amber-500 text-white text-sm rounded-md hover:bg-amber-600 transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={toggleWishlist}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  {isWishlisted ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid View
  return (
    <Link href={`/product/${product?._id}`} className="block group">
      <div
        className={`bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 ${
          compact ? "h-auto" : "h-full"
        } ${className}`}
      >
        {/* Image Container */}
        <div
          className={`relative bg-gray-50 overflow-hidden ${
            compact ? "aspect-square" : "aspect-[4/3]"
          }`}
        >
          {displayImage ? (
            <Image
              src={displayImage}
              alt={product?.name || "Product"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-4xl">📦</span>
            </div>
          )}

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-md font-medium">
              {discountPercentage}% OFF
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all opacity-0 group-hover:opacity-100"
          >
            {isWishlisted ? (
              <FaHeart className="text-red-500 text-sm" />
            ) : (
              <FaRegHeart className="text-gray-600 text-sm" />
            )}
          </button>

          {/* Out of Stock Overlay */}
          {product?.totalStock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-gray-900 px-3 py-1 rounded-md font-medium text-sm">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className={`p-3 ${compact ? "space-y-2" : "space-y-3"}`}>
          {/* Brand */}
          {product?.brand && (
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
              {product.brand}
            </p>
          )}

          {/* Product Name */}
          <h3
            className={`font-medium text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors ${
              compact ? "text-sm" : "text-base"
            }`}
          >
            {product?.name}
          </h3>

          {/* Rating */}
          {product?.averageRating > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex text-xs">
                {renderStars(product.averageRating)}
              </div>
              <span className="text-xs text-gray-500">
                {product.averageRating?.toFixed(1)} ({product?.totalReview || 0}
                )
              </span>
            </div>
          )}

          {/* Price */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`font-bold text-gray-900 ${
                  compact ? "text-base" : "text-lg"
                }`}
              >
                ₹{basePrice?.toLocaleString()}
              </span>
              {mrpPrice > basePrice && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{mrpPrice?.toLocaleString()}
                </span>
              )}
            </div>
            {discountPercentage > 0 && (
              <p className="text-xs text-orange-600 font-medium">
                Save ₹{(mrpPrice - basePrice)?.toLocaleString()} (
                {discountPercentage}% off)
              </p>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center justify-between">
            <span
              className={`text-xs ${
                product?.totalStock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product?.totalStock > 0 ? "In Stock" : "Out of Stock"}
            </span>
            {product?.averageRating > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Rated {product.averageRating?.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={addToCart}
            disabled={product?.totalStock === 0}
            className="w-full py-2.5 px-4 bg-amber-500 text-white text-sm font-medium rounded-md hover:bg-amber-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <FaShoppingCart className="text-sm" />
            {product?.totalStock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </Link>
  );
}
export default ProductCard;

export function ProductCardSkeleton({ view = "grid", compact = false }) {
  const isListView = view === "list";

  if (isListView) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
        <div className="flex gap-4">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-lg"></div>
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-8 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
      <div
        className={`bg-gray-200 ${compact ? "aspect-square" : "aspect-[4/3]"}`}
      ></div>
      <div className="p-3 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-9 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

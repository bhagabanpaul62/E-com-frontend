"use client";

import Link from "next/link";
import Image from "next/image";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { useState } from "react";

const FlipkartProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const calculateDiscount = () => {
    if (product.mrpPrice && product.price) {
      return Math.round(
        ((product.mrpPrice - product.price) / product.mrpPrice) * 100
      );
    }
    return product.discount || 0;
  };

  const discountPercent = calculateDiscount();

  return (
    <Link href={`/product/${product._id}`} className="group block">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 h-full">
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          <Image
            src={product.mainImage || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-green-600 text-white text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
              {discountPercent}% OFF
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsWishlisted(!isWishlisted);
            }}
            className="absolute top-1 sm:top-2 right-1 sm:right-2 p-1.5 sm:p-2 bg-white/90 hover:bg-white rounded-full transition-colors duration-200 shadow-sm"
          >
            {isWishlisted ? (
              <FaHeart className="text-red-500 text-xs sm:text-sm" />
            ) : (
              <FaRegHeart className="text-gray-400 text-xs sm:text-sm" />
            )}
          </button>
        </div>

        {/* Product Info */}
        <div className="p-2 sm:p-3 space-y-1 sm:space-y-2">
          {/* Brand/Category */}
          {product.brand && (
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              {product.brand}
            </p>
          )}

          {/* Product Name */}
          <h3 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
            {product.name}
          </h3>

          {/* Rating */}
          {product.averageRating > 0 && (
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="flex items-center space-x-1 bg-green-600 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs">
                <span>{product.averageRating.toFixed(1)}</span>
                <FaStar className="text-xs" />
              </div>
              <span className="text-xs text-gray-500 hidden sm:inline">
                ({product.totalReviews || 0})
              </span>
            </div>
          )}

          {/* Price Section */}
          <div className="space-y-0.5 sm:space-y-1">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <span className="text-sm sm:text-lg font-semibold text-gray-900">
                ₹{product.price?.toLocaleString()}
              </span>
              {product.mrpPrice && product.mrpPrice > product.price && (
                <span className="text-xs sm:text-sm text-gray-500 line-through">
                  ₹{product.mrpPrice?.toLocaleString()}
                </span>
              )}
            </div>

            {/* Additional Info */}
            <div className="flex items-center space-x-1 sm:space-x-2 text-xs">
              {product.freeShipping && (
                <span className="text-green-600 font-medium">
                  Free Shipping
                </span>
              )}
              {product.fastDelivery && (
                <span className="text-chart-2 font-medium">Fast Delivery</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const ProductGrid = ({
  products = [],
  title,
  viewAllLink,
  maxItems = 6,
  gridCols = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
}) => {
  if (products.length === 0) return null;

  return (
    <div className="bg-white">
      {title && (
        <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              {title}
            </h2>
            {viewAllLink && (
              <Link
                href={viewAllLink}
                className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium flex items-center space-x-1 transition-colors"
              >
                <span className="hidden sm:inline">VIEW ALL</span>
                <span className="sm:hidden">All</span>
                <FaStar className="text-xs" />
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className={`grid ${gridCols} gap-2 sm:gap-3 lg:gap-4`}>
          {products.slice(0, maxItems).map((product) => (
            <FlipkartProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaHeart,
  FaRegHeart,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaShoppingCart,
  FaEye,
  FaTags,
  FaFire,
  FaShippingFast,
  FaUndoAlt,
} from "react-icons/fa";

function ProductCard({ product, className = "", isListView = false }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.find((v) => v.isDefault) || product?.variants?.[0]
  );

  // Calculate discount percentage
  const discountPercentage = product?.discount || 0;

  // Get display price (from selected variant or main product)
  const displayPrice = selectedVariant?.price || product?.price || 0;
  const mrpPrice = product?.mrpPrice || 0;

  // Get display image (from selected variant or main product)
  const displayImage = selectedVariant?.images?.[0] || product?.mainImage || "";

  // Calculate average rating display
  const renderStars = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-chart-1" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-chart-1" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-muted" />);
    }

    return stars;
  };

  // Toggle wishlist
  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    // Here you can add API call to update wishlist
  };

  // Add to cart handler
  const addToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Here you can add API call to add to cart
    console.log("Adding to cart:", {
      productId: product?._id,
      variantId: selectedVariant?.sku,
      quantity: 1,
    });
  };

  const cardContent = (
    <div
      className={`bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group hover:border-primary/50 ${
        isListView ? "flex" : ""
      } ${className}`}
    >
      {/* Product Image Section */}
      <div
        className={`relative bg-muted ${
          isListView ? "w-64 h-64" : "w-full h-72"
        } overflow-hidden`}
      >
        {displayImage ? (
          <Image
            src={displayImage}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            alt={product?.name}
            sizes={isListView ? "256px" : "(max-width: 768px) 100vw, 33vw"}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <div className="text-4xl mb-2">📷</div>
              <div className="text-sm">No Image</div>
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 space-y-1">
          {product?.isFeatured ? (
            <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-bold flex items-center">
              <FaFire className="mr-1" />
              Featured
            </span>
          ) : null}
          {product?.isNewArrival ? (
            <span className="bg-chart-2 text-white px-2 py-1 rounded text-xs font-bold">
              New
            </span>
          ) : null}
          {product?.isTrending ? (
            <span className="bg-chart-1 text-white px-2 py-1 rounded text-xs font-bold">
              Trending
            </span>
          ) : null}
          {product?.isSale ? (
            <span className="bg-destructive text-white px-2 py-1 rounded text-xs font-bold">
              Sale
            </span>
          ) : null}
          {discountPercentage > 0 ? (
            <span className="bg-destructive text-white px-2 py-1 rounded text-xs font-bold">
              {discountPercentage}% OFF
            </span>
          ) : null}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={toggleWishlist}
            className="p-2 bg-card/95 backdrop-blur-sm rounded-full shadow-sm hover:bg-primary hover:text-primary-foreground transition-colors border border-border"
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isWishlisted ? (
              <FaHeart className="text-destructive text-sm" />
            ) : (
              <FaRegHeart className="text-muted-foreground text-sm" />
            )}
          </button>
          <button
            className="p-2 bg-card/95 backdrop-blur-sm rounded-full shadow-sm hover:bg-primary hover:text-primary-foreground transition-colors border border-border"
            title="Quick view"
          >
            <FaEye className="text-muted-foreground text-sm" />
          </button>
        </div>

        {/* Stock Status Overlay */}
        {product?.totalStock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg font-bold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Details Section */}
      <div className={`p-4 ${isListView ? "flex-1" : ""}`}>
        <div className="space-y-3">
          {/* Category & Brand */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground uppercase tracking-wide">
              {typeof product?.categoryId === "object"
                ? product?.categoryId.name
                : "Category"}
            </span>
            {product?.brand && (
              <span className="text-primary font-medium">{product?.brand}</span>
            )}
          </div>

          {/* Product Name */}
          <h3
            className={`font-semibold text-card-foreground group-hover:text-primary transition-colors ${
              isListView ? "text-lg" : "text-sm"
            } line-clamp-2`}
          >
            {product?.name}
          </h3>

          {/* Rating & Reviews */}
          {product?.averageRating > 0 && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-xs">
                {renderStars(product?.averageRating)}
              </div>
              <span className="text-xs text-muted-foreground">
                {product?.averageRating?.toFixed(1)} (
                {product?.totalReview || 0} reviews)
              </span>
            </div>
          )}

          {/* Price Section */}
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span
                className={`font-bold text-card-foreground ${
                  isListView ? "text-xl" : "text-lg"
                }`}
              >
                ₹{displayPrice?.toLocaleString()}
              </span>
              {mrpPrice > displayPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{mrpPrice?.toLocaleString()}
                </span>
              )}
            </div>
            {discountPercentage > 0 && (
              <div className="text-xs text-chart-2 font-medium">
                You save ₹{(mrpPrice - displayPrice)?.toLocaleString()} (
                {discountPercentage}%)
              </div>
            )}
          </div>

          {/* Variants (if available) */}
          {product?.variants && product?.variants.length > 1 && (
            <div className="space-y-2">
              <span className="text-xs text-muted-foreground">Variants:</span>
              <div className="flex flex-wrap gap-1">
                {product?.variants.slice(0, 3).map((variant, index) => (
                  <button
                    key={variant.sku || index}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedVariant(variant);
                    }}
                    className={`px-2 py-1 text-xs border rounded ${
                      selectedVariant?.sku === variant.sku
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary"
                    }`}
                  >
                    {variant.attributes?.color ||
                      variant.attributes?.size ||
                      `Variant ${index + 1}`}
                  </button>
                ))}
                {product?.variants.length > 3 && (
                  <span className="text-xs text-muted-foreground px-2 py-1">
                    +{product?.variants.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Features */}
          <div className="space-y-1">
            {/* Stock Status */}
            <div className="flex items-center space-x-2 text-xs">
              <span
                className={
                  product?.totalStock > 0 ? "text-chart-2" : "text-destructive"
                }
              >
                {product?.totalStock > 0
                  ? `In Stock (${product?.totalStock})`
                  : "Out of Stock"}
              </span>
            </div>

            {/* Shipping Info */}
            {product?.shippingDetails?.shippingOption?.[0] && (
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <FaShippingFast />
                <span>
                  Free delivery in{" "}
                  {product?.shippingDetails.shippingOption[0].estimatedDays ||
                    "5-7"}{" "}
                  days
                </span>
              </div>
            )}

            {/* Return Policy */}
            {product?.returnPolicy?.isReturnable && (
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <FaUndoAlt />
                <span>
                  {product?.returnPolicy.isReturnDays || 7} days return policy
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          {product?.tags && product?.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product?.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground"
                >
                  <FaTags className="mr-1 text-xs" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={addToCart}
            disabled={product?.totalStock === 0}
            className="w-full mt-4 bg-primary text-primary-foreground py-2.5 px-4 rounded-lg font-medium hover:bg-primary/90 hover:shadow-md active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:active:scale-100 flex items-center justify-center space-x-2 border border-primary"
          >
            <FaShoppingCart className="text-sm" />
            <span>
              {product?.totalStock === 0 ? "Out of Stock" : "Add to Cart"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Link href={`/product/${product?._id}`} className="block">
      {cardContent}
    </Link>
  );
}

export default ProductCard;

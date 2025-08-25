"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  FaArrowLeft,
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaShippingFast,
  FaUndoAlt,
  FaShareAlt,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import ProductCard from "@/components/user/product/ProductCard";

const ProductDetailPage = () => {
  const params = useParams();
  const productId = params.id;

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  useEffect(() => {
    if (product) {
      // Set initial variant
      const defaultVariant =
        product.variants?.find((v) => v.isDefault) || product.variants?.[0];
      setSelectedVariant(defaultVariant);

      // Fetch related products
      if (product.categoryId) {
        fetchRelatedProducts();
      }
    }
  }, [product]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/users/product/${productId}`
      );

      if (!response.ok) {
        throw new Error("Product not found");
      }

      const data = await response.json();
      if (data.success) {
        setProduct(data.data);
      } else {
        setError("Failed to load product details");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const categoryId =
        typeof product.categoryId === "object"
          ? product.categoryId._id
          : product.categoryId;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/users/product/category/${categoryId}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Filter out current product and limit to 6 related products
          const filtered = data.data
            .filter((p) => p._id !== productId)
            .slice(0, 6);
          setRelatedProducts(filtered);
        }
      }
    } catch (err) {
      console.error("Failed to fetch related products:", err);
    }
  };

  const renderStars = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-500" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-500" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);
    }

    return stars;
  };

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log("Adding to cart:", {
      product,
      variant: selectedVariant,
      quantity,
    });
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // Wishlist toggle logic here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Product not found"}</p>
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const displayPrice = selectedVariant?.price || product.price || 0;
  const mrpPrice = selectedVariant?.mrpPrice || product.mrpPrice || 0;
  const discountPercentage =
    mrpPrice > displayPrice && mrpPrice > 0
      ? Math.round(((mrpPrice - displayPrice) / mrpPrice) * 100)
      : product.discount || 0;

  const productImages = selectedVariant?.images ||
    product.images || [product.mainImage];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href={`/category/${
                typeof product.categoryId === "object"
                  ? product.categoryId._id
                  : product.categoryId
              }`}
              className="text-blue-600 hover:text-blue-700"
            >
              {typeof product.categoryId === "object"
                ? product.categoryId.name
                : "Category"}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={productImages[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Image Thumbnails */}
              {productImages.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index
                          ? "border-blue-600"
                          : "border-gray-200"
                      }`}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Product Title & Brand */}
              <div>
                {product.brand && (
                  <p className="text-blue-600 font-medium mb-2">
                    {product.brand}
                  </p>
                )}
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {product.name}
                </h1>
              </div>

              {/* Rating & Reviews */}
              {product.averageRating > 0 && (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    {renderStars(product.averageRating)}
                  </div>
                  <span className="text-gray-600">
                    {product.averageRating.toFixed(1)} (
                    {product.totalReview || 0} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{displayPrice.toLocaleString()}
                  </span>
                  {mrpPrice > displayPrice && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        ₹{mrpPrice.toLocaleString()}
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                        {discountPercentage}% OFF
                      </span>
                    </>
                  )}
                </div>
                {discountPercentage > 0 && (
                  <p className="text-green-600 text-sm">
                    You save ₹{(mrpPrice - displayPrice).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Variants */}
              {product.variants && product.variants.length > 1 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">
                    Available Options:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant, index) => (
                      <button
                        key={variant.sku || index}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-4 py-2 rounded-lg border ${
                          selectedVariant?.sku === variant.sku
                            ? "border-blue-600 bg-blue-50 text-blue-600"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {variant.attributes?.color &&
                          `${variant.attributes.color} `}
                        {variant.attributes?.size &&
                          `${variant.attributes.size}`}
                        {!variant.attributes?.color &&
                          !variant.attributes?.size &&
                          `Option ${index + 1}`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                    (selectedVariant?.stock || product.totalStock) > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {(selectedVariant?.stock || product.totalStock) > 0
                    ? `In Stock (${
                        selectedVariant?.stock || product.totalStock
                      })`
                    : "Out of Stock"}
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100"
                  >
                    <FaMinus className="text-sm" />
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100"
                  >
                    <FaPlus className="text-sm" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={
                    (selectedVariant?.stock || product.totalStock) === 0
                  }
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <FaShoppingCart />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={toggleWishlist}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2"
                >
                  {isWishlisted ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart />
                  )}
                  <span>Wishlist</span>
                </button>
              </div>

              {/* Product Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                {product.shippingDetails?.shippingOption?.[0] && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FaShippingFast className="text-green-600" />
                    <span>
                      Free delivery in{" "}
                      {product.shippingDetails.shippingOption[0]
                        .estimatedDays || "5-7"}{" "}
                      days
                    </span>
                  </div>
                )}
                {product.returnPolicy?.isReturnable && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FaUndoAlt className="text-blue-600" />
                    <span>
                      {product.returnPolicy.returnDays || 7} days return policy
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Description */}
          {product.description && (
            <div className="border-t border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Product Description
              </h3>
              <div className="prose max-w-none text-gray-700">
                {product.description.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-3">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct._id}
                  product={relatedProduct}
                  view="grid"
                  compact={true}
                  showVariants={false}
                  showTags={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;

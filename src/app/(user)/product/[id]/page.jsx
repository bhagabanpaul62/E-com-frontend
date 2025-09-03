"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Plus,
  Minus,
  ArrowLeft,
  Shield,
  Truck,
  RotateCcw,
  CreditCard,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Package,
  Users,
} from "lucide-react";
import axios from "axios";
import Review from "@/components/user/product/Review";

const ProductPage = () => {
  const params = useParams();
  const productId = params.id;

  // Product state
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product data from API
  async function getProduct() {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/users/product/${productId}`
      );

      // API returns data in format: res.data.data
      if (res.data && res.data.data) {
        console.log("Product data:", res.data.data);
        setProduct(res.data.data);
      } else {
        setError("Product data structure is invalid");
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError(err.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProduct();
  }, [productId]);

  // UI state
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0); // Default to first variant
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showAllSpecs, setShowAllSpecs] = useState(false);

  // Sample reviews data - In a real app, this would come from API
  const [reviews] = useState([
    {
      id: 1,
      user: "Rajesh Kumar",
      rating: 5,
      date: "2024-03-15",
      title: "Excellent product",
      comment: "The quality is outstanding. Very satisfied with my purchase.",
      helpful: 45,
      verified: true,
    },
    {
      id: 2,
      user: "Priya Sharma",
      rating: 4,
      date: "2024-03-10",
      title: "Great value for money",
      comment: "Good quality product at a reasonable price. Would recommend.",
      helpful: 32,
      verified: true,
    },
    {
      id: 3,
      user: "Amit Patel",
      rating: 5,
      date: "2024-03-08",
      title: "Worth every penny",
      comment:
        "Exceeded my expectations in every way. Very happy with this purchase.",
      helpful: 28,
      verified: false,
    },
  ]);

  // Get the currently selected variant
  const getSelectedVariant = () => {
    console.log("DEBUG getSelectedVariant: product =", product);
    console.log(
      "DEBUG getSelectedVariant: selectedVariantIndex =",
      selectedVariantIndex
    );

    if (!product) {
      console.log("DEBUG getSelectedVariant: No product");
      return null;
    }

    if (!product.variants) {
      console.log("DEBUG getSelectedVariant: No variants array");
      return null;
    }

    if (!Array.isArray(product.variants) || product.variants.length === 0) {
      console.log("DEBUG getSelectedVariant: Empty variants array");
      return null;
    }

    const variant = product.variants[selectedVariantIndex];
    console.log("DEBUG getSelectedVariant: Selected variant =", variant);
    return variant;
  };

  // Calculate current price based on selected variant
  const getCurrentPrice = () => {
    const variant = getSelectedVariant();
    return variant && variant.price ? variant.price : product?.price || 0;
  };

  // Get all images (main image + variant images)
  const getAllImages = () => {
    console.log("DEBUG getAllImages: product =", product);

    // If product isn't loaded yet, return placeholder
    if (!product) {
      console.log("DEBUG getAllImages: product is null, returning placeholder");
      return ["/placeholder-image.jpg"];
    }

    const images = [];

    // Add main product image
    if (product.mainImage) {
      console.log("DEBUG getAllImages: adding main image", product.mainImage);
      images.push(product.mainImage);
    }

    // Add variant images if available
    const variant = getSelectedVariant();
    console.log("DEBUG getAllImages: selected variant =", variant);

    if (variant && Array.isArray(variant.images)) {
      console.log("DEBUG getAllImages: variant images =", variant.images);
      // Only add valid image URLs
      variant.images.forEach((img) => {
        if (img) images.push(img);
      });
    } else {
      console.log("DEBUG getAllImages: variant has no images array");
    }

    console.log("DEBUG getAllImages: final images array =", images);
    return images.length > 0 ? images : ["/placeholder-image.jpg"]; // Fallback image
  };

  const handleVariantChange = (index) => {
    setSelectedVariantIndex(index);
    setSelectedImageIndex(0); // Reset to first image when changing variant
  };

  const handleAddToCart = () => {
    // Add to cart logic
    const variant = getSelectedVariant();
    console.log("Adding to cart:", {
      productId,
      variantId: variant?._id,
      attributes: variant?.attributes,
      price: getCurrentPrice(),
      quantity,
    });
    // Show success message or redirect to cart
  };

  const handleBuyNow = () => {
    // Buy now logic
    const variant = getSelectedVariant();
    console.log("Buy now:", {
      productId,
      variantId: variant?._id,
      attributes: variant?.attributes,
      price: getCurrentPrice(),
      quantity,
    });
    // Redirect to checkout
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const renderStars = (rating = 0) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating || 0)
            ? "text-amber-400 fill-current"
            : i < (rating || 0)
            ? "text-amber-400 fill-current opacity-50"
            : "text-gray-300"
        }`}
      />
    ));

  // Format attributes from object to display string
  const formatAttributes = (attributes) => {
    if (!attributes || typeof attributes !== "object") {
      return "";
    }

    return Object.entries(attributes)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
          <p className="text-lg text-gray-600 mt-4">Loading product...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-amber-600">
            <AlertCircle className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-4">
            Product Not Found
          </h2>
          <p className="text-gray-600 mt-2">
            {error || "The product you're looking for could not be found."}
          </p>
          <Link
            href="/"
            className="mt-6 inline-block bg-amber-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-600"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900 truncate">
                {product.name}
              </h1>
              <p className="text-sm text-gray-600">{product.brand}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleWishlist}
                className={`p-2 rounded-lg transition-colors ${
                  isWishlisted
                    ? "text-red-600 bg-red-50"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Heart
                  className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`}
                />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <img
                src={
                  (getAllImages() && getAllImages()[selectedImageIndex]) ||
                  "/placeholder-image.jpg"
                }
                alt={product?.name || "Product"}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-5 gap-2">
              {getAllImages() &&
              Array.isArray(getAllImages()) &&
              getAllImages().length > 0 ? (
                getAllImages().map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-amber-400 ring-2 ring-amber-400 ring-opacity-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image || "/placeholder-image.jpg"}
                      alt={`${product?.name || "Product"} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))
              ) : (
                <div>No images available</div>
              )}
            </div>

            {/* Product Badges */}
            <div className="flex flex-wrap gap-2">
              {Array.isArray(product?.shippingDetails?.shippingOption) &&
                product.shippingDetails.shippingOption.some(
                  (option) => option.shippingType === "Express"
                ) && (
                  <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    <Zap className="h-4 w-4 mr-1" />
                    Fast Delivery
                  </div>
                )}
              {Array.isArray(product?.shippingDetails?.shippingOption) &&
                product.shippingDetails.shippingOption.some(
                  (option) => option.cost === 0
                ) && (
                  <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    <Truck className="h-4 w-4 mr-1" />
                    Free Delivery
                  </div>
                )}
              {product?.isFeatured && (
                <div className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  <Award className="h-4 w-4 mr-1" />
                  Featured
                </div>
              )}
              {product?.isNewArrival && (
                <div className="flex items-center bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                  <Package className="h-4 w-4 mr-1" />
                  New Arrival
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {product?.name || "Product Name"}
              </h1>
              <p className="text-lg text-amber-600 font-semibold mb-4">
                {product?.brand || "Brand"}
              </p>
              <p className="text-gray-600 text-sm lg:text-base">
                {product?.description || "No description available"}
              </p>
            </div>

            {/* Rating & Reviews - Using sample data since actual reviews aren't in the API yet */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {renderStars(4.5)} {/* Sample rating */}
                <span className="text-sm font-medium text-gray-900 ml-1">
                  4.5
                </span>
              </div>
              <div className="text-sm text-gray-600">
                ({reviews.length} reviews)
              </div>
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                {Math.floor(reviews.length * 0.85)}+ verified purchases
              </div>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{getCurrentPrice().toLocaleString()}
                </span>
                {product?.mrpPrice && product.mrpPrice > getCurrentPrice() && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      ₹{product.mrpPrice.toLocaleString()}
                    </span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm font-medium">
                      {product?.discount ||
                        (
                          ((product.mrpPrice - getCurrentPrice()) /
                            product.mrpPrice) *
                          100
                        ).toFixed(0)}
                      % OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Inclusive of all taxes
              </p>
            </div>

            {/* Variants */}
            {product?.variants &&
              Array.isArray(product.variants) &&
              product.variants.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Product Variants
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {product.variants
                      .filter((variant) => variant)
                      .map((variant, index) => (
                        <button
                          key={variant._id || index}
                          onClick={() => handleVariantChange(index)}
                          className={`p-3 text-center rounded-lg border-2 transition-all ${
                            selectedVariantIndex === index
                              ? "border-amber-400 bg-amber-50 text-amber-900"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {/* Display variant attributes if any */}
                          {variant.attributes &&
                          Object.keys(variant.attributes).length > 0 ? (
                            <div className="font-medium">
                              {formatAttributes(variant.attributes)}
                            </div>
                          ) : (
                            <div className="font-medium">
                              Variant {index + 1}
                            </div>
                          )}

                          {/* Display SKU */}
                          <div className="text-xs text-gray-500 mt-1">
                            SKU: {variant.sku || "N/A"}
                          </div>

                          {/* Display price if different from main product price */}
                          {variant.price && variant.price !== product.price && (
                            <div className="text-sm text-gray-600 mt-1">
                              ₹{variant.price.toLocaleString()}
                            </div>
                          )}

                          {/* Stock information */}
                          {typeof variant.stock === "number" && (
                            <div className="text-xs mt-1 text-gray-500">
                              {variant.stock > 0
                                ? `${variant.stock} in stock`
                                : "Out of stock"}
                            </div>
                          )}
                        </button>
                      ))}
                  </div>
                </div>
              )}

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Quantity
              </h3>
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() =>
                      setQuantity(
                        Math.min(
                          quantity + 1,
                          getSelectedVariant()?.stock ||
                            product.totalStock ||
                            10
                        )
                      )
                    }
                    className="p-2 hover:bg-gray-100 disabled:opacity-50"
                    disabled={
                      quantity >=
                      (getSelectedVariant()?.stock || product.totalStock || 10)
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Package className="h-4 w-4 mr-1" />
                  {getSelectedVariant()?.stock || product.totalStock || 0} in
                  stock
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleBuyNow}
                disabled={(product?.totalStock || 0) <= 0}
                className={`w-full ${
                  (product?.totalStock || 0) > 0
                    ? "bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                } py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg`}
              >
                {(product?.totalStock || 0) > 0 ? "Buy Now" : "Out of Stock"}
              </button>
              <button
                onClick={handleAddToCart}
                disabled={(product?.totalStock || 0) <= 0}
                className={`w-full flex items-center justify-center space-x-2 ${
                  (product?.totalStock || 0) > 0
                    ? "bg-white border-2 border-amber-400 text-amber-600 hover:bg-amber-50"
                    : "bg-gray-100 border-2 border-gray-300 text-gray-400 cursor-not-allowed"
                } py-4 rounded-xl font-semibold text-lg transition-colors`}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart</span>
              </button>
            </div>

            {/* Service Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="h-4 w-4 text-green-600" />
                <span>
                  {product?.warranty?.warrantyType || "Standard Warranty"}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <RotateCcw className="h-4 w-4 text-blue-600" />
                <span>
                  {product?.returnPolicy?.isReturnable
                    ? `${product.returnPolicy.isReturnDays}-Day Return`
                    : "No Returns"}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Truck className="h-4 w-4 text-purple-600" />
                <span>Free Delivery</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CreditCard className="h-4 w-4 text-indigo-600" />
                <span>Secure Payment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: "description", label: "Description" },
                { id: "specifications", label: "Specifications" },
                { id: "warranty", label: "Warranty & Returns" },
                { id: "reviews", label: "Reviews" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-amber-500 text-amber-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {/* Description Tab */}
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Product Description
                </h3>
                <p className="text-gray-700 mb-6">
                  {product?.description || "No description available"}
                </p>

                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))} */}
                </ul>
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === "specifications" && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Product Specifications
                </h3>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center px-6 py-4 bg-gray-50">
                    <dt className="text-sm font-medium text-gray-900 sm:w-1/3 mb-1 sm:mb-0">
                      Brand
                    </dt>
                    <dd className="text-sm text-gray-700 sm:w-2/3">
                      {product?.brand || "Not specified"}
                    </dd>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center px-6 py-4 bg-white">
                    <dt className="text-sm font-medium text-gray-900 sm:w-1/3 mb-1 sm:mb-0">
                      Product Weight
                    </dt>
                    <dd className="text-sm text-gray-700 sm:w-2/3">
                      {product?.productDimension?.weight
                        ? `${product.productDimension.weight} ${product.productDimension.weightUnit}`
                        : "Not specified"}
                    </dd>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center px-6 py-4 bg-gray-50">
                    <dt className="text-sm font-medium text-gray-900 sm:w-1/3 mb-1 sm:mb-0">
                      Dimensions
                    </dt>
                    <dd className="text-sm text-gray-700 sm:w-2/3">
                      {product?.productDimension?.height &&
                      product?.productDimension?.width
                        ? `${product.productDimension.height} × ${product.productDimension.width} ${product.productDimension.dimensionUnit}`
                        : "Not specified"}
                    </dd>
                  </div>

                  {product?.tags && product.tags.length > 0 && (
                    <div className="flex flex-col sm:flex-row sm:items-center px-6 py-4 bg-white">
                      <dt className="text-sm font-medium text-gray-900 sm:w-1/3 mb-1 sm:mb-0">
                        Tags
                      </dt>
                      <dd className="text-sm text-gray-700 sm:w-2/3">
                        {product.tags.join(", ")}
                      </dd>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Warranty & Returns Tab */}
            {activeTab === "warranty" && (
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Warranty Information
                  </h3>
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center mb-4">
                      <Shield className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-lg font-medium">
                        {product?.warranty?.warrantyType || "Standard Warranty"}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">
                      {product?.warranty?.description ||
                        "This product comes with a standard manufacturer warranty covering defects in materials and workmanship."}
                    </p>
                    <div className="bg-gray-50 rounded p-4 text-sm text-gray-700">
                      <strong>Warranty Policy:</strong>{" "}
                      {product?.warranty?.policy ||
                        "To claim warranty, please contact our customer support with your order details and a description of the issue. The warranty covers replacement or repair of defective products only. Normal wear and tear, misuse, or accidental damage are not covered under warranty."}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Return Policy
                  </h3>
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    {product?.returnPolicy?.isReturnable ? (
                      <>
                        <div className="flex items-center mb-4">
                          <RotateCcw className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="text-lg font-medium">
                            {product.returnPolicy.isReturnDays}-Day Return
                            Policy
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">
                          This product can be returned within{" "}
                          {product.returnPolicy.isReturnDays} days of delivery.
                        </p>
                        <p className="text-gray-700">
                          Return shipping cost:{" "}
                          {product.returnPolicy.isReturnCost > 0
                            ? `₹${product.returnPolicy.isReturnCost}`
                            : "Free return shipping"}
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-700">
                        This product is not eligible for returns.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && <Review productId={productId} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;

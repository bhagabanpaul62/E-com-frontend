"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
// We could also import API functions from our api folder
// import { getUserWishlist, removeFromWishlist, clearWishlist } from "@/app/api/wishlist";
import SocialShareButton from "@/components/user/shared/SocialShareButton";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Share2,
  Eye,
  Star,
  Package,
  Truck,
  Shield,
  Tag,
  ArrowLeft,
  Grid3X3,
  List,
  Filter,
  Search,
  SortDesc,
  Trash2,
  Plus,
  Check,
  X,
  ShoppingBag,
  TrendingUp,
  Clock,
  AlertCircle,
  RefreshCw,
  Download,
  Gift,
  Zap,
  Award,
  Crown,
  Sparkles,
  ExternalLink,
  MoreVertical,
  Calendar,
  MapPin,
  Info,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Fetch wishlist data from API
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);

        // Log the API URL for debugging
        console.log(
          "Fetching wishlist from:",
          `${process.env.NEXT_PUBLIC_SERVER}/api/wishlist`
        );

        // Call the wishlist API
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER}/api/wishlist`,
          {
            withCredentials: true,
          }
        );

        if (response.data && response.data.success && response.data.data) {
          // Log the response data for debugging
          console.log("Wishlist API response:", response.data);

          // Convert API response to match our component's expected structure
          const wishlistData = response.data.data.products.map((product) => {
            console.log(
              "Processing product:",
              product._id,
              product.name,
              "Images:",
              product.images,
              "MainImage:",
              product.mainImage
            );

            return {
              _id: product._id,
              productId: {
                _id: product._id,
                name: product.name,
                // Use mainImage as the primary source, then fallback to images array
                image:
                  product.mainImage ||
                  (product.images && product.images.length > 0
                    ? product.images[0]
                    : ""),
                images: product.images || [],
                // Include all variant data
                variants: product.variants || [],
                attributes: product.attributes || {},
                brand: product.brand || "Tajbee",
                category: product.category?.name || "General",
                rating: product.rating || 0,
                reviewCount: product.numReviews || 0,
                price: product.price || 0,
                originalPrice: product.mrpPrice || product.price || 0,
                discount: product.discount || 0,
                // Check totalStock instead of stock - this is the correct field from the Product model
                inStock: product.totalStock > 0,
                stockCount: product.totalStock || 0,
                description: product.description || "",
                slug: product.slug || product._id, // Add slug for navigation
                status: product.status || "active",
              },
              addedAt: product.createdAt || new Date().toISOString(),
              priceDropped: false,
              fastDelivery: true,
            };
          });

          setWishlistItems(wishlistData);
        } else {
          setWishlistItems([]);
          console.log("No wishlist items found or invalid response format");
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setWishlistItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const removeFromWishlist = async (itemId) => {
    try {
      // Call the API to remove the item
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER}/api/wishlist/remove/${itemId}`,
        {
          withCredentials: true,
        }
      );

      // Update local state
      setWishlistItems((prev) => prev.filter((item) => item._id !== itemId));
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });

      // Show success message
      toast.success("Item removed from wishlist");
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
      toast.error("Failed to remove item from wishlist");
    }
  };

  const addToCart = (item) => {
    // Add to cart logic here
    console.log("Adding to cart:", item);
    // You can show a toast notification here
  };

  const moveToCart = (itemId) => {
    const item = wishlistItems.find((item) => item._id === itemId);
    if (item) {
      addToCart(item);
      removeFromWishlist(itemId);
    }
  };

  const toggleItemSelection = (itemId) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const bulkRemoveFromWishlist = async () => {
    try {
      // Remove each selected item from the wishlist
      const promises = Array.from(selectedItems).map((itemId) =>
        axios.delete(
          `${process.env.NEXT_PUBLIC_SERVER}/api/wishlist/remove/${itemId}`,
          {
            withCredentials: true,
          }
        )
      );

      await Promise.all(promises);

      // Update local state
      setWishlistItems((prev) =>
        prev.filter((item) => !selectedItems.has(item._id))
      );
      setSelectedItems(new Set());
      setShowBulkActions(false);

      // Show success message
      toast.success("Selected items removed from wishlist");
    } catch (error) {
      console.error("Error removing items from wishlist:", error);
      toast.error("Failed to remove selected items from wishlist");
    }
  };

  const bulkAddToCart = () => {
    const selectedItemsData = wishlistItems.filter((item) =>
      selectedItems.has(item._id)
    );
    selectedItemsData.forEach((item) => addToCart(item));
    bulkRemoveFromWishlist();
  };

  // Filter and sort logic
  const filteredItems = wishlistItems.filter((item) => {
    const matchesSearch =
      item.productId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productId.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || item.productId.category === categoryFilter;
    const matchesPrice =
      priceFilter === "All" ||
      (priceFilter === "Under 2000" && item.productId.price < 2000) ||
      (priceFilter === "2000-5000" &&
        item.productId.price >= 2000 &&
        item.productId.price <= 5000) ||
      (priceFilter === "Above 5000" && item.productId.price > 5000);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.addedAt) - new Date(a.addedAt);
      case "oldest":
        return new Date(a.addedAt) - new Date(b.addedAt);
      case "price-low":
        return a.productId.price - b.productId.price;
      case "price-high":
        return b.productId.price - a.productId.price;
      case "discount":
        return b.productId.discount - a.productId.discount;
      case "rating":
        return b.productId.rating - a.productId.rating;
      default:
        return 0;
    }
  });

  const categories = [
    "All",
    ...new Set(wishlistItems.map((item) => item.productId.category)),
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-200 border-t-amber-500 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading your wishlist...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm  z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </Link>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-amber-600 bg-clip-text text-transparent">
                      My Wishlist
                    </h1>
                    <p className="text-gray-600">
                      {wishlistItems.length} items saved for later
                    </p>
                  </div>
                </div>
              </div>
              {wishlistItems.length > 0 && (
                <div className="flex items-center gap-2">
                  <SocialShareButton
                    title="My Wishlist"
                    text={`Check out my wishlist with ${wishlistItems.length} items!`}
                    variant="outline"
                  />
                  <button
                    onClick={async () => {
                      if (
                        window.confirm(
                          "Are you sure you want to clear your entire wishlist?"
                        )
                      ) {
                        try {
                          await axios.delete(
                            `${process.env.NEXT_PUBLIC_SERVER}/api/wishlist/clear`,
                            {
                              withCredentials: true,
                            }
                          );
                          setWishlistItems([]);
                          toast.success("Wishlist cleared successfully");
                        } catch (error) {
                          console.error("Error clearing wishlist:", error);
                          toast.error("Failed to clear wishlist");
                        }
                      }
                    }}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Clear All</span>
                  </button>
                </div>
              )}
              <div className="hidden sm:flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {wishlistItems.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Items</div>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {
                      wishlistItems.filter((item) => item.productId.inStock)
                        .length
                    }
                  </div>
                  <div className="text-sm text-gray-600">In Stock</div>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {wishlistItems.filter((item) => item.priceDropped).length}
                  </div>
                  <div className="text-sm text-gray-600">Price Drops</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="pb-6">
            <div className="bg-amber-50 rounded-xl p-4 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-600" />
                <input
                  type="text"
                  placeholder="Search your wishlist..."
                  className="w-full pl-12 pr-4 py-3 bg-white border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-amber-600 hover:text-amber-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Filter Controls */}
              <div className="flex flex-wrap gap-3">
                {/* Category Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-600" />
                  <select
                    className="pl-10 pr-8 py-2 bg-white border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Filter */}
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-600" />
                  <select
                    className="pl-10 pr-8 py-2 bg-white border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                  >
                    <option value="All">All Prices</option>
                    <option value="Under 2000">Under ₹2,000</option>
                    <option value="2000-5000">₹2,000 - ₹5,000</option>
                    <option value="Above 5000">Above ₹5,000</option>
                  </select>
                </div>

                {/* Sort Filter */}
                <div className="relative">
                  <SortDesc className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-600" />
                  <select
                    className="pl-10 pr-8 py-2 bg-white border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="discount">Highest Discount</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex bg-white border border-amber-200 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "grid"
                        ? "bg-amber-100 text-amber-600"
                        : "text-gray-400 hover:text-amber-600"
                    }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "list"
                        ? "bg-amber-100 text-amber-600"
                        : "text-gray-400 hover:text-amber-600"
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>

                {/* Clear Filters */}
                {(searchTerm ||
                  categoryFilter !== "All" ||
                  priceFilter !== "All" ||
                  sortBy !== "newest") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setCategoryFilter("All");
                      setPriceFilter("All");
                      setSortBy("newest");
                    }}
                    className="px-3 py-2 text-sm text-amber-700 hover:text-amber-800 bg-white border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bulk Actions */}
        {selectedItems.size > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-gray-900 font-medium">
                  {selectedItems.size} item{selectedItems.size > 1 ? "s" : ""}{" "}
                  selected
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={bulkAddToCart}
                  className="px-4 py-2 bg-amber-400 text-white rounded-lg hover:bg-amber-500 transition-colors flex items-center space-x-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={bulkRemoveFromWishlist}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Remove</span>
                </button>
                <button
                  onClick={() => setSelectedItems(new Set())}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        {sortedItems.length > 0 && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-600">
              Showing {sortedItems.length} of {wishlistItems.length} items
              {searchTerm && (
                <span className="text-amber-600 font-medium">
                  {" "}
                  for "{searchTerm}"
                </span>
              )}
            </p>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        )}

        {/* Wishlist Items */}
        {sortedItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-12 w-12 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {wishlistItems.length === 0
                  ? "Your wishlist is empty"
                  : "No items found"}
              </h3>
              <p className="text-gray-600 mb-6">
                {wishlistItems.length === 0
                  ? "Save items you love to your wishlist. They'll appear here for easy access later!"
                  : "Try adjusting your search or filter criteria to find what you're looking for."}
              </p>
              {wishlistItems.length === 0 ? (
                <Link
                  href="/"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl hover:from-amber-500 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Start Shopping
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setCategoryFilter("All");
                    setPriceFilter("All");
                  }}
                  className="inline-flex items-center px-4 py-2 bg-amber-400 text-white rounded-lg hover:bg-amber-500 transition-colors"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div
            className={`${
              viewMode === "grid"
                ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "space-y-4"
            }`}
          >
            {sortedItems.map((item) => (
              <div
                key={item._id}
                className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 group ${
                  !item.productId.inStock ? "opacity-75" : ""
                }`}
              >
                {viewMode === "grid" ? (
                  // Grid View
                  <div className="relative">
                    {/* Image Section */}
                    <div className="relative aspect-square overflow-hidden">
                      <Link
                        href={`/product/${
                          item.productId.slug || item.productId._id
                        }`}
                      >
                        <img
                          src={
                            process.env.NEXT_PUBLIC_SERVER &&
                            item.productId.mainImage
                              ? `${
                                  process.env.NEXT_PUBLIC_SERVER
                                }/${item.productId.mainImage.replace(
                                  /^\//,
                                  ""
                                )}`
                              : item.productId.image &&
                                !item.productId.image.startsWith("http")
                              ? `${
                                  process.env.NEXT_PUBLIC_SERVER
                                }/${item.productId.image.replace(/^\//, "")}`
                              : item.productId.image ||
                                (item.productId.images &&
                                item.productId.images.length > 0
                                  ? item.productId.images[0].startsWith("http")
                                    ? item.productId.images[0]
                                    : `${
                                        process.env.NEXT_PUBLIC_SERVER
                                      }/${item.productId.images[0].replace(
                                        /^\//,
                                        ""
                                      )}`
                                  : "/placeholder.jpg")
                          }
                          alt={item.productId.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder.jpg";
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      {/* Overlay Labels */}
                      <div className="absolute top-3 left-3 space-y-2">
                        {!item.productId.inStock && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            Out of Stock
                          </span>
                        )}
                        {item.priceDropped && (
                          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Price Drop
                          </span>
                        )}
                        {item.productId.discount > 0 && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {item.productId.discount}% OFF
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="absolute top-3 right-3 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => toggleItemSelection(item._id)}
                          className={`p-2 rounded-full shadow-lg transition-colors ${
                            selectedItems.has(item._id)
                              ? "bg-amber-500 text-white"
                              : "bg-white text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button className="p-2 bg-white text-gray-600 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                          <Share2 className="h-4 w-4" />
                        </button>
                        <Link
                          href={`/product/${
                            item.productId.slug || item.productId._id
                          }`}
                        >
                          <button className="p-2 bg-white text-gray-600 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                        </Link>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4">
                      <div className="mb-2">
                        <Link
                          href={`/product/${
                            item.productId.slug || item.productId._id
                          }`}
                        >
                          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-amber-600 transition-colors">
                            {item.productId.name}
                          </h3>
                        </Link>
                        <p className="text-amber-600 text-sm font-medium">
                          {item.productId.brand}
                        </p>
                        {item.productId.variants &&
                          item.productId.variants.length > 0 && (
                            <div className="mt-1 text-xs text-gray-600">
                              {Object.entries(
                                item.productId.variants[0]?.attributes || {}
                              ).map(([key, value], index) => (
                                <span key={key} className="inline-block mr-2">
                                  {key}:{" "}
                                  <span className="font-medium">{value}</span>
                                  {index <
                                  Object.keys(
                                    item.productId.variants[0]?.attributes || {}
                                  ).length -
                                    1
                                    ? ", "
                                    : ""}
                                </span>
                              ))}
                            </div>
                          )}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-amber-400 fill-current" />
                          <span className="text-sm font-medium text-gray-700 ml-1">
                            {item.productId.rating}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          ({item.productId.reviewCount.toLocaleString()})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-gray-900">
                            ₹{item.productId.price.toLocaleString()}
                          </span>
                          {item.productId.originalPrice >
                            item.productId.price && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{item.productId.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        {item.priceDropped && (
                          <div className="text-green-600 text-sm">
                            ₹
                            {(
                              item.priceAtAdded - item.productId.price
                            ).toLocaleString()}{" "}
                            cheaper than when added
                          </div>
                        )}
                      </div>

                      {/* Features */}
                      <div className="space-y-2 mb-4">
                        {item.fastDelivery && (
                          <div className="flex items-center text-xs text-blue-600">
                            <Zap className="h-3 w-3 mr-1" />
                            Fast Delivery
                          </div>
                        )}
                        {item.warranty && (
                          <div className="flex items-center text-xs text-green-600">
                            <Shield className="h-3 w-3 mr-1" />
                            {item.warranty}
                          </div>
                        )}
                        {item.productId.stockCount <= 10 &&
                          item.productId.inStock && (
                            <div className="flex items-center text-xs text-orange-600">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Only {item.productId.stockCount} left
                            </div>
                          )}
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <button
                          onClick={() => moveToCart(item._id)}
                          disabled={!item.productId.inStock}
                          className="w-full bg-amber-400 text-white py-2 rounded-lg hover:bg-amber-500 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          <span>
                            {item.productId.inStock
                              ? "Move to Cart"
                              : "Out of Stock"}
                          </span>
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => removeFromWishlist(item._id)}
                            className="border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                            title="Remove from wishlist"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              try {
                                const productUrl = `${
                                  window.location.origin
                                }/product/${
                                  item.productId.slug || item.productId._id
                                }`;
                                if (navigator.share) {
                                  navigator
                                    .share({
                                      title: item.productId.name,
                                      text: `Check out this product: ${item.productId.name}`,
                                      url: productUrl,
                                    })
                                    .then(() => toast.success("Product shared"))
                                    .catch((error) => {
                                      console.error("Error sharing:", error);
                                      navigator.clipboard.writeText(productUrl);
                                      toast.success("Product link copied");
                                    });
                                } else {
                                  navigator.clipboard.writeText(productUrl);
                                  toast.success("Product link copied");
                                }
                              } catch (error) {
                                console.error("Share error:", error);
                                toast.error("Couldn't share product");
                              }
                            }}
                            className="border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                            title="Share product"
                          >
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // List View
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Checkbox */}
                      <div className="pt-2">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item._id)}
                          onChange={() => toggleItemSelection(item._id)}
                          className="w-5 h-5 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
                        />
                      </div>

                      {/* Image */}
                      <div className="relative">
                        <Link
                          href={`/product/${
                            item.productId.slug || item.productId._id
                          }`}
                        >
                          <img
                            src={
                              process.env.NEXT_PUBLIC_SERVER &&
                              item.productId.mainImage
                                ? `${
                                    process.env.NEXT_PUBLIC_SERVER
                                  }/${item.productId.mainImage.replace(
                                    /^\//,
                                    ""
                                  )}`
                                : item.productId.image &&
                                  !item.productId.image.startsWith("http")
                                ? `${
                                    process.env.NEXT_PUBLIC_SERVER
                                  }/${item.productId.image.replace(/^\//, "")}`
                                : item.productId.image ||
                                  (item.productId.images &&
                                  item.productId.images.length > 0
                                    ? item.productId.images[0].startsWith(
                                        "http"
                                      )
                                      ? item.productId.images[0]
                                      : `${
                                          process.env.NEXT_PUBLIC_SERVER
                                        }/${item.productId.images[0].replace(
                                          /^\//,
                                          ""
                                        )}`
                                    : "/placeholder.jpg")
                            }
                            alt={item.productId.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/placeholder.jpg";
                            }}
                            className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                          />
                        </Link>
                        {!item.productId.inStock && (
                          <div className="absolute inset-0 bg-red-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Link
                              href={`/product/${
                                item.productId.slug || item.productId._id
                              }`}
                            >
                              <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 hover:text-amber-600 transition-colors">
                                {item.productId.name}
                              </h3>
                            </Link>
                            <p className="text-amber-600 font-medium text-sm">
                              {item.productId.brand}
                            </p>

                            {item.productId.variants &&
                              item.productId.variants.length > 0 && (
                                <div className="mt-1 text-xs text-gray-600">
                                  {Object.entries(
                                    item.productId.variants[0]?.attributes || {}
                                  ).map(([key, value], index) => (
                                    <span
                                      key={key}
                                      className="inline-block mr-2"
                                    >
                                      {key}:{" "}
                                      <span className="font-medium">
                                        {value}
                                      </span>
                                      {index <
                                      Object.keys(
                                        item.productId.variants[0]
                                          ?.attributes || {}
                                      ).length -
                                        1
                                        ? ", "
                                        : ""}
                                    </span>
                                  ))}
                                </div>
                              )}

                            {/* Rating */}
                            <div className="flex items-center space-x-2 mt-2">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-amber-400 fill-current" />
                                <span className="text-sm font-medium text-gray-700 ml-1">
                                  {item.productId.rating}
                                </span>
                              </div>
                              <span className="text-xs text-gray-500">
                                ({item.productId.reviewCount.toLocaleString()})
                              </span>
                            </div>

                            {/* Features */}
                            <div className="flex items-center space-x-4 mt-2">
                              {item.warranty && (
                                <div className="flex items-center text-xs text-green-600">
                                  <Shield className="h-3 w-3 mr-1" />
                                  {item.warranty}
                                </div>
                              )}
                              {item.fastDelivery && (
                                <div className="flex items-center text-xs text-blue-600">
                                  <Zap className="h-3 w-3 mr-1" />
                                  Fast Delivery
                                </div>
                              )}
                            </div>

                            {/* Added Date */}
                            <p className="text-xs text-gray-500 mt-2">
                              Added on{" "}
                              {new Date(item.addedAt).toLocaleDateString()}
                            </p>
                          </div>

                          {/* Price Section */}
                          <div className="text-right ml-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-gray-900">
                                ₹{item.productId.price.toLocaleString()}
                              </span>
                              {item.productId.originalPrice >
                                item.productId.price && (
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
                            {item.priceDropped && (
                              <div className="text-green-600 text-sm">
                                ₹
                                {(
                                  item.priceAtAdded - item.productId.price
                                ).toLocaleString()}{" "}
                                cheaper
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-4">
                            {item.productId.stockCount <= 10 &&
                              item.productId.inStock && (
                                <div className="flex items-center text-orange-600 text-sm">
                                  <AlertCircle className="h-4 w-4 mr-1" />
                                  Only {item.productId.stockCount} left
                                </div>
                              )}
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => moveToCart(item._id)}
                              disabled={!item.productId.inStock}
                              className="px-4 py-2 bg-amber-400 text-white rounded-lg hover:bg-amber-500 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ShoppingCart className="h-4 w-4" />
                              <span>
                                {item.productId.inStock
                                  ? "Move to Cart"
                                  : "Out of Stock"}
                              </span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                try {
                                  const productUrl = `${
                                    window.location.origin
                                  }/product/${
                                    item.productId.slug || item.productId._id
                                  }`;
                                  if (navigator.share) {
                                    navigator
                                      .share({
                                        title: item.productId.name,
                                        text: `Check out this product: ${item.productId.name}`,
                                        url: productUrl,
                                      })
                                      .then(() =>
                                        toast.success("Product shared")
                                      )
                                      .catch((error) => {
                                        console.error("Error sharing:", error);
                                        navigator.clipboard.writeText(
                                          productUrl
                                        );
                                        toast.success("Product link copied");
                                      });
                                  } else {
                                    navigator.clipboard.writeText(productUrl);
                                    toast.success("Product link copied");
                                  }
                                } catch (error) {
                                  console.error("Share error:", error);
                                  toast.error("Couldn't share product");
                                }
                              }}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Share2 className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => removeFromWishlist(item._id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;

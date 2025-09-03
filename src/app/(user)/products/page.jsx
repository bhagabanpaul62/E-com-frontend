"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Star,
  Heart,
  ShoppingCart,
  Filter,
  SlidersHorizontal,
  Search,
  ChevronDown,
  Grid3X3,
  List,
} from "lucide-react";

const ProductsPage = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  // Sample products data
  const products = [
    {
      _id: "1",
      name: "iPhone 15 Pro Max",
      brand: "Apple",
      image: "/api/placeholder/300/300",
      price: 147100,
      originalPrice: 159900,
      discount: 8,
      rating: 4.8,
      reviewCount: 12547,
      inStock: true,
      category: "Smartphones",
      fastDelivery: true,
    },
    {
      _id: "2",
      name: "MacBook Pro 14-inch M3",
      brand: "Apple",
      image: "/api/placeholder/300/300",
      price: 189905,
      originalPrice: 199900,
      discount: 5,
      rating: 4.9,
      reviewCount: 8950,
      inStock: true,
      category: "Laptops",
      fastDelivery: true,
    },
    {
      _id: "3",
      name: "Sony WH-1000XM5 Headphones",
      brand: "Sony",
      image: "/api/placeholder/300/300",
      price: 30792,
      originalPrice: 34990,
      discount: 12,
      rating: 4.7,
      reviewCount: 5420,
      inStock: true,
      category: "Audio",
      fastDelivery: false,
    },
    {
      _id: "4",
      name: "Samsung Galaxy S24 Ultra",
      brand: "Samsung",
      image: "/api/placeholder/300/300",
      price: 124999,
      originalPrice: 134999,
      discount: 7,
      rating: 4.6,
      reviewCount: 9876,
      inStock: true,
      category: "Smartphones",
      fastDelivery: true,
    },
    {
      _id: "5",
      name: "Dell XPS 13",
      brand: "Dell",
      image: "/api/placeholder/300/300",
      price: 89999,
      originalPrice: 99999,
      discount: 10,
      rating: 4.5,
      reviewCount: 3456,
      inStock: true,
      category: "Laptops",
      fastDelivery: true,
    },
    {
      _id: "6",
      name: "iPad Pro 12.9",
      brand: "Apple",
      image: "/api/placeholder/300/300",
      price: 112900,
      originalPrice: 119900,
      discount: 6,
      rating: 4.8,
      reviewCount: 6789,
      inStock: false,
      category: "Tablets",
      fastDelivery: false,
    },
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "text-amber-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const ProductCardGrid = ({ product }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-300">
      <Link href={`/product/${product._id}`} className="block">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.discount > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
              {product.discount}% OFF
            </div>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">
                Out of Stock
              </span>
            </div>
          )}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors">
              <Heart className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="mb-2">
            <span className="text-amber-600 text-sm font-medium">{product.brand}</span>
          </div>
          <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center space-x-1 mb-3">
            {renderStars(product.rating)}
            <span className="text-sm text-gray-600 ml-1">
              ({product.reviewCount.toLocaleString()})
            </span>
          </div>
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-2xl font-bold text-gray-900">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-gray-500 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{product.category}</span>
            {product.fastDelivery && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Fast Delivery
              </span>
            )}
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <button
          disabled={!product.inStock}
          className="w-full bg-amber-400 text-white py-2 rounded-lg hover:bg-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>{product.inStock ? "Add to Cart" : "Out of Stock"}</span>
        </button>
      </div>
    </div>
  );

  const ProductCardList = ({ product }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/product/${product._id}`} className="flex p-6">
        <div className="relative flex-shrink-0 w-48">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-32 object-cover rounded-lg"
          />
          {product.discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
              {product.discount}% OFF
            </div>
          )}
        </div>
        <div className="flex-1 ml-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <span className="text-amber-600 text-sm font-medium">{product.brand}</span>
              <h3 className="font-semibold text-gray-900 text-xl mb-2 hover:text-amber-600 transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center space-x-1 mb-3">
                {renderStars(product.rating)}
                <span className="text-sm text-gray-600 ml-1">
                  ({product.reviewCount.toLocaleString()} reviews)
                </span>
              </div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl font-bold text-gray-900">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-gray-500 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{product.category}</span>
                {product.fastDelivery && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Fast Delivery
                  </span>
                )}
                <span className={`text-sm ${product.inStock ? "text-green-600" : "text-red-600"}`}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <button className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
                <Heart className="h-5 w-5" />
              </button>
              <button
                disabled={!product.inStock}
                className="bg-amber-400 text-white px-6 py-2 rounded-lg hover:bg-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
              <p className="text-gray-600 mt-1">{products.length} products found</p>
            </div>
            
            {/* Search Bar */}
            <div className="mt-4 sm:mt-0 sm:ml-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent w-full sm:w-64"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
            
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="newest">Newest First</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid" ? "bg-amber-100 text-amber-600" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Grid3X3 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list" ? "bg-amber-100 text-amber-600" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Category</h3>
                <div className="space-y-2">
                  {["Smartphones", "Laptops", "Audio", "Tablets"].map((category) => (
                    <label key={category} className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
                      <span className="ml-2 text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Brand</h3>
                <div className="space-y-2">
                  {["Apple", "Samsung", "Sony", "Dell"].map((brand) => (
                    <label key={brand} className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
                      <span className="ml-2 text-sm text-gray-700">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-2">
                  {["Under ₹50,000", "₹50,000 - ₹1,00,000", "₹1,00,000 - ₹2,00,000", "Above ₹2,00,000"].map((range) => (
                    <label key={range} className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
                      <span className="ml-2 text-sm text-gray-700">{range}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Features</h3>
                <div className="space-y-2">
                  {["Fast Delivery", "In Stock", "Discounted"].map((feature) => (
                    <label key={feature} className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
                      <span className="ml-2 text-sm text-gray-700">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid/List */}
        <div className={
          viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-6"
        }>
          {products.map((product) => (
            <div key={product._id}>
              {viewMode === "grid" ? (
                <ProductCardGrid product={product} />
              ) : (
                <ProductCardList product={product} />
              )}
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-amber-400 text-white px-8 py-3 rounded-lg hover:bg-amber-500 transition-colors font-medium">
            Load More Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaStar,
  FaHeart,
  FaFilter,
  FaSort,
  FaChevronDown,
  FaSearch,
} from "react-icons/fa";

const FlipkartSearchResults = ({ searchQuery, products = [] }) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortBy, setSortBy] = useState("relevance");
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 100000 });
  const [ratingFilter, setRatingFilter] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.brand?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filter
    filtered = filtered.filter(
      (product) =>
        product.price >= priceFilter.min && product.price <= priceFilter.max
    );

    // Rating filter
    if (ratingFilter > 0) {
      filtered = filtered.filter(
        (product) => (product.averageRating || 0) >= ratingFilter
      );
    }

    // Sort
    switch (sortBy) {
      case "price_low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort(
          (a, b) => (b.averageRating || 0) - (a.averageRating || 0)
        );
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        // relevance - no sorting
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, sortBy, priceFilter, ratingFilter]);

  const priceRanges = [
    { label: "Under ₹500", min: 0, max: 500 },
    { label: "₹500 - ₹1,000", min: 500, max: 1000 },
    { label: "₹1,000 - ₹5,000", min: 1000, max: 5000 },
    { label: "₹5,000 - ₹10,000", min: 5000, max: 10000 },
    { label: "Above ₹10,000", min: 10000, max: 100000 },
  ];

  const ratingOptions = [4, 3, 2, 1];

  return (
    <div className="bg-muted/30 min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Search Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-3">
              <FaSearch className="text-muted-foreground" />
              <span className="text-lg font-medium">
                {searchQuery ? `Results for "${searchQuery}"` : "All Products"}
              </span>
              <span className="text-muted-foreground">
                ({filteredProducts.length} items)
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center space-x-2 px-4 py-2 border border-border rounded-lg hover:bg-muted/50"
              >
                <FaFilter className="text-sm" />
                <span>Filters</span>
              </button>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-border rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="relevance">Sort by Relevance</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="newest">Newest First</option>
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div
            className={`${
              showFilters ? "block" : "hidden"
            } md:block w-full md:w-80 space-y-4`}
          >
            {/* Price Filter */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-medium text-foreground mb-4">Price</h3>
              <div className="space-y-3">
                {priceRanges.map((range, index) => (
                  <label
                    key={index}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="priceRange"
                      checked={
                        priceFilter.min === range.min &&
                        priceFilter.max === range.max
                      }
                      onChange={() =>
                        setPriceFilter({ min: range.min, max: range.max })
                      }
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-sm">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-medium text-foreground mb-4">
                Customer Rating
              </h3>
              <div className="space-y-3">
                {ratingOptions.map((rating) => (
                  <label
                    key={rating}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="rating"
                      checked={ratingFilter === rating}
                      onChange={() => setRatingFilter(rating)}
                      className="text-primary focus:ring-primary"
                    />
                    <div className="flex items-center space-x-1">
                      <span className="text-sm">{rating}</span>
                      <FaStar className="text-chart-1 text-xs" />
                      <span className="text-sm text-muted-foreground">
                        & above
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setPriceFilter({ min: 0, max: 100000 });
                setRatingFilter(0);
                setSortBy("relevance");
              }}
              className="w-full bg-white border border-border rounded-lg p-3 text-center hover:bg-muted/50 transition-colors"
            >
              Clear All Filters
            </button>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-16 text-center">
                <FaSearch className="text-6xl text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium text-foreground mb-2">
                  No products found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters to find what you're
                  looking for.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                  >
                    <Link href={`/product/${product._id}`}>
                      <div className="relative">
                        <div className="aspect-square bg-muted/50 relative overflow-hidden">
                          <img
                            src={product.mainImage || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {product.discount > 0 && (
                            <div className="absolute top-3 left-3 bg-chart-1 text-white text-xs px-2 py-1 rounded">
                              {product.discount}% OFF
                            </div>
                          )}
                          <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors">
                            <FaHeart className="text-muted-foreground hover:text-red-500 text-sm" />
                          </button>
                        </div>

                        <div className="p-4">
                          <h3 className="font-medium text-foreground line-clamp-2 mb-2">
                            {product.name}
                          </h3>

                          {product.averageRating > 0 && (
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="flex items-center space-x-1 bg-chart-1 text-white px-2 py-1 rounded text-xs">
                                <span>{product.averageRating.toFixed(1)}</span>
                                <FaStar className="text-xs" />
                              </div>
                              <span className="text-xs text-muted-foreground">
                                ({product.totalReviews || 0} reviews)
                              </span>
                            </div>
                          )}

                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-xl font-semibold text-foreground">
                                ₹{product.price?.toLocaleString()}
                              </span>
                              {product.mrpPrice > product.price && (
                                <span className="text-sm text-muted-foreground line-through">
                                  ₹{product.mrpPrice?.toLocaleString()}
                                </span>
                              )}
                            </div>

                            {product.brand && (
                              <p className="text-sm text-muted-foreground">
                                by {product.brand}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipkartSearchResults;

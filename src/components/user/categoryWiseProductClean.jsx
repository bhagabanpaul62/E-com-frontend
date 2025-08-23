"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import ProductCard from "./productCard";
import Link from "next/link";
import { FaArrowRight, FaShoppingBag, FaFire, FaStar } from "react-icons/fa";

function CategoryWiseProduct() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCategoryAndProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      const [categoryRes, productRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_SERVER}/users/category`),
        axios.get(`${process.env.NEXT_PUBLIC_SERVER}/users/product`),
      ]);

      console.log("Categories:", categoryRes.data);
      console.log("Products:", productRes.data);

      setCategories(categoryRes.data.data.data || []);
      setProducts(productRes.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategoryAndProduct();
  }, []);

  // Group products by category
  const getProductsByCategory = (categoryId) => {
    return products.filter((product) => {
      const productCategoryId =
        typeof product.categoryId === "object"
          ? product.categoryId._id || product.categoryId.id
          : product.categoryId;
      return productCategoryId === categoryId;
    });
  };

  // Get featured products
  const getFeaturedProducts = () => {
    return products
      .filter(
        (product) =>
          product.isFeatured || product.isNewArrival || product.isTrending
      )
      .slice(0, 6);
  };

  if (loading) {
    return (
      <div className="bg-muted/30 min-h-screen">
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          {/* Loading skeleton */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6">
              <div className="h-8 bg-muted rounded w-64 animate-pulse mb-6"></div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-card border rounded-lg p-4">
                    <div className="w-full h-40 bg-muted rounded animate-pulse mb-3"></div>
                    <div className="h-4 bg-muted rounded animate-pulse mb-2"></div>
                    <div className="h-6 bg-muted rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-muted/30 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 text-center shadow-sm">
          <div className="text-destructive text-lg mb-4">{error}</div>
          <button
            onClick={getCategoryAndProduct}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const featuredProducts = getFeaturedProducts();

  return (
    <div className="bg-muted/30 min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Featured Products Section - Flipkart Style */}
        {featuredProducts.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FaFire className="text-chart-1 text-xl" />
                  <h2 className="text-xl font-medium text-foreground">
                    Top Deals
                  </h2>
                </div>
                <Link
                  href="/products"
                  className="text-primary hover:text-primary/80 text-sm font-medium flex items-center space-x-1"
                >
                  <span>VIEW ALL</span>
                  <FaArrowRight className="text-xs" />
                </Link>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {featuredProducts.map((product) => (
                  <div key={product._id} className="group">
                    <Link href={`/product/${product._id}`}>
                      <div className="bg-white border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
                        <div className="aspect-square bg-muted/50 relative overflow-hidden">
                          <img
                            src={product.mainImage || "/placeholder.jpg"}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {product.discount > 0 && (
                            <div className="absolute top-2 left-2 bg-chart-1 text-white text-xs px-2 py-1 rounded">
                              {product.discount}% OFF
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-2">
                            {product.name}
                          </h3>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-semibold text-foreground">
                                ₹{product.price?.toLocaleString()}
                              </span>
                              {product.mrpPrice > product.price && (
                                <span className="text-sm text-muted-foreground line-through">
                                  ₹{product.mrpPrice?.toLocaleString()}
                                </span>
                              )}
                            </div>
                            {product.averageRating > 0 && (
                              <div className="flex items-center space-x-1">
                                <div className="flex items-center space-x-1 bg-chart-1 text-white px-2 py-1 rounded text-xs">
                                  <span>
                                    {product.averageRating.toFixed(1)}
                                  </span>
                                  <FaStar className="text-xs" />
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  ({product.totalReviews || 0})
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Categories Section - Flipkart Style */}
        <div className="space-y-6">
          {categories.map((category) => {
            const categoryProducts = getProductsByCategory(category._id);

            if (categoryProducts.length === 0) return null;

            return (
              <div key={category._id} className="bg-white rounded-lg shadow-sm">
                {/* Category Header */}
                <div className="px-6 py-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {category.image && (
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h2 className="text-xl font-medium text-foreground">
                          {category.name}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {categoryProducts.length} Products
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/category/${category._id}`}
                      className="text-primary hover:text-primary/80 text-sm font-medium flex items-center space-x-1"
                    >
                      <span>VIEW ALL</span>
                      <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                </div>

                {/* Products Grid */}
                <div className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {categoryProducts.slice(0, 5).map((product) => (
                      <div key={product._id} className="group">
                        <Link href={`/product/${product._id}`}>
                          <div className="bg-white border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
                            <div className="aspect-square bg-muted/50 relative overflow-hidden">
                              <img
                                src={product.mainImage || "/placeholder.jpg"}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              {product.discount > 0 && (
                                <div className="absolute top-2 left-2 bg-chart-1 text-white text-xs px-2 py-1 rounded">
                                  {product.discount}% OFF
                                </div>
                              )}
                            </div>
                            <div className="p-3">
                              <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-2">
                                {product.name}
                              </h3>
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg font-semibold text-foreground">
                                    ₹{product.price?.toLocaleString()}
                                  </span>
                                  {product.mrpPrice > product.price && (
                                    <span className="text-sm text-muted-foreground line-through">
                                      ₹{product.mrpPrice?.toLocaleString()}
                                    </span>
                                  )}
                                </div>
                                {product.averageRating > 0 && (
                                  <div className="flex items-center space-x-1">
                                    <div className="flex items-center space-x-1 bg-chart-1 text-white px-2 py-1 rounded text-xs">
                                      <span>
                                        {product.averageRating.toFixed(1)}
                                      </span>
                                      <FaStar className="text-xs" />
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      ({product.totalReviews || 0})
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {categories.length === 0 && products.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-16 text-center">
            <div className="text-muted-foreground text-lg mb-4">
              No products available at the moment
            </div>
            <button
              onClick={getCategoryAndProduct}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryWiseProduct;

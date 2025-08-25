"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Banner from "@/components/user/home/Banner";
import DealsOfTheDay from "@/components/user/home/DealsOfTheDay";
import TrendingSection from "@/components/user/home/TrendingSection";
import CategoryShowcase from "@/components/user/category/CategoryShowcase";
import ProductGrid from "@/components/user/product/ProductGrid";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [categoryRes, productRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_SERVER}/users/category`),
        axios.get(`${process.env.NEXT_PUBLIC_SERVER}/users/product`),
      ]);

      setCategories(categoryRes.data.data.data || []);
      setProducts(productRes.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Get products by category
  const getProductsByCategory = (categoryId) => {
    return products.filter((product) => {
      const productCategoryId =
        typeof product.categoryId === "object"
          ? product.categoryId._id || product.categoryId.id
          : product.categoryId;
      return productCategoryId === categoryId;
    });
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        {/* Banner Skeleton */}
        <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 bg-gray-300 animate-pulse"></div>

        {/* Content Skeletons */}
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 space-y-4 sm:space-y-6">
          {/* Categories Skeleton */}
          <div className="bg-white rounded-lg p-4 sm:p-6">
            <div className="h-4 sm:h-6 bg-gray-300 rounded w-32 sm:w-48 mb-4 animate-pulse"></div>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gray-300 rounded-full mx-auto mb-2 animate-pulse"></div>
                  <div className="h-3 sm:h-4 bg-gray-300 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Products Skeleton */}
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg p-4 sm:p-6">
              <div className="h-4 sm:h-6 bg-gray-300 rounded w-48 sm:w-64 mb-4 animate-pulse"></div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="border rounded-lg p-2 sm:p-3">
                    <div className="aspect-square bg-gray-300 rounded mb-2 sm:mb-3 animate-pulse"></div>
                    <div className="h-3 sm:h-4 bg-gray-300 rounded mb-1 sm:mb-2 animate-pulse"></div>
                    <div className="h-4 sm:h-6 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-lg p-6 sm:p-8 text-center shadow-lg max-w-sm sm:max-w-md w-full">
          <div className="text-red-600 text-base sm:text-lg mb-4 sm:mb-6">
            {error}
          </div>
          <button
            onClick={fetchData}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto text-sm sm:text-base font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section with Banner */}
      <div className="w-full">
        <Banner />
      </div>

      {/* Main Content Container */}
      <div className="w-full">
        {/* Categories Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-4">
            <CategoryShowcase categories={categories} />
          </div>
        </div>

        {/* Deals Section */}
        <div className="bg-white mt-2 sm:mt-3 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
            <DealsOfTheDay products={products} />
          </div>
        </div>

        {/* Trending Section */}
        <div className="bg-white mt-2 sm:mt-3 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
            <TrendingSection products={products} />
          </div>
        </div>

        {/* Category-wise Products */}
        <div className="space-y-2 sm:space-y-3 mt-2 sm:mt-3">
          {categories.map((category) => {
            const categoryProducts = getProductsByCategory(category._id);

            if (categoryProducts.length === 0) return null;

            return (
              <div
                key={category._id}
                className="bg-white border-b border-gray-200"
              >
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
                  <ProductGrid
                    products={categoryProducts}
                    title={`Best of ${category.name}`}
                    viewAllLink={`/category/${category._id}`}
                    maxItems={6}
                    gridCols="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {categories.length === 0 && products.length === 0 && (
          <div className="bg-white mx-2 sm:mx-4 lg:mx-6 my-6 rounded-lg shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
              <div className="text-gray-500 text-base sm:text-lg mb-6">
                No products available at the moment
              </div>
              <button
                onClick={fetchData}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium"
              >
                Refresh
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import FlipkartBanner from "./FlipkartBanner";
import CategoryShowcase from "./CategoryShowcase";
import DealsOfTheDay from "./DealsOfTheDay";
import TrendingSection from "./TrendingSection";
import BrandsShowcase from "./BrandsShowcase";
import ProductGrid from "./ProductGrid";

function FlipkartHomePage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [categoryRes, productRes, bannerRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_SERVER}/users/category`),
        axios.get(`${process.env.NEXT_PUBLIC_SERVER}/users/product`),
        axios
          .get(`${process.env.NEXT_PUBLIC_SERVER}/users/banners`)
          .catch(() => ({ data: { data: [] } })),
      ]);

      setCategories(categoryRes.data.data.data || []);
      setProducts(productRes.data.data || []);
      setBanners(bannerRes.data.data || []);
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

  // Loading State
  if (loading) {
    return (
      <div className="bg-muted/30 min-h-screen">
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <div className="space-y-6">
            {/* Banner Skeleton */}
            <div className="bg-white rounded-lg h-64 md:h-80 lg:h-96 animate-pulse"></div>

            {/* Categories Skeleton */}
            <div className="bg-white rounded-lg p-6">
              <div className="h-6 bg-muted rounded w-48 mb-4 animate-pulse"></div>
              <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="text-center">
                    <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-2 animate-pulse"></div>
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Products Skeleton */}
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg p-6">
                <div className="h-6 bg-muted rounded w-64 mb-4 animate-pulse"></div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="border rounded-lg p-3">
                      <div className="aspect-square bg-muted rounded mb-3 animate-pulse"></div>
                      <div className="h-4 bg-muted rounded mb-2 animate-pulse"></div>
                      <div className="h-6 bg-muted rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="bg-muted/30 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 text-center shadow-sm max-w-md">
          <div className="text-destructive text-lg mb-4">{error}</div>
          <button
            onClick={fetchData}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Main Banner */}
          <FlipkartBanner banners={banners} />

          {/* Categories Showcase */}
          <CategoryShowcase categories={categories} />

          {/* Deals of the Day */}
          <DealsOfTheDay products={products} />

          {/* Trending Section */}
          <TrendingSection products={products} />

          {/* Brands Showcase */}
          <BrandsShowcase products={products} />

          {/* Category-wise Products */}
          {categories.map((category) => {
            const categoryProducts = getProductsByCategory(category._id);

            if (categoryProducts.length === 0) return null;

            return (
              <ProductGrid
                key={category._id}
                products={categoryProducts}
                title={`Best of ${category.name}`}
                viewAllLink={`/category/${category._id}`}
                maxItems={6}
                gridCols="grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
              />
            );
          })}

          {/* Empty State */}
          {categories.length === 0 && products.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-16 text-center">
              <div className="text-muted-foreground text-lg mb-4">
                No products available at the moment
              </div>
              <button
                onClick={fetchData}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Refresh
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FlipkartHomePage;

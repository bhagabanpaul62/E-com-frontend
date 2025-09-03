"use client";
import React from "react";
import Banner from "@/components/user/home/Banner";
import CategoryNavigation from "@/components/user/home/CategoryNavigation";
import HorizontalProductSection from "@/components/user/home/HorizontalProductSection";
import ThreeColumnSection from "@/components/user/home/ThreeColumnSection";
import LoadingSkeleton from "@/components/user/home/LoadingSkeleton";
import ErrorState from "@/components/user/home/ErrorState";
import EmptyState from "@/components/user/home/EmptyState";
import { useHomeData } from "@/hooks/useHomeData";

export default function Home() {
  const {
    categories,
    products,
    loading,
    error,
    fetchData,
    getSafeImageUrl,
    getProductsByType,
  } = useHomeData();

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={fetchData} />;
  }

  // Get products by type for different sections
  const electronicsProducts = getProductsByType("electronics");
  const beautyProducts = getProductsByType("beauty");
  const sportsProducts = getProductsByType("sports");

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section with Banner */}
      <div className="w-full">
        <Banner />
      </div>

      {/* Category Navigation - Flipkart Style */}
      <CategoryNavigation
        categories={categories}
        getSafeImageUrl={getSafeImageUrl}
      />

      {/* Best of Electronics Section */}
      <HorizontalProductSection
        title="Best of Electronics"
        products={
          electronicsProducts.length > 0 ? electronicsProducts : products
        }
        categoryLink="/category/electronics"
        getSafeImageUrl={getSafeImageUrl}
        pricePrefix="From ₹"
        subtitle="⭐ 4.3 | 2,34,567 ratings"
      />

      {/* Beauty, Food, Toys & More Section */}
      <HorizontalProductSection
        title="Beauty, Food, Toys & more"
        products={
          beautyProducts.length > 0 ? beautyProducts : products.slice(8, 16)
        }
        categoryLink="/category/lifestyle"
        getSafeImageUrl={getSafeImageUrl}
        pricePrefix="Up to 80% Off"
        subtitle="Top Rated"
      />

      {/* Sports, Healthcare & more Section */}
      <HorizontalProductSection
        title="Sports, Healthcare & more"
        products={
          sportsProducts.length > 0 ? sportsProducts : products.slice(16, 24)
        }
        categoryLink="/category/sports"
        getSafeImageUrl={getSafeImageUrl}
        pricePrefix="Min. 40% Off"
        subtitle="Grab Now!"
      />

      {/* Three Column Section - Flipkart Style */}
      <ThreeColumnSection
        products={products}
        getSafeImageUrl={getSafeImageUrl}
      />

      {/* Empty State */}
      {categories.length === 0 && products.length === 0 && (
        <EmptyState onRefresh={fetchData} />
      )}
    </div>
  );
}

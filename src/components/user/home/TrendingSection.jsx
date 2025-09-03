// Moved from user/TrendingSection.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { FaChartLine, FaStar, FaArrowRight, FaBolt } from "react-icons/fa";

const TrendingSection = ({ products = [] }) => {
  const trendingProducts = products
    .filter(
      (product) =>
        product.isTrending || product.isNewArrival || product.averageRating >= 4
    )
    .slice(0, 8);

  if (trendingProducts.length === 0) return null;

  return (
    <div className="bg-white">
      <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <FaChartLine className="text-blue-600 text-lg sm:text-xl" />
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Trending Now
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Most popular products
              </p>
            </div>
          </div>
          <Link
            href="/trending"
            className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium flex items-center space-x-1 transition-colors"
          >
            <span className="hidden sm:inline">VIEW ALL</span>
            <span className="sm:hidden">All</span>
            <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>

      <div className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-3 lg:gap-4">
          {trendingProducts.map((product, index) => (
            <Link
              key={product._id}
              href={`/product/${product._id}`}
              className="group"
            >
              <div className="bg-white border border-border rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 relative">
                {index < 3 && (
                  <div className="absolute top-2 left-2 bg-chart-2 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1 z-10">
                    <FaBolt className="text-xs" />
                    <span>#{index + 1}</span>
                  </div>
                )}

                <div className="aspect-square bg-muted/50 relative overflow-hidden">
                  <Image
                    src={product.mainImage || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-3 space-y-2">
                  <h3 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>

                  {product.averageRating > 0 && (
                    <div className="flex items-center space-x-1">
                      <div className="flex items-center space-x-1 bg-chart-1 text-white px-2 py-1 rounded text-xs">
                        <span>{product.averageRating.toFixed(1)}</span>
                        <FaStar className="text-xs" />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({product.totalReviews || 0})
                      </span>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-semibold text-foreground">
                      ₹{product.price?.toLocaleString()}
                    </span>
                    {product.mrpPrice && product.mrpPrice > product.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{product.mrpPrice?.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {product.isTrending && (
                      <span className="text-xs bg-chart-2/10 text-chart-2 px-2 py-1 rounded-full">
                        Trending
                      </span>
                    )}
                    {product.isNewArrival && (
                      <span className="text-xs bg-chart-3/10 text-chart-3 px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingSection;

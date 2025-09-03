"use client";

import ProductCard from "./ProductCard";
import Link from "next/link";
import { FaStar } from "react-icons/fa";

const ProductGrid = ({
  products = [],
  title,
  viewAllLink,
  maxItems = 6,
  gridCols = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
  view = "grid",
  compact = false,
  showVariants = true,
  showTags = true,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
}) => {
  if (products.length === 0) return null;

  return (
    <div className="bg-white">
      {title && (
        <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              {title}
            </h2>
            {viewAllLink && (
              <Link
                href={viewAllLink}
                className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium flex items-center space-x-1 transition-colors"
              >
                <span className="hidden sm:inline">VIEW ALL</span>
                <span className="sm:hidden">All</span>
                <FaStar className="text-xs" />
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className={`grid ${gridCols} gap-2 sm:gap-3 lg:gap-4`}>
          {products.slice(0, maxItems).map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              view={view}
              compact={compact}
              showVariants={showVariants}
              showTags={showTags}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;

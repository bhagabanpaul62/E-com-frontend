"use client";

import Link from "next/link";
import Image from "next/image";
import { FaArrowRight, FaTags } from "react-icons/fa";

const BrandsShowcase = ({ brands = [], products = [] }) => {
  // Extract unique brands from products if brands array is not provided
  const uniqueBrands =
    brands.length > 0
      ? brands
      : [...new Set(products.map((p) => p.brand).filter(Boolean))].map(
          (brand) => ({
            name: brand,
            logo: null,
            _id: brand.toLowerCase().replace(/\s+/g, "-"),
          })
        );

  if (uniqueBrands.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FaTags className="text-chart-3 text-xl" />
            <div>
              <h2 className="text-xl font-medium text-foreground">
                Top Brands
              </h2>
              <p className="text-sm text-muted-foreground">Explore by brand</p>
            </div>
          </div>
          <Link
            href="/brands"
            className="text-primary hover:text-primary/80 text-sm font-medium flex items-center space-x-1"
          >
            <span>VIEW ALL</span>
            <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {uniqueBrands.slice(0, 12).map((brand) => {
            const brandProducts = products.filter(
              (p) => p.brand?.toLowerCase() === brand.name?.toLowerCase()
            );

            return (
              <Link
                key={brand._id}
                href={`/brand/${brand._id}`}
                className="group"
              >
                <div className="bg-white border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200 text-center">
                  {/* Brand Logo */}
                  <div className="w-16 h-16 mx-auto mb-3 rounded-lg overflow-hidden bg-muted/50 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    {brand.logo ? (
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center">
                        <span className="text-xl font-bold text-primary">
                          {brand.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Brand Name */}
                  <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {brand.name}
                  </h3>

                  {/* Product Count */}
                  {brandProducts.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {brandProducts.length} product
                      {brandProducts.length !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BrandsShowcase;

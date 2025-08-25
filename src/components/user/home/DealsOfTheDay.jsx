// Moved from user/DealsOfTheDay.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { FaFire, FaClock, FaArrowRight } from "react-icons/fa";
import { useState, useEffect } from "react";

const DealsOfTheDay = ({ products = [] }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          hours = 23;
          minutes = 59;
          seconds = 59;
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const dealProducts = products
    .filter(
      (product) =>
        product.discount > 0 ||
        (product.mrpPrice && product.price < product.mrpPrice)
    )
    .slice(0, 8);

  if (dealProducts.length === 0) return null;

  return (
    <div className="bg-white">
      <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <FaFire className="text-red-500 text-lg sm:text-xl" />
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Deals of the Day
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Limited time offers
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <FaClock className="text-red-500 hidden sm:block" />
            <div className="flex items-center space-x-1 text-xs sm:text-sm font-mono">
              <div className="bg-red-500 text-white px-1.5 sm:px-2 py-1 rounded">
                {String(timeLeft.hours).padStart(2, "0")}
              </div>
              <span className="text-gray-900">:</span>
              <div className="bg-red-500 text-white px-1.5 sm:px-2 py-1 rounded">
                {String(timeLeft.minutes).padStart(2, "0")}
              </div>
              <span className="text-gray-900">:</span>
              <div className="bg-red-500 text-white px-1.5 sm:px-2 py-1 rounded">
                {String(timeLeft.seconds).padStart(2, "0")}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-3 lg:gap-4">
          {dealProducts.map((product) => {
            const discountPercent =
              product.discount ||
              (product.mrpPrice && product.price
                ? Math.round(
                    ((product.mrpPrice - product.price) / product.mrpPrice) *
                      100
                  )
                : 0);

            return (
              <Link
                key={product._id}
                href={`/product/${product._id}`}
                className="group"
              >
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 relative">
                  <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-2 sm:px-3 py-1 rounded-br-lg z-10">
                    {discountPercent}% OFF
                  </div>

                  <div className="aspect-square bg-gray-50 relative overflow-hidden">
                    <Image
                      src={product.mainImage || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-2 sm:p-3 space-y-1 sm:space-y-2">
                    <h3 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
                      {product.name}
                    </h3>

                    <div className="space-y-0.5 sm:space-y-1">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <span className="text-sm sm:text-lg font-bold text-red-600">
                          ₹{product.price?.toLocaleString()}
                        </span>
                        {product.mrpPrice &&
                          product.mrpPrice > product.price && (
                            <span className="text-xs text-gray-500 line-through">
                              ₹{product.mrpPrice?.toLocaleString()}
                            </span>
                          )}
                      </div>

                      <div className="text-xs text-green-600 font-medium">
                        Save ₹
                        {(
                          (product.mrpPrice || 0) - (product.price || 0)
                        ).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-6">
          <Link
            href="/deals"
            className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <span>View All Deals</span>
            <FaArrowRight className="text-sm" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DealsOfTheDay;

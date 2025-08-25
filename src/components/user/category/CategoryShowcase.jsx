// Moved from user/CategoryShowcase.jsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";

const CategoryShowcase = ({ categories = [] }) => {
  if (categories.length === 0) return null;
  return (
    <div className="bg-white">
      <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Shop by Category
          </h2>
          <Link
            href="/categories"
            className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium flex items-center space-x-1 transition-colors"
          >
            <span className="hidden sm:inline">VIEW ALL</span>
            <span className="sm:hidden">All</span>
            <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>
      <div className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2 sm:gap-3 lg:gap-4">
          {categories.slice(0, 12).map((category) => (
            <Link
              key={category._id}
              href={`/category/${category._id}`}
              className="group flex flex-col items-center"
            >
              <div className="text-center w-full">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 mx-auto mb-1 sm:mb-2 rounded-full overflow-hidden bg-gray-100 group-hover:scale-105 transition-all duration-200 border-2 border-transparent group-hover:border-blue-200 shadow-sm">
                  {category.image &&
                  (category.image.startsWith("http") ||
                    category.image.startsWith("/")) ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={72}
                      height={72}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                      <span className="text-sm sm:text-base md:text-lg font-semibold text-blue-600">
                        {category.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors text-center line-clamp-2 leading-tight">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryShowcase;

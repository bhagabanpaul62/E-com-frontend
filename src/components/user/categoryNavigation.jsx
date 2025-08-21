"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronRight, FaTags, FaFire } from "react-icons/fa";
import Image from "next/image";

function CategoryNavigation() {
  const [category, setCategory] = useState([]);
  const [hoveredCategoryId, setHoveredCategory] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const GetCategory = async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching categories...");

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/users/category`
      );

      console.log("✅ Raw API Response:", res.data);
      console.log("📊 Categories data:", res.data.data.data);

      const categoriesData = res.data.data.data || [];
      console.log("🎯 Setting categories:", categoriesData);
      console.log("📈 Number of categories:", categoriesData.length);

      setCategory(categoriesData);
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetCategory();
  }, []);

  // Debug logging for category state changes
  useEffect(() => {
    console.log("🔄 Category state updated:", category);
    console.log("📊 Category count:", category.length);
    if (category.length > 0) {
      console.log("📋 Sample category structure:", category[0]);
    }
  }, [category]);

  // Build Recursive Tree
  function buildCategoryTree(categories, parentId = null) {
    console.log(
      `🌳 Building tree for parentId: ${parentId}, total categories: ${categories.length}`
    );

    const filteredCategories = categories.filter((cat) => {
      if (!cat.parentId && parentId === null) return true;
      if (cat.parentId && parentId !== null) {
        return cat.parentId.toString() === parentId.toString();
      }
      return false;
    });

    console.log(
      `🔍 Filtered categories for parentId ${parentId}:`,
      filteredCategories.length
    );

    return filteredCategories.map((cat) => ({
      ...cat,
      Children: buildCategoryTree(categories, cat._id),
    }));
  }

  const categoryTree = buildCategoryTree(category);
  console.log("🌲 Final category tree:", categoryTree);
  console.log("🎯 Tree length:", categoryTree.length);

  // Get featured categories (top 6)
  const featuredCategories = categoryTree.slice(0, 6);
  const moreCategories = categoryTree.slice(6);

  console.log("⭐ Featured categories:", featuredCategories.length);
  console.log("📚 More categories:", moreCategories.length);

  // Flipkart-style mega menu renderer
  const renderFlipkartMenu = (cats) => {
    return (
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            {/* Featured Categories */}
            <div className="flex items-center space-x-8">
              {featuredCategories.map((cat) => (
                <div
                  key={cat._id}
                  className=" group"
                  onMouseEnter={() => {
                    setHoveredCategory(cat._id);
                    setIsMenuOpen(true);
                  }}
                  onMouseLeave={() => {
                    setHoveredCategory("");
                    setIsMenuOpen(false);
                  }}
                >
                  <div className="flex items-center space-x-1 py-3 px-2 cursor-pointer group-hover:text-blue-600 transition-colors">
                    <span className="font-medium text-sm text-gray-700 group-hover:text-blue-600">
                      {cat.name}
                    </span>
                    {cat.Children.length > 0 && (
                      <FaChevronDown className="text-xs text-gray-400 group-hover:text-blue-600 transition-transform group-hover:rotate-180" />
                    )}
                  </div>

                  {/* Mega Menu Dropdown */}
                  {cat.Children.length > 0 &&
                    isMenuOpen &&
                    hoveredCategoryId === cat._id && (
                      <div className="absolute left-32 top-full w-screen max-w-5xl bg-white shadow-2xl border border-gray-200 z-50 mega-menu-enter">
                        <div className="flex">
                          {/* Left Side - Subcategories */}
                          <div className="w-1/4 bg-gray-50 p-6 border-r border-gray-200">
                            <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
                              <FaTags className="mr-2 text-blue-600" />
                              {cat.name}
                            </h3>
                            <div className="space-y-3">
                              {cat.Children.slice(0, 8).map((subCat) => (
                                <div key={subCat._id} className="group/sub">
                                  <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                                    <span className="font-medium text-gray-700 group-hover/sub:text-blue-600">
                                      {subCat.name}
                                    </span>
                                    {subCat.Children.length > 0 && (
                                      <FaChevronRight className="text-xs text-gray-400" />
                                    )}
                                  </div>
                                </div>
                              ))}
                              {cat.Children.length > 8 && (
                                <div className="pt-2 border-t border-gray-300">
                                  <span className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium text-sm">
                                    View All {cat.name} →
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Middle - Popular Subcategories */}
                          <div className="w-2/4 p-6">
                            <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                              <FaFire className="mr-2 text-orange-500" />
                              Popular in {cat.name}
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                              {cat.Children.slice(0, 6).map((subCat) => (
                                <div key={subCat._id} className="group/popular">
                                  <div className="p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors">
                                    <h5 className="font-semibold text-gray-800 group-hover/popular:text-blue-600 mb-2">
                                      {subCat.name}
                                    </h5>
                                    <div className="space-y-1">
                                      {subCat.Children.slice(0, 4).map(
                                        (subSubCat) => (
                                          <div
                                            key={subSubCat._id}
                                            className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer"
                                          >
                                            {subSubCat.name}
                                          </div>
                                        )
                                      )}
                                      {subCat.Children.length > 4 && (
                                        <div className="text-xs text-blue-600 hover:underline cursor-pointer">
                                          +{subCat.Children.length - 4} more
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Right Side - Featured Products/Offers */}
                          <div className="w-1/4 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
                            <h4 className="font-bold text-gray-800 mb-4">
                              Featured Deals
                            </h4>
                            <div className="space-y-4">
                              {/* Sample Featured Product */}
                              <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                <div className="w-full h-20 bg-gray-200 rounded-md mb-3 flex items-center justify-center">
                                  <span className="text-gray-400 text-xs">
                                    {cat.image}
                                  </span>
                                </div>
                                <h6 className="font-medium text-sm text-gray-800 mb-1">
                                  Top Deals in {cat.name}
                                </h6>
                                <div className="flex items-center space-x-2">
                                  <span className="text-green-600 font-bold text-sm">
                                    Up to 70% Off
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Limited Time Offer
                                </div>
                              </div>

                              {/* Promotional Banner */}
                              <div className="bg-gradient-to-r from-orange-400 to-pink-400 rounded-lg p-4 text-white text-center">
                                <div className="font-bold text-sm mb-1">
                                  Special Offer
                                </div>
                                <div className="text-xs opacity-90">
                                  Extra 10% off on {cat.name}
                                </div>
                                <div className="text-xs opacity-75 mt-1">
                                  Use code: SAVE10
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              ))}
            </div>

            {/* More Categories Dropdown */}
            {moreCategories.length > 0 && (
              <div
                className="relative group"
                onMouseEnter={() => {
                  setHoveredCategory("more");
                  setIsMenuOpen(true);
                }}
                onMouseLeave={() => {
                  setHoveredCategory("");
                  setIsMenuOpen(false);
                }}
              >
                <div className="flex items-center space-x-1 py-3 px-3 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors">
                  <span className="font-medium text-sm text-gray-700">
                    More
                  </span>
                  <FaChevronDown className="text-xs text-gray-400 group-hover:rotate-180 transition-transform" />
                </div>

                {/* More Categories Dropdown */}
                {isMenuOpen && hoveredCategoryId === "more" && (
                  <div className="absolute right-0 top-full mt-1 w-80 bg-white shadow-2xl border border-gray-200 rounded-lg z-50 mega-menu-enter">
                    <div className="p-4">
                      <h4 className="font-bold text-gray-800 mb-3">
                        All Categories
                      </h4>
                      <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                        {moreCategories.map((cat) => (
                          <div
                            key={cat._id}
                            className="p-2 hover:bg-gray-50 rounded cursor-pointer group/more"
                          >
                            <div className="font-medium text-sm text-gray-700 group-hover/more:text-blue-600">
                              {cat.name}
                            </div>
                            {cat.Children.length > 0 && (
                              <div className="text-xs text-gray-500 mt-1">
                                {cat.Children.length} subcategories
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <nav className="w-full bg-white shadow-sm sticky top-16 z-40">
      {loading ? (
        // Loading state
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-12">
              <div className="flex items-center space-x-8">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-1 py-3 px-2"
                  >
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : category.length === 0 ? (
        // Empty state
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-center h-12">
              <div className="text-gray-500 text-sm">
                No categories available
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Normal state with categories
        <>
         

          {categoryTree.length > 0 ? (
            renderFlipkartMenu(categoryTree)
          ) : (
            // Fallback: Display raw categories if tree building fails
            <div className="bg-white border-b border-gray-200 shadow-sm">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-12">
                  <div className="flex items-center space-x-8">
                    {category.slice(0, 6).map((cat) => (
                      <div key={cat._id} className="py-3 px-2">
                        <span className="font-medium text-sm text-gray-700">
                          {cat.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <style jsx global>{`
        @keyframes megaMenuEnter {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mega-menu-enter {
          animation: megaMenuEnter 0.2s ease-out forwards;
        }

        /* Custom scrollbar for overflow areas */
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 2px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 2px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        /* Hover effects for mega menu items */
        .group\/sub:hover .bg-white {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .group\/popular:hover {
          transform: translateY(-1px);
        }

        /* Enhanced dropdown shadow */
        .shadow-2xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </nav>
  );
}

export default CategoryNavigation;

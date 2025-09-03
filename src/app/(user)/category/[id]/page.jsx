"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { FaFilter, FaChevronDown, FaHeart, FaRegHeart } from "react-icons/fa";
import ProductCard from "@/components/user/product/ProductCard";
import ProductGrid from "@/components/user/product/ProductGrid";

export default function CategoryPage({ params }) {
  const { id } = params;
  console.log("our param is ::",id);
  
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [viewMode, setViewMode] = useState("grid");
  const [allCategories, setAllCategories] = useState([]);

  // Fetch category details and products
  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      setIsLoading(true);
      try {
        // Fetch the current category
        const categoryRes = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER}/api/users/category/${id}`
        );
        const currentCategory = categoryRes.data.data;
        setCategory(currentCategory);

        // Fetch all categories to find subcategories
        const allCategoriesRes = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER}/api/users/category`
        );
        const categories = allCategoriesRes.data.data.data || [];
        setAllCategories(categories);

        // Get subcategories of current category
        const subs = categories.filter(
          (cat) => cat.parentId && cat.parentId.toString() === id.toString()
        );
        setSubCategories(subs);

        // Fetch products for this category and its subcategories
        const productRes = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER}/api/users/products`
        );
        let allProducts = productRes.data.data.data || [];

        // Filter products by category ID (including subcategories)
        const categoryIds = [id, ...subs.map((sub) => sub._id)];
        const filteredProducts = allProducts.filter(
          (product) =>
            product.categoryId &&
            categoryIds.includes(product.categoryId._id || product.categoryId)
        );

        setProducts(filteredProducts);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [id]);

  // Apply filters to products
  const filteredAndSortedProducts = () => {
    let filtered = [...products];

    // Apply price filter
    if (priceRange === "low") {
      filtered = filtered.filter((p) => p.price < 1000);
    } else if (priceRange === "medium") {
      filtered = filtered.filter((p) => p.price >= 1000 && p.price < 5000);
    } else if (priceRange === "high") {
      filtered = filtered.filter((p) => p.price >= 5000);
    }

    // Apply sorting
    if (sortBy === "latest") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "discount") {
      filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    }

    return filtered;
  };

  const displayProducts = filteredAndSortedProducts();

  // Find breadcrumb path
  const getBreadcrumbPath = () => {
    if (!category) return [];

    const path = [{ name: category.name, id: category._id }];
    let currentCat = category;

    // Trace back to parent categories
    while (currentCat.parentId) {
      const parent = allCategories.find((c) => c._id === currentCat.parentId);
      if (parent) {
        path.unshift({ name: parent.name, id: parent._id });
        currentCat = parent;
      } else {
        break;
      }
    }

    // Add Home at the beginning
    path.unshift({ name: "Home", id: null });
    return path;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-8">
      {/* Breadcrumb */}
      <div className="bg-white py-3 shadow-sm mb-4">
        <div className="container mx-auto px-4">
          <div className="flex text-sm text-gray-500">
            {getBreadcrumbPath().map((item, index, array) => (
              <div key={index} className="flex items-center">
                {index > 0 && <span className="mx-2">/</span>}
                {index === array.length - 1 ? (
                  <span className="font-medium text-gray-800">{item.name}</span>
                ) : (
                  <Link
                    href={item.id ? `/category/${item.id}` : "/"}
                    className="hover:text-orange-500"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Title */}
      <div className="container mx-auto px-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {category ? category.name : "Products"}
          <span className="text-sm font-normal text-gray-500 ml-2">
            Found {displayProducts.length} products
          </span>
        </h1>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4 w-full">
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Filters</h2>
                <button
                  className="text-sm text-orange-500 hover:underline"
                  onClick={() => {
                    setPriceRange("all");
                    setSortBy("latest");
                  }}
                >
                  Clear Filters
                </button>
              </div>

              {/* Search */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-2 pl-3 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Search products..."
                  />
                </div>
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="relative">
                  <select className="w-full border border-gray-300 rounded-lg p-2 pr-10 appearance-none focus:ring-orange-500 focus:border-orange-500">
                    <option value="">All Categories</option>
                    {subCategories.map((subCat) => (
                      <option key={subCat._id} value={subCat._id}>
                        {subCat.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <FaChevronDown className="text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="relative">
                  <select
                    className="w-full border border-gray-300 rounded-lg p-2 pr-10 appearance-none focus:ring-orange-500 focus:border-orange-500"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                  >
                    <option value="all">Any Price</option>
                    <option value="low">Under ₹1,000</option>
                    <option value="medium">₹1,000 - ₹5,000</option>
                    <option value="high">Above ₹5,000</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <FaChevronDown className="text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Other filter options can be added here */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="new"
                      type="checkbox"
                      className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="new" className="ml-2 text-sm text-gray-600">
                      New
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="used"
                      type="checkbox"
                      className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="used"
                      className="ml-2 text-sm text-gray-600"
                    >
                      Used
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="lg:w-3/4 w-full">
            {/* Sorting and view options */}
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <div className="mb-3 sm:mb-0">
                  <button
                    className="p-2 bg-gray-100 rounded-md text-gray-600 hover:bg-gray-200"
                    onClick={() => {
                      const filterBtn =
                        document.getElementById("filters-sidebar");
                      if (filterBtn) {
                        filterBtn.classList.toggle("hidden");
                      }
                    }}
                  >
                    <FaFilter className="inline mr-2" /> Filter
                  </button>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Sort By */}
                  <div className="flex items-center">
                    <label className="text-sm text-gray-600 mr-2">
                      Sort by:
                    </label>
                    <div className="relative">
                      <select
                        className="border border-gray-300 rounded-lg py-1 px-3 pr-8 appearance-none focus:ring-orange-500 focus:border-orange-500 text-sm"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="latest">Latest First</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="discount">Highest Discount</option>
                      </select>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                        <FaChevronDown className="text-gray-400 text-xs" />
                      </div>
                    </div>
                  </div>

                  {/* View Mode */}
                  <div className="flex space-x-1">
                    <button
                      className={`p-1 rounded ${
                        viewMode === "grid"
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                      onClick={() => setViewMode("grid")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                        />
                      </svg>
                    </button>
                    <button
                      className={`p-1 rounded ${
                        viewMode === "list"
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                      onClick={() => setViewMode("list")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Display products */}
            {displayProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="text-gray-500 mb-4">
                  No products found in this category
                </div>
                <Link href="/" className="text-orange-500 hover:underline">
                  Browse all products
                </Link>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {displayProducts.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-lg shadow overflow-hidden"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {displayProducts.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-lg shadow overflow-hidden"
                  >
                    <ProductCard product={product} view="list" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

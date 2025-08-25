"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaTh, FaList, FaFilter, FaSort } from "react-icons/fa";
import ProductCard from "@/components/user/product/ProductCard";

const CategoryPage = () => {
  const params = useParams();
  const categoryId = params.id;

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  useEffect(() => {
    if (categoryId) {
      fetchCategoryData();
    }
  }, [categoryId]);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, sortBy, priceRange]);

  const fetchCategoryData = async () => {
    try {
      setLoading(true);

      // Fetch category details
      const categoryResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/users/category/${categoryId}`
      );
      if (!categoryResponse.ok) {
        throw new Error("Category not found");
      }
      const categoryData = await categoryResponse.json();
      if (categoryData.success) {
        setCategory(categoryData.data.data);
      }

      // Fetch products for this category
      const productsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/users/product?category=${categoryId}`
      );
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        if (productsData.success) {
          setProducts(productsData.data || []);
        }
      }

      // Fetch subcategories
      const categoriesResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/users/category`
      );
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        if (categoriesData.success) {
          const subs = (categoriesData.data.data || []).filter(
            (cat) => cat.parentId === categoryId
          );
          setSubcategories(subs);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Apply price filter
    if (priceRange.min !== "" || priceRange.max !== "") {
      filtered = filtered.filter((product) => {
        const price = product.price || 0;
        const min = priceRange.min === "" ? 0 : parseFloat(priceRange.min);
        const max =
          priceRange.max === "" ? Infinity : parseFloat(priceRange.max);
        return price >= min && price <= max;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  const handlePriceRangeChange = (field, value) => {
    setPriceRange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || "Category not found"}</p>
            <Link
              href="/categories"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse All Categories
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/categories"
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                <span className="hidden sm:inline">Categories</span>
                <span className="sm:hidden">Back</span>
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {category.name}
                </h1>
                {category.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {category.description}
                  </p>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {filteredProducts.length} products
            </div>
          </div>

          {/* Subcategories */}
          {subcategories.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Subcategories:
              </h3>
              <div className="flex flex-wrap gap-2">
                {subcategories.map((subcat) => (
                  <Link
                    key={subcat._id}
                    href={`/category/${subcat._id}`}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
                  >
                    {subcat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Filters and Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Price Filter */}
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-400" />
              <span className="text-sm text-gray-600">Price:</span>
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => handlePriceRangeChange("min", e.target.value)}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => handlePriceRangeChange("max", e.target.value)}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center space-x-4">
              {/* Sort Options */}
              <div className="flex items-center space-x-2">
                <FaSort className="text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="name">Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>

              {/* View Type Toggle */}
              <div className="flex items-center bg-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewType("grid")}
                  className={`p-2 rounded transition-colors ${
                    viewType === "grid"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <FaTh />
                </button>
                <button
                  onClick={() => setViewType("list")}
                  className={`p-2 rounded transition-colors ${
                    viewType === "list"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <FaList />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Content */}
      <div className="container mx-auto px-4 py-6">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <div className="w-16 h-16 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-500">
              No products available in this category yet.
            </p>
          </div>
        ) : (
          <>
            {viewType === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    view="grid"
                    compact={true}
                    showVariants={true}
                    showTags={true}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    view="list"
                    compact={false}
                    showVariants={true}
                    showTags={true}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;

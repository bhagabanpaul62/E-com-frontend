"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaSearch, FaGrid, FaList, FaArrowLeft } from "react-icons/fa";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewType, setViewType] = useState("grid"); // grid or list
  const [filter, setFilter] = useState("all"); // all, parent, child

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    filterCategories();
  }, [categories, searchTerm, filter]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/category/get");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      } else {
        setError("Failed to load categories");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterCategories = () => {
    let filtered = categories;

    // Apply filter type
    if (filter === "parent") {
      filtered = filtered.filter(
        (category) =>
          !category.parentId ||
          category.parentId === null ||
          category.parentId === undefined
      );
    } else if (filter === "child") {
      filtered = filtered.filter(
        (category) =>
          category.parentId &&
          category.parentId !== null &&
          category.parentId !== undefined
      );
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCategories(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleViewTypeChange = (newViewType) => {
    setViewType(newViewType);
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchCategories}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
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
                href="/"
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Back</span>
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                All Categories
              </h1>
            </div>
            <div className="text-sm text-gray-500">
              {filteredCategories.length} categories
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-4">
              {/* Filter Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleFilterChange("all")}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filter === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => handleFilterChange("parent")}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filter === "parent"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Parent
                </button>
                <button
                  onClick={() => handleFilterChange("child")}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filter === "child"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Child
                </button>
              </div>

              {/* View Type Toggle */}
              <div className="flex items-center bg-gray-200 rounded-lg p-1">
                <button
                  onClick={() => handleViewTypeChange("grid")}
                  className={`p-2 rounded transition-colors ${
                    viewType === "grid"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <FaGrid />
                </button>
                <button
                  onClick={() => handleViewTypeChange("list")}
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

      {/* Categories Content */}
      <div className="container mx-auto px-4 py-6">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FaSearch className="mx-auto text-4xl mb-4" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No categories found
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? `No categories match "${searchTerm}"`
                : "No categories available"}
            </p>
          </div>
        ) : (
          <>
            {viewType === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {filteredCategories.map((category) => (
                  <Link
                    key={category._id}
                    href={`/category/${category._id}`}
                    className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200 hover:border-blue-200"
                  >
                    <div className="aspect-square relative bg-gray-100">
                      {category.image &&
                      (category.image.startsWith("http") ||
                        category.image.startsWith("/")) ? (
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                          <span className="text-2xl font-bold text-blue-600">
                            {category.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      {category.parentId && (
                        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                          Sub
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredCategories.map((category) => (
                  <Link
                    key={category._id}
                    href={`/category/${category._id}`}
                    className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-blue-200 block"
                  >
                    <div className="flex items-center p-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 mr-4">
                        {category.image &&
                        (category.image.startsWith("http") ||
                          category.image.startsWith("/")) ? (
                          <Image
                            src={category.image}
                            alt={category.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                            <span className="text-lg font-bold text-blue-600">
                              {category.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {category.name}
                          </h3>
                          {category.parentId && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              Subcategory
                            </span>
                          )}
                        </div>
                        {category.description && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;

"use client";
import { useEffect, useState, useMemo } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

import axios from "axios";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Icons
import {
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  BarChart4,
  Tag,
  Package,
  ShoppingCart,
  Star,
  Eye,
  Clock,
  Loader2,
  Check,
  X,
} from "lucide-react";

export default function AdminProductList() {
  // State management
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedVariants, setExpandedVariants] = useState({});
  const [selectedVariantImage, setSelectedVariantImage] = useState({});

  // Filters and sorting
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Bulk actions
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [bulkActionOpen, setBulkActionOpen] = useState(false);

  // Modals
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  // Variant delete modal state
  const [showDeleteVariantPopup, setShowDeleteVariantPopup] = useState(false);
  const [deleteVariantContext, setDeleteVariantContext] = useState({
    productId: null,
    variantId: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  // Analytics summary
  const [analytics, setAnalytics] = useState({
    totalProducts: 0,
    activeProducts: 0,
    outOfStock: 0,
    lowStock: 0,
    InactiveProduct: 0,
    categories: [],
  });

  // Edit variant state
  const [showEditVariantModal, setShowEditVariantModal] = useState(false);
  const [editingVariantId, setEditingVariantId] = useState(null);

  const [editingVariant, setEditingVariant] = useState(null);
  const [editingVariantProductId, setEditingVariantProductId] = useState(null);
  const [variantForm, setVariantForm] = useState({
    sku: "",
    price: "",
    stock: "",
  });

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER}/admin/view-products`,
          { withCredentials: true }
        );
        const productsData = res.data.data;
        setProducts(productsData);

        // Calculate analytics
        const activeCount = productsData.filter(
          (p) => p.status === "active"
        ).length;
        const inactiveCount = productsData.filter(
          (p) => p.status === "inactive"
        ).length;

        const outOfStockCount = productsData.filter(
          (p) => !p.totalStock || p.totalStock <= 0
        ).length;
        const lowStockCount = productsData.filter(
          (p) => p.totalStock > 0 && p.totalStock < 10
        ).length;

        // Get unique categories
        const uniqueCategories = Array.from(
          new Set(productsData.map((p) => p.categoryId?.name).filter(Boolean))
        );

        setAnalytics({
          totalProducts: productsData.length,
          activeProducts: activeCount,
          InactiveProduct: inactiveCount,
          outOfStock: outOfStockCount,
          lowStock: lowStockCount,
          categories: uniqueCategories,
        });

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching products", err);
        setError("Failed to load products. Please try again.");
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters, sorting, and pagination
  useEffect(() => {
    let result = [...products];

    // Apply status filter
    if (filter !== "All") {
      result = result.filter(
        (p) => p.status.toLowerCase() === filter.toLowerCase()
      );
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.sku?.toLowerCase().includes(searchLower) ||
          p.brand?.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (categoryFilter !== "All") {
      result = result.filter((p) => p.categoryId?.name === categoryFilter);
    }

    // Apply stock filter
    if (stockFilter === "In Stock") {
      result = result.filter((p) => p.totalStock > 0);
    } else if (stockFilter === "Out of Stock") {
      result = result.filter((p) => !p.totalStock || p.totalStock <= 0);
    } else if (stockFilter === "Low Stock") {
      result = result.filter((p) => p.totalStock > 0 && p.totalStock < 10);
    }

    // Apply price range filter
    if (priceRange.min) {
      result = result.filter((p) => p.price >= Number(priceRange.min));
    }
    if (priceRange.max) {
      result = result.filter((p) => p.price <= Number(priceRange.max));
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle nested fields
      if (sortField === "categoryId.name") {
        aValue = a.categoryId?.name || "";
        bValue = b.categoryId?.name || "";
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredProducts(result);
  }, [
    products,
    filter,
    search,
    sortField,
    sortDirection,
    categoryFilter,
    stockFilter,
    priceRange,
  ]);

  // Get paginated products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Handle sort toggle
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (id) => {
    setDeleteProductId(id);
    setShowDeletePopup(true);
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER}/admin/delete-product/${deleteProductId}`,
        { withCredentials: true }
      );

      setProducts((prev) =>
        prev.filter((product) => product._id !== deleteProductId)
      );

      setShowDeletePopup(false);
      setDeleteProductId(null);
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  // Handle variant delete
  const handleDeleteVariant = async () => {
    const { productId, variantId } = deleteVariantContext;
    if (!productId || !variantId) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER}/admin/delete-variant/${variantId}`,
        { withCredentials: true }
      );
      setProducts((prev) =>
        prev.map((p) =>
          p._id === productId
            ? {
                ...p,
                variants: p.variants.filter((v) => v._id !== variantId),
                totalStock: p.variants
                  .filter((v) => v._id !== variantId)
                  .reduce((sum, v) => sum + (v.stock || 0), 0),
              }
            : p
        )
      );
    } catch (err) {
      alert("Failed to delete variant.");
    } finally {
      setShowDeleteVariantPopup(false);
      setDeleteVariantContext({ productId: null, variantId: null });
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;

    try {
      // In a real implementation, you might want to use a batch delete endpoint
      // For now, we'll delete one by one
      for (const id of selectedProducts) {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_SERVER}/admin/delete-product/${id}`,
          { withCredentials: true }
        );
      }

      setProducts((prev) =>
        prev.filter((product) => !selectedProducts.includes(product._id))
      );

      setSelectedProducts([]);
      setBulkActionOpen(false);
    } catch (err) {
      console.error("Failed to delete products in bulk", err);
    }
  };

  // Handle bulk status update
  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedProducts.length === 0) return;

    try {
      // In a real implementation, you might want to use a batch update endpoint
      // For now, we'll update one by one
      for (const id of selectedProducts) {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_SERVER}/admin/edit-status/${id}`,
          { status: newStatus },
          { withCredentials: true }
        );
      }

      setProducts((prev) =>
        prev.map((product) =>
          selectedProducts.includes(product._id)
            ? { ...product, status: newStatus }
            : product
        )
      );

      setSelectedProducts([]);
      setBulkActionOpen(false);
    } catch (err) {
      console.error("Failed to update product status in bulk", err);
    }
  };

  // Handle status update
  const editStatus = async (id, newStatus) => {
    try {
      setIsEditing(true);
      setEditingProductId(id);

      await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER}/admin/edit-status/${id}`,
        { status: newStatus },
        { withCredentials: true }
      );

      setProducts((prev) => {
        const updated = prev.map((product) =>
          product._id === id ? { ...product, status: newStatus } : product
        );
        // Update analytics after status change
        const activeCount = updated.filter((p) => p.status === "active").length;
        const inactiveCount = updated.filter(
          (p) => p.status === "inactive"
        ).length;
        const outOfStockCount = updated.filter(
          (p) => !p.totalStock || p.totalStock <= 0
        ).length;
        const lowStockCount = updated.filter(
          (p) => p.totalStock > 0 && p.totalStock < 10
        ).length;
        const uniqueCategories = Array.from(
          new Set(updated.map((p) => p.categoryId?.name).filter(Boolean))
        );
        setAnalytics({
          totalProducts: updated.length,
          activeProducts: activeCount,
          InactiveProduct: inactiveCount,
          outOfStock: outOfStockCount,
          lowStock: lowStockCount,
          categories: uniqueCategories,
        });
        return updated;
      });

      setIsEditing(false);
      setEditingProductId(null);
    } catch (error) {
      console.error("Failed to update status:", error);
      setIsEditing(false);
      setEditingProductId(null);
    }
  };

  // Handle price update
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [newMrp, setNewMrp] = useState("");
  const [isEditingPrice, setIsEditingPrice] = useState(false);

  const editPrice = async (id, price, priceMrp) => {
    try {
      setIsEditingPrice(true);

      await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER}/admin/edit-status/${id}`,
        { price, mrpPrice: priceMrp },
        { withCredentials: true }
      );

      setProducts((prev) =>
        prev.map((product) =>
          product._id === id
            ? { ...product, price, mrpPrice: priceMrp }
            : product
        )
      );

      setIsEditingPrice(false);
      setEditingPriceId(null);
      setNewPrice("");
    } catch (error) {
      console.error("Failed to update price:", error);
      setIsEditingPrice(false);
      setEditingPriceId(null);
    }
  };

  // Handle stock update
  const [editingStockId, setEditingStockId] = useState(null);
  const [newStock, setNewStock] = useState("");
  const [isEditingStock, setIsEditingStock] = useState(false);

  const editStock = async (id, totalStock) => {
    try {
      setIsEditingStock(true);

      await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER}/admin/edit-stock/${id}`,
        { totalStock },
        { withCredentials: true }
      );

      setProducts((prev) =>
        prev.map((product) =>
          product._id === id ? { ...product, totalStock } : product
        )
      );

      setIsEditingStock(false);
      setEditingStockId(null);
      setNewStock("");
    } catch (error) {
      console.error("Failed to update stock:", error);
      setIsEditingStock(false);
      setEditingStockId(null);
    }
  };

  // Handle select all products
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(paginatedProducts.map((p) => p._id));
    } else {
      setSelectedProducts([]);
    }
  };

  // Handle select individual product
  const handleSelectProduct = (id) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(
        selectedProducts.filter((productId) => productId !== id)
      );
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  // Export products as CSV
  const exportProductsCSV = () => {
    const headers = ["ID", "Name", "Category", "Price", "Stock", "Status"];

    const csvData = filteredProducts.map((product) => [
      product._id,
      product.name,
      product.categoryId?.name || "No Category",
      product.price,
      product.totalStock || 0,
      product.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "products.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get unique categories for filter
  const uniqueCategories = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(products.map((p) => p.categoryId?.name).filter(Boolean))
      ),
    ];
  }, [products]);

  const [openMenuId, setOpenMenuId] = useState(null);

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const openEditVariantModal = (productId, variant) => {
    setEditingVariantProductId(productId);
    setEditingVariantId(`${productId}-${variant._id}`);
    setEditingVariant(variant);
    setVariantForm({
      sku: variant.sku || "",
      price: variant.price || "",
      stock: variant.stock || "",
    });
    setShowEditVariantModal(true);
  };

  const handleVariantFormChange = (e) => {
    const { name, value } = e.target;
    setVariantForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditVariantSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER}/admin/edit-variant/${editingVariant._id}`,
        {
          sku: variantForm.sku,
          price: Number(variantForm.price),
          stock: Number(variantForm.stock),
        },
        { withCredentials: true }
      );
      setProducts((prev) =>
        prev.map((product) =>
          product._id === editingVariantProductId
            ? {
                ...product,
                variants: product.variants.map((v) =>
                  v._id === editingVariant._id
                    ? {
                        ...v,
                        ...variantForm,
                        price: Number(variantForm.price),
                        stock: Number(variantForm.stock),
                      }
                    : v
                ),
              }
            : product
        )
      );
      setShowEditVariantModal(false);
      setEditingVariant(null);
      setEditingVariantProductId(null);
    } catch (err) {
      alert("Failed to update variant.");
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header with Analytics Cards */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">Product Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {/* Total Products Card */}
          <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-2xl font-semibold">
                  {analytics.totalProducts}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <Package className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>

          {/* Active Products Card */}
          <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Products</p>
                <p className="text-2xl font-semibold">
                  {analytics.activeProducts}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>

          {/* inActive Products Card */}
          <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Inactive Products</p>
                <p className="text-2xl font-semibold">
                  {analytics.InactiveProduct}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>

          {/* Out of Stock Card */}
          <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Out of Stock</p>
                <p className="text-2xl font-semibold">{analytics.outOfStock}</p>
              </div>
              <div className="p-3 rounded-full bg-red-50">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </div>

          {/* Low Stock Card */}
          <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Low Stock</p>
                <p className="text-2xl font-semibold">{analytics.lowStock}</p>
              </div>
              <div className="p-3 rounded-full bg-amber-50">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Button asChild variant="default" className="flex items-center gap-2">
            <Link href="/admin/product/addproduct">
              <Plus className="h-4 w-4" />
              Add Product
            </Link>
          </Button>

          {selectedProducts.length > 0 && (
            <div className="flex items-center gap-2">
              <Select
                value="actions"
                onValueChange={(value) => {
                  if (value === "delete") {
                    handleBulkDelete();
                  } else if (value === "active" || value === "inactive") {
                    handleBulkStatusUpdate(value);
                  }
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Bulk Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="actions" disabled>
                    Bulk Actions ({selectedProducts.length})
                  </SelectItem>
                  <SelectItem value="active">Set Active</SelectItem>
                  <SelectItem value="inactive">Set Inactive</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            onClick={exportProductsCSV}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>

          <Button
            asChild
            variant="outline"
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <Link href="/admin/product/analytics">
              <BarChart4 className="h-4 w-4" />
              Analytics
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              {uniqueCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Stock Filter */}
          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Stock</SelectItem>
              <SelectItem value="In Stock">In Stock</SelectItem>
              <SelectItem value="Out of Stock">Out of Stock</SelectItem>
              <SelectItem value="Low Stock">Low Stock</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Price Range */}
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min Price"
              value={priceRange.min}
              onChange={(e) =>
                setPriceRange({ ...priceRange, min: e.target.value })
              }
              className="w-full"
            />
            <span className="text-gray-500">-</span>
            <Input
              type="number"
              placeholder="Max Price"
              value={priceRange.max}
              onChange={(e) =>
                setPriceRange({ ...priceRange, max: e.target.value })
              }
              className="w-full"
            />
          </div>

          {/* Items Per Page */}
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => setItemsPerPage(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Items per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="25">25 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
              <SelectItem value="100">100 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      {/* Product Table */}
      <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden mb-6">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Loading products...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-gray-500">
            <Package className="h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium mb-1">No products found</h3>
            <p className="text-sm text-gray-400 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button asChild variant="outline">
              <Link href="/admin/product/addproduct">
                <Plus className="h-4 w-4 mr-2" />
                Add New Product
              </Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b text-xs uppercase">
                  <th className="px-4 py-3 text-left">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-primary focus:ring-primary/20"
                        checked={
                          paginatedProducts.length > 0 &&
                          selectedProducts.length === paginatedProducts.length
                        }
                        onChange={handleSelectAll}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left">Image</th>
                  <th className="px-4 py-3 text-left">
                    <button
                      className="flex items-center gap-1 hover:text-primary"
                      onClick={() => handleSort("name")}
                    >
                      Product
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      className="flex items-center gap-1 hover:text-primary"
                      onClick={() => handleSort("categoryId.name")}
                    >
                      Listing Quality
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>

                  <th className="px-4 py-3 text-left">
                    <button
                      className="flex items-center gap-1 hover:text-primary"
                      onClick={() => handleSort("categoryId.name")}
                    >
                      Category
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>

                  {/* Status column removed */}
                  <th className="px-4 py-3 text-left">
                    <button
                      className="flex items-center gap-1 hover:text-primary"
                      onClick={() => handleSort("totalStock")}
                    >
                      Inventory
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      className="flex items-center gap-1 hover:text-primary"
                      onClick={() => handleSort("price")}
                    >
                      Price
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product, i) => {
                  const inStock = product.totalStock && product.totalStock > 0;
                  const lowStock = inStock && product.totalStock < 10;

                  return (
                    <>
                      <tr
                        key={i}
                        className="border-b border-black hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-primary focus:ring-primary/20"
                              checked={selectedProducts.includes(product._id)}
                              onChange={() => handleSelectProduct(product._id)}
                            />
                            <button
                              onClick={() => {
                                setExpandedVariants((prev) => ({
                                  ...prev,
                                  [product._id]: !prev[product._id],
                                }));
                              }}
                              className={cn(
                                "p-1 rounded hover:bg-gray-100 transition-colors",
                                expandedVariants[product._id] && "bg-gray-100"
                              )}
                            >
                              <ChevronRight
                                className={cn(
                                  "h-4 w-4 transition-transform duration-200",
                                  expandedVariants[product._id] &&
                                    "transform rotate-90"
                                )}
                              />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="relative h-16 w-16 rounded-md overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                            {product.mainImage ? (
                              <img
                                src={product.mainImage}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Package className="h-8 w-8 text-gray-400" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900 truncate max-w-[200px]">
                              {product.name}
                            </span>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                              <span className="flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                SKU:{" "}
                                {product.variants.map((item, i) => (
                                  <p key={i}>{item.sku}</p>
                                )) || "N/A"}
                              </span>
                              <span className="flex items-center gap-1">
                                <ShoppingCart className="h-3 w-3" />
                                Variants: {product.variants?.length || 0}
                              </span>
                            </div>
                          </div>
                        </td>
                        {/* Product Listing Quality */}
                        <td className="px-4 py-3 text-center">
                          {(() => {
                            const scoreChecks = [
                              product.name && product.name.length >= 10, // Title present & long enough
                              product.slug,
                              product.categoryId,
                              product.price && product.price > 0,
                              product.mrpPrice && product.mrpPrice > 0,
                              product.description &&
                                product.description.length >= 50, // Enough description text
                              product.mainImage,
                              product.tags && product.tags.length >= 2, // Has tags
                              product.variants && product.variants.length > 0, // At least one variant
                              product.images && product.images.length >= 3, // Multiple images
                            ];

                            const score = scoreChecks.filter(Boolean).length;
                            const total = scoreChecks.length;
                            const percentage = (score / total) * 100;

                            if (percentage >= 90) {
                              return (
                                <span className="text-green-700 bg-green-100 rounded px-2 py-1 text-sm font-medium shadow-sm">
                                  Excellent
                                </span>
                              );
                            } else if (percentage >= 60) {
                              return (
                                <span className="text-yellow-700 bg-yellow-100 rounded px-2 py-1 text-sm font-medium shadow-sm">
                                  Good
                                </span>
                              );
                            } else {
                              return (
                                <span className="text-red-700 bg-red-100 rounded px-2 py-1 text-sm font-medium shadow-sm">
                                  Poor
                                </span>
                              );
                            }
                          })()}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800">
                            {product.categoryId?.name || "No Category"}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          {editingStockId === product._id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                className="h-8 w-20 px-2 border border-gray-300 rounded-md text-sm"
                                value={newStock}
                                onChange={(e) => setNewStock(e.target.value)}
                                min="0"
                              />
                              <button
                                onClick={() =>
                                  editStock(product._id, parseInt(newStock))
                                }
                                className="text-green-600 hover:text-green-800"
                                disabled={isEditingStock}
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingStockId(null);
                                  setNewStock("");
                                }}
                                className="text-red-600 hover:text-red-800"
                              >
                                <X className="h-4 w-4" />
                              </button>
                              {isEditingStock && (
                                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              {!inStock ? (
                                <span className="text-red-600 text-sm font-medium flex items-center">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Out of stock
                                </span>
                              ) : lowStock ? (
                                <span className="text-amber-600 text-sm font-medium flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Low stock ({product.totalStock})
                                </span>
                              ) : (
                                <span className="text-green-600 text-sm font-medium">
                                  {product.totalStock} in stock
                                </span>
                              )}
                              {/* stock update  */}
                            </div>
                          )}
                        </td>
                        {/* price section  */}
                        <td className="px-4 py-3 relative">
                          {editingPriceId === product._id ? (
                            <div className=" inset-0 z-50 absolute left-[-180] ">
                              <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-72">
                                {/* Title */}
                                <h3 className="text-sm font-medium mb-3">
                                  Update Listing Price
                                </h3>

                                {/* Selling Price */}
                                <div className="mb-3">
                                  <label className="block text-xs text-gray-600 mb-1">
                                    Selling Price
                                  </label>
                                  <input
                                    type="number"
                                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={newPrice}
                                    onChange={(e) =>
                                      setNewPrice(e.target.value)
                                    }
                                    min="0"
                                    step="0.01"
                                  />
                                </div>

                                {/* MRP Price */}
                                <div className="mb-4">
                                  <label className="block text-xs text-gray-600 mb-1">
                                    MRP Price
                                  </label>
                                  <input
                                    type="number"
                                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={newMrp}
                                    onChange={(e) => setNewMrp(e.target.value)}
                                    min="0"
                                    step="0.01"
                                  />
                                </div>

                                {/* Breakdown */}
                                <div className="text-xs text-gray-600 space-y-1 mb-4">
                                  <div className="flex justify-between">
                                    <span>Discount</span>
                                    <span>{product.discount}%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Seller Price</span>
                                    <span>₹{parseFloat(newPrice || 0)}</span>
                                  </div>
                                  <div className="flex justify-between font-semibold border-t pt-2">
                                    <span>Bank Settlement</span>
                                    <span>₹{parseFloat(newPrice || 0)}</span>
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() =>
                                      editPrice(
                                        product._id,
                                        parseFloat(newPrice),
                                        parseFloat(newMrp)
                                      )
                                    }
                                    disabled={isEditingPrice}
                                    className="px-4 py-1 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700"
                                  >
                                    Apply
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingPriceId(null);
                                      setNewPrice("");
                                      setNewMrp("");
                                    }}
                                    className="px-4 py-1 bg-gray-200 text-gray-700 rounded-md text-xs hover:bg-gray-300"
                                  >
                                    Cancel
                                  </button>
                                  {isEditingPrice && (
                                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  ₹{product.price}
                                </span>
                                {product.mrpPrice > product.price && (
                                  <span className="text-xs text-gray-500 line-through">
                                    ₹{product.mrpPrice}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => {
                                  setEditingPriceId(product._id);
                                  setNewPrice(product.price.toString());
                                  setNewMrp(product.mrpPrice.toString());
                                }}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <Edit className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 relative">
                          {/* three dots  */}
                          <div className="flex items-center justify-center gap-2">
                            <button
                              className="bg-white text-black cursor-pointer hover:bg-gray-100 h-8 w-8 p-0 rounded"
                              onClick={() => toggleMenu(product._id)}
                            >
                              <BsThreeDotsVertical />
                            </button>
                          </div>

                          {/* Dropdown Menu */}
                          {openMenuId === product._id && (
                            <div className="absolute right-5 top-13 z-50 w-40 bg-white border border-gray-200 shadow-md rounded-md">
                              <ul className="flex flex-col">
                                <li>
                                  <span
                                    className={`flex items-center gap-2 px-4 py-2 ${
                                      product.status === "active"
                                        ? "text-green-600"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    <span
                                      className={`h-2 w-2 rounded-full ${
                                        product.status === "active"
                                          ? "bg-green-500"
                                          : "bg-gray-400"
                                      }`}
                                    ></span>
                                    {product.status === "active"
                                      ? "Active"
                                      : "Inactive"}
                                  </span>
                                </li>
                                <li>
                                  <button
                                    onClick={async () => {
                                      await editStatus(
                                        product._id,
                                        product.status === "active"
                                          ? "inactive"
                                          : "active"
                                      );
                                      setOpenMenuId(null);
                                    }}
                                    className={`flex w-full items-center gap-2 px-4 py-2 ${
                                      product.status === "active"
                                        ? "text-gray-500 hover:bg-gray-100"
                                        : "text-green-600 hover:bg-green-50"
                                    }`}
                                  >
                                    {product.status === "active" ? (
                                      <XCircle className="h-4 w-4" />
                                    ) : (
                                      <CheckCircle2 className="h-4 w-4" />
                                    )}
                                    {product.status === "active"
                                      ? "Deactivate"
                                      : "Activate"}
                                  </button>
                                </li>
                                <li>
                                  <Link
                                    href={`/admin/product/edit/${product._id}`}
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                                  >
                                    <Edit className="h-4 w-4" />
                                    Edit
                                  </Link>
                                </li>
                                <li>
                                  <button
                                    onClick={() => {
                                      handleDeleteConfirm(product._id);
                                      setOpenMenuId(null);
                                    }}
                                    className="flex w-full items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                  </button>
                                </li>
                                <li>
                                  <Link
                                    href={`/product/${product.slug}`}
                                    target="_blank"
                                    className="flex items-center gap-2 px-4 py-2 text-blue-500 hover:bg-blue-50"
                                  >
                                    <Eye className="h-4 w-4" />
                                    View
                                  </Link>
                                </li>
                                <il></il>
                              </ul>
                            </div>
                          )}
                        </td>
                      </tr>
                      {/* product variants  */}
                      {expandedVariants[product._id] && (
                        <tr className=" border-1 border-black ">
                          <td colSpan={9} className="pl-25">
                            <table className="w-full text-sm ">
                              <thead className="bg-gray-50 text-gray-500 ">
                                <tr className="">
                                  <th className=" text-left">Image</th>
                                  <th className="text-left">SKU</th>
                                  <th className=" text-left">Attributes</th>
                                  <th className=" text-left">Price</th>
                                  <th className=" text-left">Stock</th>
                                  <th className=" text-left">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {product.variants.map((variant, index) => (
                                  <tr key={index} className="border-2">
                                    <td className="p-1">
                                      {variant.images?.[0] ? (
                                        <img
                                          src={variant.images[0]}
                                          alt="variant"
                                          className="w-12 h-12 object-cover rounded border"
                                        />
                                      ) : (
                                        <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded border">
                                          <Package className="h-5 w-5 text-gray-500" />
                                        </div>
                                      )}
                                    </td>
                                    <td className="">{variant.sku || "N/A"}</td>
                                    <td className="">
                                      {variant.attributes &&
                                        Object.entries(variant.attributes).map(
                                          ([k, v]) => (
                                            <div key={k}>
                                              <span className="font-medium">
                                                {k}:
                                              </span>{" "}
                                              {Array.isArray(v)
                                                ? v.join(", ")
                                                : v}
                                            </div>
                                          )
                                        )}
                                    </td>
                                    <td className="">₹{variant.price || 0}</td>
                                    <td className="">
                                      {variant.stock || 0} units
                                    </td>
                                    <td className="relative">
                                      <div className="flex items-center">
                                        <button
                                          className="bg-white text-black cursor-pointer hover:bg-gray-100 rounded"
                                          onClick={() => {
                                            const id = `variant-${product._id}-${index}`;
                                            setOpenMenuId((prev) =>
                                              prev === id ? null : id
                                            );
                                          }}
                                        >
                                          <BsThreeDotsVertical />
                                        </button>
                                      </div>
                                      {openMenuId ===
                                        `variant-${product._id}-${index}` && (
                                        <div className="absolute right-4 top-8 z-50 w-40 bg-white border border-gray-200 shadow-md rounded-md">
                                          <ul className="flex flex-col">
                                            <li>
                                              <button
                                                onClick={() => {
                                                  openEditVariantModal(
                                                    product._id,
                                                    variant
                                                  );
                                                  setOpenMenuId(null);
                                                }}
                                                className="flex w-full items-center gap-2 px-4 py-2 hover:bg-gray-100"
                                              >
                                                <Edit className="h-4 w-4" />
                                                Edit Variant
                                              </button>
                                            </li>
                                            <li>
                                              <button
                                                onClick={() => {
                                                  setDeleteVariantContext({
                                                    productId: product._id,
                                                    variantId: variant._id,
                                                  });
                                                  setShowDeleteVariantPopup(
                                                    true
                                                  );
                                                  setOpenMenuId(null);
                                                }}
                                                className="flex w-full items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50"
                                              >
                                                <Trash2 className="h-4 w-4" />
                                                Delete Variant
                                              </button>
                                            </li>
                                          </ul>
                                        </div>
                                      )}
                                      {/* Edit Variant Modal */}
                                      {showEditVariantModal &&
                                        editingVariantId ===
                                          `${product._id}-${variant._id}` && (
                                          <div className=" relative ">
                                            <div className="  z-50 inset-0 left-[-290] absolute h-90 top-0 border-2 bg-white rounded-lg shadow-lg p-6 w-90 max-w-md mx-4">
                                              <h3 className="text-lg font-semibold mb-4">
                                                Edit Variant
                                              </h3>
                                              <form
                                                onSubmit={
                                                  handleEditVariantSubmit
                                                }
                                                className="space-y-4"
                                              >
                                                <div>
                                                  <label className="block text-sm font-medium mb-1">
                                                    SKU
                                                  </label>
                                                  <input
                                                    name="sku"
                                                    value={variantForm.sku}
                                                    onChange={
                                                      handleVariantFormChange
                                                    }
                                                    className="w-full border border-gray-300 rounded-md px-2 py-1"
                                                  />
                                                </div>
                                                <div>
                                                  <label className="block text-sm font-medium mb-1">
                                                    Price
                                                  </label>
                                                  <input
                                                    name="price"
                                                    type="number"
                                                    value={variantForm.price}
                                                    onChange={
                                                      handleVariantFormChange
                                                    }
                                                    className="w-full border border-gray-300 rounded-md px-2 py-1"
                                                  />
                                                </div>
                                                <div>
                                                  <label className="block text-sm font-medium mb-1">
                                                    Stock
                                                  </label>
                                                  <input
                                                    name="stock"
                                                    type="number"
                                                    value={variantForm.stock}
                                                    onChange={
                                                      handleVariantFormChange
                                                    }
                                                    className="w-full border border-gray-300 rounded-md px-2 py-1"
                                                  />
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                  <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() =>
                                                      setShowEditVariantModal(
                                                        false
                                                      )
                                                    }
                                                  >
                                                    Cancel
                                                  </Button>
                                                  <Button
                                                    type="submit"
                                                    variant="default"
                                                  >
                                                    Save
                                                  </Button>
                                                </div>
                                              </form>
                                            </div>
                                          </div>
                                        )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && filteredProducts.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
              </span>{" "}
              of <span className="font-medium">{filteredProducts.length}</span>{" "}
              products
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Logic to show pagination numbers around current page
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="h-8 w-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-2">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeletePopup(false);
                  setDeleteProductId(null);
                }}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Variant Confirmation Modal */}
      {showDeleteVariantPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-2">Delete Variant</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this variant? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteVariantPopup(false);
                  setDeleteVariantContext({ productId: null, variantId: null });
                }}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteVariant}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
}

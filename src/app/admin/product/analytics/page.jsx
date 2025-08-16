"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Icons
import { 
  BarChart4, 
  PieChart, 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Tag, 
  ArrowLeft,
  Loader2,
  AlertCircle
} from "lucide-react";

export default function ProductAnalytics() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState({
    totalProducts: 0,
    activeProducts: 0,
    outOfStock: 0,
    lowStock: 0,
    categories: [],
    priceRanges: [],
    topCategories: [],
    stockDistribution: {},
    monthlyTrends: []
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
        
        // Process analytics data
        processAnalytics(productsData);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching products", err);
        setError("Failed to load products. Please try again.");
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Process analytics data
  const processAnalytics = (productsData) => {
    // Basic counts
    const activeCount = productsData.filter(p => p.status === "active").length;
    const outOfStockCount = productsData.filter(p => !p.totalStock || p.totalStock <= 0).length;
    const lowStockCount = productsData.filter(p => p.totalStock > 0 && p.totalStock < 10).length;
    
    // Get unique categories
    const uniqueCategories = Array.from(new Set(productsData.map(p => p.categoryId?.name).filter(Boolean)));
    
    // Price range distribution
    const priceRanges = [
      { range: "$0-$50", count: productsData.filter(p => p.price >= 0 && p.price <= 50).length },
      { range: "$51-$100", count: productsData.filter(p => p.price > 50 && p.price <= 100).length },
      { range: "$101-$200", count: productsData.filter(p => p.price > 100 && p.price <= 200).length },
      { range: "$201-$500", count: productsData.filter(p => p.price > 200 && p.price <= 500).length },
      { range: "$500+", count: productsData.filter(p => p.price > 500).length },
    ];
    
    // Top categories by product count
    const categoryCount = {};
    productsData.forEach(product => {
      const categoryName = product.categoryId?.name;
      if (categoryName) {
        categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
      }
    });
    
    const topCategories = Object.entries(categoryCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // Stock distribution
    const stockDistribution = {
      "Out of Stock": outOfStockCount,
      "Low Stock (1-10)": lowStockCount,
      "Healthy Stock (11-50)": productsData.filter(p => p.totalStock >= 11 && p.totalStock <= 50).length,
      "High Stock (50+)": productsData.filter(p => p.totalStock > 50).length,
    };
    
    // Monthly trends (mock data - in a real app, you'd fetch this from backend)
    const monthlyTrends = [
      { month: "Jan", count: 12 },
      { month: "Feb", count: 19 },
      { month: "Mar", count: 25 },
      { month: "Apr", count: 22 },
      { month: "May", count: 30 },
      { month: "Jun", count: 28 },
    ];
    
    setAnalytics({
      totalProducts: productsData.length,
      activeProducts: activeCount,
      outOfStock: outOfStockCount,
      lowStock: lowStockCount,
      categories: uniqueCategories,
      priceRanges,
      topCategories,
      stockDistribution,
      monthlyTrends
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <AlertCircle className="h-8 w-8 mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Product Analytics</h1>
          <p className="text-gray-500">Insights and statistics about your product inventory</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/product" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </Button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Products Card */}
        <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-semibold">{analytics.totalProducts}</p>
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
              <p className="text-2xl font-semibold">{analytics.activeProducts}</p>
              <p className="text-xs text-gray-400">
                {analytics.totalProducts > 0 
                  ? `${Math.round((analytics.activeProducts / analytics.totalProducts) * 100)}% of total`
                  : '0% of total'}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-50">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>
        
        {/* Out of Stock Card */}
        <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Out of Stock</p>
              <p className="text-2xl font-semibold">{analytics.outOfStock}</p>
              <p className="text-xs text-gray-400">
                {analytics.totalProducts > 0 
                  ? `${Math.round((analytics.outOfStock / analytics.totalProducts) * 100)}% of total`
                  : '0% of total'}
              </p>
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
              <p className="text-xs text-gray-400">
                {analytics.totalProducts > 0 
                  ? `${Math.round((analytics.lowStock / analytics.totalProducts) * 100)}% of total`
                  : '0% of total'}
              </p>
            </div>
            <div className="p-3 rounded-full bg-amber-50">
              <Tag className="h-6 w-6 text-amber-500" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Price Range Distribution */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-blue-500" />
            Price Range Distribution
          </h2>
          <div className="space-y-4">
            {analytics.priceRanges.map((range) => (
              <div key={range.range}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">{range.range}</span>
                  <span className="text-sm font-medium">{range.count} products</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${(range.count / analytics.totalProducts) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Top Categories */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Tag className="h-5 w-5 mr-2 text-blue-500" />
            Top Categories
          </h2>
          <div className="space-y-4">
            {analytics.topCategories.map((category) => (
              <div key={category.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">{category.name}</span>
                  <span className="text-sm font-medium">{category.count} products</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full" 
                    style={{ width: `${(category.count / analytics.totalProducts) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Stock Distribution */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Package className="h-5 w-5 mr-2 text-blue-500" />
            Stock Distribution
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(analytics.stockDistribution).map(([label, value]) => (
              <div key={label} className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-xl font-semibold">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Monthly Product Trends */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
            Monthly Product Trends
          </h2>
          <div className="h-64 flex items-end justify-between">
            {analytics.monthlyTrends.map((item) => (
              <div key={item.month} className="flex flex-col items-center">
                <div 
                  className="bg-blue-500 w-12 rounded-t-md" 
                  style={{ 
                    height: `${(item.count / Math.max(...analytics.monthlyTrends.map(i => i.count))) * 200}px` 
                  }}
                ></div>
                <p className="text-sm mt-2">{item.month}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Additional Insights */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-100 mb-8">
        <h2 className="text-lg font-semibold mb-4">Inventory Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium mb-2">Inventory Health</h3>
            <p className="text-sm text-gray-600 mb-2">
              {analytics.outOfStock > (analytics.totalProducts * 0.2) 
                ? "Your inventory needs attention! More than 20% of products are out of stock."
                : "Your inventory is healthy with most products in stock."}
            </p>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                <div 
                  className={cn(
                    "h-2.5 rounded-full",
                    analytics.outOfStock > (analytics.totalProducts * 0.2) ? "bg-red-500" : "bg-green-500"
                  )}
                  style={{ width: `${100 - ((analytics.outOfStock / analytics.totalProducts) * 100)}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">
                {Math.round(100 - ((analytics.outOfStock / analytics.totalProducts) * 100))}%
              </span>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium mb-2">Category Distribution</h3>
            <p className="text-sm text-gray-600">
              Your products are spread across {analytics.categories.length} categories.
              {analytics.topCategories.length > 0 && ` ${analytics.topCategories[0].name} is your largest category.`}
            </p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium mb-2">Price Point Analysis</h3>
            <p className="text-sm text-gray-600">
              {analytics.priceRanges.sort((a, b) => b.count - a.count)[0]?.range} is your most common price range.
            </p>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button asChild variant="outline" className="flex items-center gap-2">
          <Link href="/admin/product">
            <Package className="h-4 w-4" />
            Manage Products
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="flex items-center gap-2">
          <Link href="/admin/product/addproduct">
            <PieChart className="h-4 w-4" />
            Add New Product
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="flex items-center gap-2">
          <Link href="/admin/order">
            <ShoppingCart className="h-4 w-4" />
            View Orders
          </Link>
        </Button>
      </div>
    </div>
  );
}
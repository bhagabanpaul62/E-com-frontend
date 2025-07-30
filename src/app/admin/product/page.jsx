"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { cn } from "@/lib/utils"; // Optional className utility

export default function AdminProductList() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/product")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products", err));
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filter === "All" || p.status.toLowerCase() === filter.toLowerCase();
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/admin/product/addproduct"
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          Add product
        </Link>
      </div>

      {/* Search + Filter Tabs */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <input
          type="text"
          placeholder="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 mb-4 rounded border border-gray-300 focus:outline-none"
        />
        <div className="flex gap-4 text-sm font-medium text-gray-600">
          {["All", "Active", "Inactive"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={cn(
                "py-1 border-b-2 transition-all",
                filter === tab
                  ? "border-black text-black"
                  : "border-transparent hover:text-black"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="text-left bg-gray-50 border-b">
              <th className="px-6 py-3 text-sm font-semibold">Product</th>
              <th className="px-6 py-3 text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-sm font-semibold">Inventory</th>
              <th className="px-6 py-3 text-sm font-semibold">Price</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              const inStock =
                product.totalStock && product.totalStock > 0
                  ? `${product.totalStock} in stock`
                  : "Out of stock";

              return (
                <tr
                  key={product._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-block px-3 py-1 text-sm rounded-full",
                        product.status === "Active"
                          ? "bg-gray-100 text-black"
                          : "bg-gray-200 text-gray-500"
                      )}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sky-600">{inStock}</td>
                  <td className="px-6 py-4">${product.finalPrice}</td>
                </tr>
              );
            })}
            {filteredProducts.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center text-gray-400 px-6 py-10"
                >
                  No matching products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

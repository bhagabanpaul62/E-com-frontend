"use client";
import { AiOutlineReload } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { cn } from "@/lib/utils"; // className utility

export default function AdminProductList() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const handleDeleteConfirm = (id) => {
    setDeleteProductId(id);
    setShowDeletePopup(true);
  };

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

  const editStatus = async (id, newStatus) => {
    try {
      setIsEditing(true);
      

      await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER}/admin/edit-status/${id}`,
        {  status: newStatus  },
        {
          withCredentials: true,
         
        }
      );

      setProducts((prev) =>
        prev.map((product) =>
          product._id === id ? { ...product, status: newStatus } : product
        )
      );

      setIsEditing(false);
      setEditingProductId(null);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  useEffect(() => {
    const fetchingProduct = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER}/admin/view-products`,
          { withCredentials: true ,
            
          }
        );
        setProducts(res.data.data);
      } catch (err) {
        console.error("Error fetching products", err);
      }
    };

    fetchingProduct();
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
              <th className="px-6 py-3 text-sm font-semibold">Image</th>
              <th className="px-6 py-3 text-sm font-semibold">Product</th>
              <th className="px-6 py-3 text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-sm font-semibold">Inventory</th>
              <th className="px-6 py-3 text-sm font-semibold">Price</th>
              <th className="px-6 py-3 text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              const inStock =
                product.totalStock && product.totalStock > 0 ? (
                  `${product.totalStock} in stock`
                ) : (
                  <div className="text-red-500">Out of stock</div>
                );

              return (
                <tr
                  key={product._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-2">
                    <img
                      src={product.mainImage}
                      alt="mainImage"
                      className="rounded-md"
                      width={100}
                      height={100}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div>{product.name}</div>
                    <div>
                      <span>Variant No :</span> {product.variants.length}
                    </div>
                    <div>
                      <span>Category :</span>{" "}
                      {product.categoryId?.name || "no category"}
                    </div>
                  </td>
                  <td className="px-4 py-4 gap-5">
                    <div className="flex justify-center items-center gap-5">
                      {editingProductId === product._id ? (
                        <select
                          value={product.status}
                          onChange={(e) =>
                            editStatus(product._id, e.target.value)
                          }
                          onBlur={() => setEditingProductId(null)}
                          className="px-2 py-1 rounded border text-sm"
                        >
                          {["active", "inactive"].map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span
                          className={cn(
                            "inline-block px-3 py-1 text-sm rounded-full",
                            product.status === "active"
                              ? "bg-green-300 text-black"
                              : "bg-gray-200 text-gray-500"
                          )}
                        >
                          {product.status}
                        </span>
                      )}
                      <span
                        className="text-2xl cursor-pointer"
                        onClick={() =>
                          setEditingProductId(
                            editingProductId === product._id
                              ? null
                              : product._id
                          )
                        }
                      >
                        <FaRegEdit />
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sky-600">{inStock}</td>
                  <td className="px-6 py-4">{product.price}₹</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleDeleteConfirm(product._id)}
                        className="bg-red-400 cursor-pointer hover:scale-110 rounded-xl transition-all delay-100 ease-in px-4 py-1"
                      >
                        Delete
                      </button>

                      <Link
                        href={`/admin/product/edit/${product._id}`}
                        className="bg-blue-400 rounded-xl cursor-pointer hover:scale-110 transition-all delay-100 ease-in  px-4 py-1"
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={6} className="py-20">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <AiOutlineReload className="text-5xl animate-spin mb-2" />
                    <p className="text-sm">Loading products...</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 flex backdrop-blur-xs items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md text-center w-96">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this product?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-400 cursor-pointer hover:scale-110 rounded-xl transition-all delay-100 ease-in px-4 py-1"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeletePopup(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

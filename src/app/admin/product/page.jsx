"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function AdminProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/product")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products", err));
  }, []);

  return (
    <div className="p-6 text-white max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <Link
          href="/admin/product/addproduct"
          className="bg-amber-400 text-black font-semibold px-4 py-2 rounded hover:bg-amber-300 transition"
        >
          ➕ Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="space-y-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-neutral-800 p-4 rounded-lg shadow"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <span className="text-sm text-gray-400">
                  {product.status.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-300 mb-2">{product.description}</p>

              <div className="flex gap-4 mb-2">
                {product.images?.slice(0, 3).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    className="w-16 h-16 rounded border"
                  />
                ))}
              </div>

              <div className="text-sm text-gray-400 mb-2">
                Category: {product?.categoryId?.name || "N/A"} | Tags:{" "}
                {product.tags?.join(", ")}
              </div>

              <div className="text-sm mb-2">
                Base Price: ₹{product.price} | Discount: ₹{product.discount} |
                Final: ₹{product.finalPrice}
              </div>

              <div className="text-sm mb-2">
                Total Stock: {product.totalStock}
              </div>

              <div className="text-sm font-medium mb-2">Variants:</div>
              <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
                {product.variants.map((v, i) => (
                  <div
                    key={i}
                    className="border border-gray-700 p-2 rounded bg-neutral-900"
                  >
                    <p>SKU: {v.sku}</p>
                    <p>Price: ₹{v.price}</p>
                    <p>Stock: {v.stock}</p>
                    <p>Attributes:</p>
                    <ul className="list-disc ml-4 text-gray-300">
                      {Object.entries(v.attributes).map(([key, val]) => (
                        <li key={key}>
                          {key}: {val}
                        </li>
                      ))}
                    </ul>
                    <div className="flex gap-1 mt-2">
                      {v.images?.map((img, j) => (
                        <img
                          key={j}
                          src={img}
                          alt=""
                          className="w-12 h-12 object-cover rounded"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

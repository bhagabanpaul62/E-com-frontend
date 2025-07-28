"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Category() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/category");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCats();
  }, []);

  const renderNested = (parentId = null, level = 0) => {
    return categories
      .filter((cat) => {
        if (!cat.parentId && parentId === null) return true;
        if (typeof cat.parentId === "object" && cat.parentId?._id === parentId)
          return true;
        if (typeof cat.parentId === "string" && cat.parentId === parentId)
          return true;
        return false;
      })
      .map((cat) => (
        <div key={cat._id}>
          <div
            className="flex items-center gap-2 py-1"
            style={{ marginLeft: `${level * 20}px` }}
          >
            <span>{level === 0 ? "📁" : "↳"}</span>
            <span>{cat.name}</span>
          </div>
          {renderNested(cat._id, level + 1)}
        </div>
      ));
  };

  return (
    <div className="text-white mt-6 px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Category List</h1>
        <Link
          href="/admin/category/addcategory"
          className="bg-amber-300 text-black rounded-lg px-4 py-2 font-medium"
        >
          + Add Category
        </Link>
      </div>

      <div className="bg-neutral-800 p-4 rounded-lg shadow">
        {categories.length === 0 ? (
          <p className="text-gray-400">No categories found.</p>
        ) : (
          renderNested()
        )}
      </div>
    </div>
  );
}

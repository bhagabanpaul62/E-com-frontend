"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { ChevronDown, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { AiOutlineEnter } from "react-icons/ai";

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [openIds, setOpenIds] = useState({});

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER.replace('/api', '')}/api/admin/category`,
          {
            withCredentials: true,
          }
        );

        const fetchedCategories = res.data.data.data;
        const mapById = {};
        fetchedCategories.forEach((cat) => {
          mapById[cat._id] = cat;
        });

        // Step 1: Find categories that have attributes
        const categoriesWithAttrs = fetchedCategories.filter((cat) =>
          cat.attributes?.some((a) => a.name)
        );

        // Step 2: Traverse up to collect all parent IDs
        const idsToOpen = new Set();

        categoriesWithAttrs.forEach((cat) => {
          let current = cat;
          while (current) {
            idsToOpen.add(current._id);
            const parentId = current.parentId?._id || current.parentId;
            current = mapById[parentId];
          }
        });

        setCategories(fetchedCategories);
        setOpenIds(Object.fromEntries([...idsToOpen].map((id) => [id, true])));
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCats();
  }, []);

  const toggleDropdown = (id) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDelete = async (id) => {
    if (!confirm(`Are you sure you want to delete this category? ${id}`)) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER.replace('/api', '')}/api/admin/delete-category/${id}`,
        {
          withCredentials: true,
        }
      );
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const renderRows = (parentId = null, level = 0) => {
    return categories
      .filter((cat) => {
        if (!cat.parentId && parentId === null) return true;
        if (typeof cat.parentId === "object" && cat.parentId?._id === parentId)
          return true;
        if (typeof cat.parentId === "string" && cat.parentId === parentId)
          return true;
        return false;
      })
      .flatMap((cat) => {
        const hasChildren = categories.some(
          (child) =>
            (typeof child.parentId === "object" &&
              child.parentId?._id === cat._id) ||
            child.parentId === cat._id
        );

        const row = (
          <tr
            key={cat._id}
            className="bg-white border-b hover:bg-gray-50 transition"
          >
            <td className="px-4 py-3 whitespace-nowrap">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => hasChildren && toggleDropdown(cat._id)}
              >
                <span style={{ paddingLeft: `${level * 20}px` }}>
                  {hasChildren ? (
                    openIds[cat._id] ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )
                  ) : (
                    <span className="inline-block w-4" />
                  )}
                </span>
                <span className="font-medium flex items-center gap-1">
                  {parentId && <AiOutlineEnter className="text-gray-500 text-xl rotate-y-180" />}{" "}
                  {/* Icon only for children */}
                  {cat.name}
                </span>
              </div>
            </td>
            <td className="px-4 py-3 text-sm text-gray-700">{cat.slug}</td>
            <td className="px-4 py-3 text-sm text-gray-700">
              {cat.description || "—"}
            </td>
            <td className="px-4 py-3 text-sm">
              {cat.isFeatured ? (
                <span className="text-green-600 font-medium">Yes</span>
              ) : (
                <span className="text-gray-400">No</span>
              )}
            </td>
            <td className="px-4 py-3 text-xs text-gray-500">
              {new Date(cat.createdAt).toLocaleString()}
            </td>
            <td className="px-4 py-3 text-sm">
              <div className="flex gap-3">
                <Link
                  href={`/admin/category/edit/${cat._id}`}
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Pencil size={14} />
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="text-red-600 hover:underline flex items-center gap-1"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </td>
          </tr>
        );

        const attributeRow =
          openIds[cat._id] &&
          cat.attributes?.length > 0 &&
          cat.attributes.some((a) => a.name) ? (
            <tr key={`${cat._id}-attr`}>
              <td colSpan={6} className="bg-gray-200 px-15 py-3">
                <div className="text-sm font-semibold mb-2 text-gray-800">
                  Attributes
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {cat.attributes.map(
                    (attr, idx) =>
                      attr.name && (
                        <div
                          key={idx}
                          className="bg-white w-[15vw] border border-gray-200 rounded-lg p-4 shadow-sm"
                        >
                          <h4 className="text-base font-semibold text-gray-800 mb-3 border-b pb-1">
                            {attr.name}
                          </h4>
                          <dl className="space-y-2">
                            {Object.entries(attr).map(([key, value]) => {
                              if (key === "name" || key === "_id") return null;

                              const formattedValue = Array.isArray(value)
                                ? value.join(", ")
                                : value;

                              return (
                                <div
                                  key={key}
                                  className="flex justify-between text-sm"
                                >
                                  <dt className="text-gray-600 font-medium capitalize">
                                    {key}
                                  </dt>
                                  <dd className="text-gray-900 text-right break-words max-w-[60%]">
                                    {formattedValue}
                                  </dd>
                                </div>
                              );
                            })}
                          </dl>
                        </div>
                      )
                  )}
                </div>
              </td>
            </tr>
          ) : null;

        return [
          row,
          attributeRow,
          ...(hasChildren && openIds[cat._id]
            ? renderRows(cat._id, level + 1)
            : []),
        ];
      });
  };

  return (
    <div className="px-6 py-8 bg-[#f5f6fa] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Category Management
        </h1>
        <Link
          href="/admin/category/addcategory"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-2 font-semibold shadow"
        >
          + Add Category
        </Link>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>{renderRows()}</tbody>
        </table>
      </div>
    </div>
  );
}

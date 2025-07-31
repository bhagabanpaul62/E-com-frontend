"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { useDropzone } from "react-dropzone";

export default function EditCategory() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [attributes, setAttributes] = useState([{ name: "", values: "" }]);
  const [loading, setLoading] = useState(false);
  const [parentId, setParentId] = useState("");
  const [allCategories, setAllCategories] = useState([]);

  // Fetch data for the specific category
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER.replace('/api', '')}/api/admin/category/${id}`,
          { withCredentials: true }
        );
        const cat = res.data.data.data;

        setName(cat.name || "");
        setSlug(cat.slug || "");
        setDescription(cat.description || "");
        setIsFeatured(cat.isFeatured || false);
        setParentId(cat.parentId || "");
        setAttributes(cat.attributes || [{ name: "", values: [] }]);
        setImagePreview(cat.image || "");
      } catch (err) {
        console.error("Failed to load category", err);
      }
    };

    const fetchAllCategories = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER.replace('/api', '')}/api/admin/category`,
          { withCredentials: true }
        );
        setAllCategories(res.data.data.data || []);
        console.log(res.data.data.data);
        
      } catch (err) {
        console.error("Failed to fetch all categories");
      }
    };

    if (id) {
      fetchCategory();
      fetchAllCategories();
    }
  }, [id]);

  const handleAttributeChange = (index, field, value) => {
    const updated = [...attributes];
    updated[index][field] = value;
    setAttributes(updated);
  };

  const addAttributeField = () => {
    setAttributes([...attributes, { name: "", values: "" }]);
  };

  const removeAttributeField = (index) => {
    const updated = [...attributes];
    updated.splice(index, 1);
    setAttributes(updated);
  };

  const handleImageDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleImageDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("isFeatured", isFeatured);
    if (parentId) formData.append("parentId", parentId);
    if (imageFile) formData.append("categoryImage", imageFile);

    const formattedAttributes = attributes.map((attr) => ({
      name: attr.name.trim(),
      values: Array.isArray(attr.values)
        ? attr.values
        : attr.values.split(",").map((v) => v.trim()),
    }));

    formData.append("attributes", JSON.stringify(formattedAttributes));

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER.replace('/api', '')}/api/admin/edit-category/${id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("✅ Category updated!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-10">Edit Category</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              const newName = e.target.value;
              setName(newName);
              // Auto-generate slug from name
              setSlug(newName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''));
            }}
            className="w-full border px-4 py-2 rounded"
            placeholder="Category Name"
          />
        </div>

        {/* Slug (Auto-generated) */}
        <div>
          <label className="block mb-1">Slug (Auto-generated)</label>
          <input
            type="text"
            value={slug}
            readOnly
            className="w-full border px-4 py-2 rounded bg-gray-100"
          />
          <p className="text-xs text-gray-500 mt-1">This field is automatically generated from the category name</p>
        </div>

        {/* Parent Category */}
        <div>
          <label className="block mb-1">Parent Category</label>
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="w-full border px-4 py-2 rounded bg-white"
          >
            <option value="">None</option>
            {allCategories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block mb-1">Category Image</label>
          <div
            {...getRootProps()}
            className="border-2 border-dashed p-4 text-center rounded cursor-pointer"
          >
            <input {...getInputProps()} />
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="mx-auto h-32 object-contain"
              />
            ) : (
              <p className="text-gray-500">Drag or click to upload</p>
            )}
          </div>
        </div>

        {/* Featured Toggle */}
        <div className="flex items-center">
          <label className="mr-2">Featured</label>
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          />
        </div>

        {/* Attributes */}
        <div>
          <label className="block font-semibold mb-2">Attributes</label>
          {attributes.map((attr, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                value={attr.name}
                onChange={(e) =>
                  handleAttributeChange(idx, "name", e.target.value)
                }
                placeholder="e.g. Size"
                className="flex-1 border px-3 py-1 rounded"
              />
              <input
                value={
                  Array.isArray(attr.values)
                    ? attr.values.join(", ")
                    : attr.values
                }
                onChange={(e) =>
                  handleAttributeChange(idx, "values", e.target.value)
                }
                placeholder="e.g. S, M, L"
                className="flex-1 border px-3 py-1 rounded"
              />
              {attributes.length > 1 && (
                <button
                  type="button"
                  className="text-red-500"
                  onClick={() => removeAttributeField(idx)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addAttributeField}
            className="text-sm text-blue-500 hover:underline"
          >
            + Add Attribute
          </button>
        </div>

        <div className="text-right">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded shadow"
          >
            {loading ? "Updating..." : "Update Category"}
          </button>
        </div>
      </form>
    </div>
  );
}

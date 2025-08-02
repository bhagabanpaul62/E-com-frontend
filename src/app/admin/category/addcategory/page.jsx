"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";

export default function AddCategory() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [attributes, setAttributes] = useState([{ name: "", values: "" }]);
  const [loading, setLoading] = useState(false);
  const [parentId, setParentId] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER.replace('/api', '')}/api/admin/category`,{
            withCredentials:true
          }
        );
        setCategories(res.data.data.data);
        
        
      } catch (err) {
        console.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

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

    if (imageFile) {
      formData.append("categoryImage", imageFile); // Must match backend field name
    }

    const formattedAttributes = attributes.map((attr) => ({
      name: attr.name.trim(),
      values: attr.values
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v !== ""),
    }));

    formData.append("attributes", JSON.stringify(formattedAttributes));

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER.replace('/api', '')}/api/admin/add-category`,
        formData,
        {
          withCredentials:true,
        
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("✅ Category Saved");
      setName("");
      setSlug("");
      setDescription("");
      setImageFile(null);
      setImagePreview("");
      setIsFeatured(false);
      setParentId("");
      setAttributes([{ name: "", values: "" }]);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[70vw] mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-10">Create Category</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm mb-1 font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              const newName = e.target.value;
              setName(newName);
              // Auto-generate slug from name
              setSlug(
                newName
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^\w-]+/g, "")
              );
            }}
            placeholder="e.g. Electronics"
            className="w-full border rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>

        {/* Slug (Auto-generated) */}
        <div>
          <label className="block text-sm mb-1 font-medium">
            Slug (Auto-generated)
          </label>
          <input
            type="text"
            value={slug}
            readOnly
            className="w-full border rounded-lg px-4 py-2 text-gray-800 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <p className="text-xs text-gray-500 mt-1">
            This field is automatically generated from the category name
          </p>
        </div>

        {/* Parent Category */}
        <div>
          <label className="block text-sm mb-1 font-medium">
            Parent Category
          </label>
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <option value="">Select Parent Category</option>
            {categories?.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm mb-1 font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. All electronic products"
            className="w-full border rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
            rows={3}
          />
        </div>

        {/* Drag & Drop Image */}
        <div>
          <label className="block text-sm mb-1 font-medium">Upload Image</label>
          <div
            {...getRootProps()}
            className={`w-full p-6 border-2 border-dashed rounded-md cursor-pointer text-center ${
              isDragActive ? "border-teal-400 bg-teal-50" : "border-gray-300"
            }`}
          >
            <input {...getInputProps()} />
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Uploaded"
                className="mx-auto h-32 object-contain"
              />
            ) : (
              <p className="text-gray-500">Drag & drop or click to upload</p>
            )}
          </div>
        </div>

        {/* Is Featured */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Is Featured</label>
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-5 h-5 accent-teal-500"
          />
        </div>

        {/* Attributes */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Attributes (Optional)</h3>
          {attributes.map((attr, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-3 mb-2">
              <input
                type="text"
                placeholder="e.g. Color"
                value={attr.name}
                onChange={(e) =>
                  handleAttributeChange(i, "name", e.target.value)
                }
                className="flex-1 border rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <input
                type="text"
                placeholder="e.g. red, blue"
                value={attr.values}
                onChange={(e) =>
                  handleAttributeChange(i, "values", e.target.value)
                }
                className="flex-1 border rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              {attributes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAttributeField(i)}
                  className="text-red-500 text-xl"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addAttributeField}
            className="text-sm text-teal-600 hover:underline mt-2"
          >
            + Add Another Attribute
          </button>
        </div>

        {/* Submit */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-2 rounded-full shadow-sm"
            disabled={loading}
          >
            {loading ? "Saving..." : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  );
}

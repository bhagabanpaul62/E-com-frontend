"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function AddCategory() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [attributes, setAttributes] = useState([{ name: "", values: "" }]);
  const [loading, setLoading] = useState(false);
  const [parentId, setParentId] = useState("");
  const [categories, setCategories] = useState([]);

  // 🔁 Fetch existing categories for parent dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/category");
        setCategories(res.data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formattedAttributes = attributes.map((attr) => ({
      name: attr.name.trim(),
      values: attr.values
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v !== ""),
    }));

    try {
      await axios.post("http://localhost:5000/api/category", {
        name,
        description,
        image,
        isFeatured,
        parentId: parentId || null,
        attributes: formattedAttributes,
      });

      alert("✅ Category Saved");

      // Reset form
      setName("");
      setDescription("");
      setImage("");
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
    <div className="max-w-2xl mx-auto p-6 text-white">
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-600 shadow-md">
        <h1 className="text-2xl font-bold mb-6">Add New Category</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Name */}
          <div>
            <label className="block mb-1 text-white">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded border border-gray-400 bg-gray-900 text-white"
              required
            />
          </div>

          {/* Parent Category */}
          <div>
            <label className="block mb-1 text-white">Parent Category</label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full p-2 rounded border border-gray-400 bg-gray-900 text-white"
            >
              <option value="">None</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-white">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded border border-gray-400 bg-gray-900 text-white"
              rows={3}
              placeholder="Write something about this category..."
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block mb-1 text-white">Image URL</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full p-2 rounded border border-gray-400 bg-gray-900 text-white"
              placeholder="https://your-image-url.com/image.jpg"
            />
          </div>

          {/* Is Featured */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="accent-blue-500"
            />
            <label className="text-white">Is Featured</label>
          </div>

          {/* Dynamic Attributes */}
          <div>
            <label className="block mb-1 text-white">Attributes</label>
            {attributes.map((attr, i) => (
              <div key={i} className="flex gap-2 items-center mb-2">
                <input
                  type="text"
                  placeholder="Attribute Name"
                  className="w-1/2 p-2 rounded border border-gray-400 bg-gray-900 text-white"
                  value={attr.name}
                  onChange={(e) =>
                    handleAttributeChange(i, "name", e.target.value)
                  }
                  
                />
                <input
                  type="text"
                  placeholder="Values (comma separated)"
                  className="w-1/2 p-2 rounded border border-gray-400 bg-gray-900 text-white"
                  value={attr.values}
                  onChange={(e) =>
                    handleAttributeChange(i, "values", e.target.value)
                  }
                  
                />
                {attributes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAttributeField(i)}
                    className="text-red-400 text-lg"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addAttributeField}
              className="text-blue-400 hover:underline mt-2 text-sm"
            >
              + Add Another Attribute
            </button>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

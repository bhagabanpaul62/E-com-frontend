"use client";

import { useState, useEffect, useCallback, use } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";

export default function EditCategory({ params }) {
  const router = useRouter();
  const { id } = use(params); // Unwrap params using React.use()

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
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [selectedCategoryPath, setSelectedCategoryPath] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER.replace(
            "/api",
            ""
          )}/api/admin/category`,
          {
            withCredentials: true,
          }
        );
        setCategories(res.data.data.data);
      } catch (err) {
        console.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  // Fetch category data for editing
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER.replace(
            "/api",
            ""
          )}/api/admin/category/${id}`,
          {
            withCredentials: true,
          }
        );

        const categoryData = res.data.data.data;

        setName(categoryData.name || "");
        setSlug(categoryData.slug || "");
        setDescription(categoryData.description || "");
        setIsFeatured(categoryData.isFeatured || false);

        if (categoryData.image) {
          setImagePreview(categoryData.image);
        }

        if (categoryData.parentId) {
          const parentCatId =
            typeof categoryData.parentId === "object"
              ? categoryData.parentId._id
              : categoryData.parentId;
          setParentId(parentCatId);

          // Find parent category path
          const findCategoryPath = (categories, targetId, currentPath = []) => {
            for (const cat of categories) {
              const catId =
                typeof cat._id === "object" ? cat._id.toString() : cat._id;
              if (catId === targetId) {
                return [...currentPath, cat];
              }

              // Check if this category has children
              const children = categories.filter((c) => {
                const pId =
                  typeof c.parentId === "object" ? c.parentId?._id : c.parentId;
                return pId === cat._id;
              });

              if (children.length > 0) {
                const found = findCategoryPath(children, targetId, [
                  ...currentPath,
                  cat,
                ]);
                if (found) return found;
              }
            }
            return null;
          };

          // Set path after categories are loaded
          setTimeout(() => {
            const path = findCategoryPath(categories, parentCatId);
            if (path) {
              setSelectedCategoryPath(path);
            }
          }, 100);
        }

        if (categoryData.attributes && categoryData.attributes.length > 0) {
          setAttributes(
            categoryData.attributes.map((attr) => ({
              name: attr.name || "",
              values: Array.isArray(attr.values)
                ? attr.values.join(", ")
                : attr.values || "",
            }))
          );
        }
      } catch (err) {
        console.error("Failed to load category data", err);
        alert("❌ Failed to load category data");
      }
    };

    if (id) {
      fetchCategoryData();
    }
  }, [id, categories]);

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
      await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER.replace(
          "/api",
          ""
        )}/api/admin/edit-category/${id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("✅ Category Updated Successfully");
      router.push("/admin/category");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[70vw] mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-10">Edit Category</h1>
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
          <div className="relative inline-block w-full">
            <button
              type="button"
              className="w-full border rounded-lg px-4 py-2 text-gray-800 bg-white flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-teal-400"
              onClick={() => setCategoryMenuOpen((open) => !open)}
            >
              {selectedCategoryPath.length > 0
                ? selectedCategoryPath.map((cat) => cat.name).join(" → ")
                : "Select Parent Category"}
              <span className="ml-2">▼</span>
            </button>
            {categoryMenuOpen && (
              <div
                className="absolute z-50 mt-2 bg-white border rounded-md shadow-lg flex min-w-[250px]"
                style={{ minHeight: 200 }}
              >
                <CascadingMenu
                  categories={categories.filter((c) => c._id !== id)} // Exclude self from parent options
                  onSelect={(cat, path) => {
                    setParentId(cat._id);
                    setSelectedCategoryPath(path);
                    setCategoryMenuOpen(false);
                  }}
                />
              </div>
            )}
          </div>
          {selectedCategoryPath.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              Selected Path:{" "}
              {selectedCategoryPath.map((cat) => cat.name).join(" → ")}
            </p>
          )}
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
              <div className="flex flex-col items-center">
                <img
                  src={imagePreview}
                  alt="Category preview"
                  className="mx-auto h-32 object-contain"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageFile(null);
                    setImagePreview("");
                  }}
                  className="mt-2 text-red-500 hover:text-red-700 text-sm"
                >
                  Remove image
                </button>
              </div>
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
            className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
          />
        </div>

        {/* Attributes */}
        <div>
          <label className="block text-sm mb-3 font-medium">Attributes</label>
          {attributes.map((attr, index) => (
            <div key={index} className="flex space-x-3 mb-3">
              <input
                type="text"
                value={attr.name}
                onChange={(e) =>
                  handleAttributeChange(index, "name", e.target.value)
                }
                placeholder="Attribute Name (e.g., Color)"
                className="flex-1 border rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <input
                type="text"
                value={attr.values}
                onChange={(e) =>
                  handleAttributeChange(index, "values", e.target.value)
                }
                placeholder="Values (comma-separated: Red, Blue, Green)"
                className="flex-1 border rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              {attributes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAttributeField(index)}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addAttributeField}
            className="text-teal-600 hover:text-teal-800 text-sm font-medium"
          >
            + Add Attribute
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push("/admin/category")}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Category"}
          </button>
        </div>
      </form>
    </div>
  );
}

// Cascading Menu Component (same as AddCategory)
function CascadingMenu({ categories, parentId = null, path = [], onSelect }) {
  const [hovered, setHovered] = useState(null);

  const filteredCategories = categories.filter((cat) => {
    const pId =
      typeof cat.parentId === "object" ? cat.parentId?._id : cat.parentId;
    return parentId === pId;
  });

  if (filteredCategories.length === 0) return null;

  const xOffset = parentId ? "left-full" : "";
  const yOffset = parentId ? "top-0" : "";

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg shadow-lg ${
        parentId ? "absolute min-w-[200px] " + xOffset + " " + yOffset : ""
      }`}
      style={{ zIndex: 1000 }}
    >
      <div className={parentId ? "py-1" : ""}>
        {filteredCategories.map((cat) => (
          <div
            key={cat._id}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer relative"
            onMouseEnter={() => setHovered(cat)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => {
              // Allow selection of any category, regardless of whether it has children
              onSelect(cat, [...path, cat]);
            }}
          >
            {cat.name}
            {categories.some((c) => {
              const pId =
                typeof c.parentId === "object" ? c.parentId?._id : c.parentId;
              return pId === cat._id;
            }) && <span className="float-right">▶</span>}
          </div>
        ))}
      </div>
      {hovered &&
        categories.some((c) => {
          const pId =
            typeof c.parentId === "object" ? c.parentId?._id : c.parentId;
          return pId === hovered._id;
        }) && (
          <CascadingMenu
            categories={categories}
            parentId={hovered._id}
            path={[...path, hovered]}
            onSelect={onSelect}
          />
        )}
    </div>
  );
}

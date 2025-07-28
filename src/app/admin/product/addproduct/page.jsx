"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [status, setStatus] = useState("active");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [images, setImages] = useState("");
  const [relatedProductIds, setRelatedProductIds] = useState("");
  const [variants, setVariants] = useState([
    {
      sku: "",
      price: 0,
      stock: 0,
      attributes: {},
      images: "",
      isDefault: true,
    },
  ]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/category")
      .then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    if (!categoryId) return;
    const selected = categories.find((c) => c._id === categoryId);
    if (selected) setAttributes(selected.attributes || []);
  }, [categoryId]);

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const handleAttributeChange = (index, key, value) => {
    const updated = [...variants];
    updated[index].attributes[key] = value;
    setVariants(updated);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        sku: "",
        price: 0,
        stock: 0,
        attributes: {},
        images: "",
        isDefault: false,
      },
    ]);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalPrice = price - discount;
    const totalStock = variants.reduce((sum, v) => sum + Number(v.stock), 0);
    const payload = {
      name,
      slug,
      categoryId,
      description,
      tags: tags.split(",").map((t) => t.trim()),
      price,
      finalPrice,
      discount,
      isFeatured,
      isNewArrival,
      status,
      seoTitle,
      seoDescription,
      images: images.split(",").map((img) => img.trim()),
      relatedProductIds: relatedProductIds
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id),
      variants,
      totalStock,
    };

    try {
      await axios.post("http://localhost:5000/api/product", payload);
      alert("✅ Product created");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create product");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-white bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-white">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Selection */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Category *
          </label>
          <select
            className="w-full text-black p-3 rounded-lg border border-gray-600 bg-white"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Product Name */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Product Name *
          </label>
          <input
            type="text"
            className="w-full p-3 text-black rounded-lg border border-gray-600 bg-white"
            placeholder="Enter product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Slug
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Slug (URL friendly name)
          </label>
          <input
            type="text"
            className="w-full p-3 text-black rounded-lg border border-gray-600 bg-white"
            placeholder="product-slug-example"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div> */}

        {/* Description */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            className="w-full p-3 text-black rounded-lg border border-gray-600 bg-white h-32"
            placeholder="Enter product description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Tags
          </label>
          <input
            type="text"
            className="w-full p-3 text-black rounded-lg border border-gray-600 bg-white"
            placeholder="tag1, tag2, tag3"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <p className="text-gray-400 text-sm mt-1">
            Separate tags with commas
          </p>
        </div>

        {/* Product Images */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Product Images
          </label>
          <input
            type="text"
            className="w-full p-3 text-black rounded-lg border border-gray-600 bg-white"
            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
            value={images}
            onChange={(e) => setImages(e.target.value)}
          />
          <p className="text-gray-400 text-sm mt-1">
            Separate image URLs with commas
          </p>
        </div>

        {/* Related Product IDs */}
        {/* <div>
          <label className="block text-white text-sm font-medium mb-2">
            Related Product IDs
          </label>
          <input
            type="text"
            className="w-full p-3 text-black rounded-lg border border-gray-600 bg-white"
            placeholder="productId1, productId2, productId3"
            value={relatedProductIds}
            onChange={(e) => setRelatedProductIds(e.target.value)}
          />
          <p className="text-gray-400 text-sm mt-1">
            Separate product IDs with commas
          </p>
        </div> */}

        {/* SEO Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              SEO Title
            </label>
            <input
              type="text"
              className="w-full p-3 text-black rounded-lg border border-gray-600 bg-white"
              placeholder="SEO optimized title"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              SEO Description
            </label>
            <input
              type="text"
              className="w-full p-3 text-black rounded-lg border border-gray-600 bg-white"
              placeholder="SEO meta description"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Base Price
            </label>
            <input
              type="number"
              className="w-full p-3 text-black rounded-lg border border-gray-600 bg-white"
              placeholder="0"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              min="0"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Discount
            </label>
            <input
              type="number"
              className="w-full p-3 text-black rounded-lg border border-gray-600 bg-white"
              placeholder="0"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              min="0"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Status
          </label>
          <select
            className="w-full p-3 text-black rounded-lg border border-gray-600 bg-white"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Checkboxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center gap-3 text-white">
            <input
              type="checkbox"
              className="w-4 h-4"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
            />
            <span className="text-sm font-medium">Featured Product</span>
          </label>

          <label className="flex items-center gap-3 text-white">
            <input
              type="checkbox"
              className="w-4 h-4"
              checked={isNewArrival}
              onChange={(e) => setIsNewArrival(e.target.checked)}
            />
            <span className="text-sm font-medium">New Arrival</span>
          </label>
        </div>

        {/* Variants Section */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">
            Product Variants
          </h3>
          {variants.map((variant, index) => (
            <div
              key={index}
              className="border border-gray-600 p-4 rounded-lg bg-gray-800 mb-4"
            >
              <h4 className="text-lg font-medium text-white mb-3">
                Variant {index + 1}
              </h4>

              {/* SKU, Price, Stock */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    SKU
                  </label>
                  <input
                    className="w-full p-3 text-black rounded-lg border border-gray-600 bg-white"
                    placeholder="SKU-001"
                    value={variant.sku}
                    onChange={(e) =>
                      handleVariantChange(index, "sku", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Price
                  </label>
                  <input
                    className="w-full p-3 text-black rounded-lg border border-gray-600 bg-white"
                    placeholder="0"
                    type="number"
                    value={variant.price}
                    onChange={(e) =>
                      handleVariantChange(
                        index,
                        "price",
                        Number(e.target.value)
                      )
                    }
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Stock
                  </label>
                  <input
                    className="w-full p-3 text-black rounded-lg border border-gray-600 bg-white"
                    placeholder="0"
                    type="number"
                    value={variant.stock}
                    onChange={(e) =>
                      handleVariantChange(
                        index,
                        "stock",
                        Number(e.target.value)
                      )
                    }
                    min="0"
                  />
                </div>
              </div>

              {/* Variant Images */}
              <div className="mb-4">
                <label className="block text-white text-sm font-medium mb-2">
                  Variant Images
                </label>
                <input
                  type="text"
                  className="w-full p-3 text-black rounded-lg border border-gray-600 bg-white"
                  placeholder="https://example.com/variant1.jpg, https://example.com/variant2.jpg"
                  value={variant.images}
                  onChange={(e) =>
                    handleVariantChange(index, "images", e.target.value)
                  }
                />
                <p className="text-gray-400 text-sm mt-1">
                  Separate image URLs with commas
                </p>
              </div>

              {/* Attributes */}
              {attributes.length > 0 && (
                <div className="mb-4">
                  <label className="block text-white text-sm font-medium mb-2">
                    Attributes
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {attributes.map((attr) => (
                      <div key={attr.name}>
                        <label className="block text-white text-xs font-medium mb-1">
                          {attr.name}
                        </label>
                        <select
                          className="w-full p-2 text-black rounded border border-gray-600 bg-white"
                          value={variant.attributes[attr.name] || ""}
                          onChange={(e) =>
                            handleAttributeChange(
                              index,
                              attr.name,
                              e.target.value
                            )
                          }
                        >
                          <option value="">-- Select {attr.name} --</option>
                          {attr.values.map((val, i) => (
                            <option key={i} value={val}>
                              {val}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Default Variant and Remove */}
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={variant.isDefault}
                    onChange={(e) =>
                      handleVariantChange(index, "isDefault", e.target.checked)
                    }
                  />
                  <span className="text-sm font-medium">Default Variant</span>
                </label>

                {variants.length > 1 && (
                  <button
                    type="button"
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    onClick={() => removeVariant(index)}
                  >
                    Remove Variant
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addVariant}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Add New Variant
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 px-6 py-3 rounded-lg text-white font-semibold hover:bg-green-700 transition-colors"
        >
          Save Product
        </button>
      </form>
    </div>
  );
}

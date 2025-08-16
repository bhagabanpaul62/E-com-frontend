"use client";

import { useEffect, useState } from "react";
import { ProductPreview } from "@/components/admin/productView";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams, useRouter } from "next/navigation";

export default function EditProductForm() {
  const router = useRouter()
  // State for file uploads
  const { id } = useParams();
  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [variantImages, setVariantImages] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    brand: "",
    tags: "",
    category: "",
    asin: "",
    price: 0,
    mrpPrice: 0,
    discount: 0,
    totalStock: 0,
    description: "",
    seoTitle: "",
    seoDescription: "",
    isFeatured: false,
    isNewArrival: false,
    isTrending: false,
    variants: [],
    selectedCategory: null,
    categoryAttributes: [],
    existingMainImage: null,
    existingVariantImages: {},
    returnPolicy: {
      isReturnable: true,
      isReturnDays: 7,
      isReturnCost: 0,
    },
    warranty: {
      description: "",
      warrantyType: "Platform",
      policy: "",
    },
    shippingDetails: {
      weight: 0,
      weightUnit: "kg",
      height: 0,
      width: 0,
      depth: 0,
      dimensionUnit: "cm",
      shippingOption: [
        {
          shippingType: "Normal",
          cost: 0,
          estimatedDays: 3,
        },
      ],
    },
    productDimension: {
      weight: 0,
      weightUnit: "kg",
      height: 0,
      width: 0,
      depth: 0,
      dimensionUnit: "cm",
    },
  });

  const [categories, setCategories] = useState([]);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [selectedCategoryPath, setSelectedCategoryPath] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER}/admin/category`,
          { withCredentials: true }
        );
        setCategories(res.data.data.data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };

    const fetchProductData = async () => {
      if (id) {
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_SERVER}/admin/view-product-by-id/${id}`,
            { withCredentials: true }
          );
          const productData = res.data.data;
          console.log("Product data loaded:", productData);

          // Find the selected category from the categories array
          const categoryId = productData.categoryId || "";
          const selectedCategory = categories.find(
            (cat) => cat._id === categoryId
          );

          // Get category attributes if available
          let categoryAttributes = [];
          if (selectedCategory && selectedCategory.attributes) {
            categoryAttributes = selectedCategory.attributes.filter(
              (attr) =>
                attr.name &&
                Array.isArray(attr.values) &&
                attr.values.some((val) => val && val.trim() !== "")
            );
          }

          // Update form data with the fetched product details
          setFormData({
            ...formData,
            name: productData.name || "",
            slug: productData.slug || "",
            brand: productData.brand || "",
            tags: Array.isArray(productData.tags)
              ? productData.tags.join(", ")
              : "",
            category: categoryId,
            selectedCategory: selectedCategory || null,
            categoryAttributes: categoryAttributes,
            asin: productData.asin || "",
            price: productData.price || 0,
            mrpPrice: productData.mrpPrice || 0,
            discount: productData.discount || 0,
            totalStock: productData.totalStock || 0,
            description: productData.description || "",
            seoTitle: productData.seoTitle || "",
            seoDescription: productData.seoDescription || "",
            isFeatured: productData.isFeatured || false,
            isNewArrival: productData.isNewArrival || false,
            isTrending: productData.isTrending || false,
            variants: productData.variants || [],
            returnPolicy: productData.returnPolicy || formData.returnPolicy,
            warranty: productData.warranty || formData.warranty,
            shippingDetails:
              productData.shippingDetails || formData.shippingDetails,
            productDimension:
              productData.productDimension || formData.productDimension,
          });

          // Set existing images URLs for display
          if (productData.mainImage) {
            // Store the URL of the existing main image
            setFormData((prev) => ({
              ...prev,
              existingMainImage: productData.mainImage,
            }));
            console.log("Main image exists:", productData.mainImage);
          }

          if (productData.variants && productData.variants.length > 0) {
            // Handle variant images
            const existingVariantImagesObj = {};
            productData.variants.forEach((variant, index) => {
              if (variant.images && variant.images.length > 0) {
                existingVariantImagesObj[index] = variant.images;
                console.log(`Variant ${index} has images:`, variant.images);
              }
            });

            // Store existing variant images URLs
            setFormData((prev) => ({
              ...prev,
              existingVariantImages: existingVariantImagesObj,
            }));
          }
        } catch (err) {
          console.error("Failed to load product data", err);
        }
      }
    };

    const loadData = async () => {
      setIsLoading(true);
      try {
        // First fetch categories
        await fetchCategories();

        // Then fetch product data if we have an ID
        if (id) {
          await fetchProductData();
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update the form data with the new value
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      // Auto-generate slug from name
      if (name === "name") {
        updatedData.slug = value
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, "");

        // Auto-fill SEO title if it's empty
        if (!prevData.seoTitle) {
          updatedData.seoTitle = value;
        }
      }

      // Auto-fill SEO description from product description
      if (name === "description" && !prevData.seoDescription) {
        updatedData.seoDescription = value;
      }

      return updatedData;
    });
  };

  const handleSelectChange = async (field, value) => {
    if (field === "category") {
      try {
        // Find the selected category from the categories array
        const selectedCategory = categories.find((cat) => cat._id === value);

        if (selectedCategory && selectedCategory.attributes) {
          // Filter out any attributes that don't have valid values
          const validAttributes = selectedCategory.attributes.filter(
            (attr) =>
              attr.name &&
              Array.isArray(attr.values) &&
              attr.values.some((val) => val && val.trim() !== "")
          );

          // Set the category attributes in the form data
          setFormData({
            ...formData,
            [field]: value,
            selectedCategory: selectedCategory,
            categoryAttributes: validAttributes,
            // Reset variants when category changes
            variants: formData.variants.map((variant) => ({
              ...variant,
              attributes: {},
            })),
          });
        } else {
          setFormData({
            ...formData,
            [field]: value,
            selectedCategory: null,
            categoryAttributes: [],
            variants: formData.variants.map((variant) => ({
              ...variant,
              attributes: {},
            })),
          });
        }
      } catch (err) {
        console.error("Error handling category selection:", err);
        setFormData({
          ...formData,
          [field]: value,
          selectedCategory: null,
          categoryAttributes: [],
          variants: formData.variants.map((variant) => ({
            ...variant,
            attributes: {},
          })),
        });
      }
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  // Handle main product image upload with validation
  const handleMainImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        console.error("Invalid file type. Please select an image.");
        return;
      }
      console.log("Selected main image:", {
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(2)}KB`,
      });
      setMainImage(file);
    }
  };

  // Handle gallery images upload
  const handleGalleryImagesChange = (e) => {
    if (e.target.files) {
      setGalleryImages(Array.from(e.target.files));
    }
  };

  // Handle variant image upload
  const handleVariantImageChange = (e, index) => {
    if (e.target.files && e.target.files[0]) {
      // Store the image in the variantImages state
      setVariantImages((prev) => ({
        ...prev,
        [index]: e.target.files[0],
      }));

      // Update the variant to indicate it has an image
      const updatedVariants = [...formData.variants];
      updatedVariants[index] = {
        ...updatedVariants[index],
        hasImage: true,
      };
      setFormData((prev) => ({
        ...prev,
        variants: updatedVariants,
      }));
    }
  };

  const handleVariantChange = (e, index, field) => {
    const { value } = e.target;
    const updatedVariants = [...formData.variants];

    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: field === "price" || field === "stock" ? Number(value) : value,
    };

    setFormData((prev) => ({
      ...prev,
      variants: updatedVariants,
    }));
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...(prev.variants || []),
        { sku: "", price: 0, stock: 0, attributes: {}, hasImage: false },
      ],
    }));
  };

  const removeVariant = (index) => {
    const updatedVariants = [...formData.variants];
    updatedVariants.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      variants: updatedVariants,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    // Basic validation
    if (!formData.name || !formData.category) {
      setSubmitError("Product name and category are required");
      setIsSubmitting(false);
      return;
    }

    console.log("🚀 Starting form submission...");

    // Create FormData object for file uploads
    const formDataObj = new FormData();

    // Only require main image for new products, not for edits
    if (!id && !mainImage) {
      setSubmitError("Main product image is required");
      setIsSubmitting(false);
      return;
    }

    // Prepare the product data, excluding backend-handled fields
    const {
      discount,
      totalStock,
      slug,
      seoTitle,
      seoDescription,
      ...productDataToSend
    } = formData;

    // Auto-generate ASIN if not provided
    const asinValue =
      formData.asin && formData.asin.trim() !== ""
        ? formData.asin
        : `ASIN${Date.now()}`;

    // Sanitize shipping details
    const shippingDetails = {
      ...productDataToSend.shippingDetails,
      weight: Number(productDataToSend.shippingDetails.weight) || 0,
      height: Number(productDataToSend.shippingDetails.height) || 0,
      width: Number(productDataToSend.shippingDetails.width) || 0,
      depth: Number(productDataToSend.shippingDetails.depth) || 0,
      shippingOption: [
        {
          ...productDataToSend.shippingDetails.shippingOption[0],
          cost:
            Number(productDataToSend.shippingDetails.shippingOption[0].cost) ||
            0,
          estimatedDays:
            Number(
              productDataToSend.shippingDetails.shippingOption[0].estimatedDays
            ) || 0,
        },
      ],
    };

    // Sanitize return policy
    const returnPolicy = {
      ...productDataToSend.returnPolicy,
      isReturnDays: Number(productDataToSend.returnPolicy.isReturnDays) || 0,
      isReturnCost: Number(productDataToSend.returnPolicy.isReturnCost) || 0,
    };

    // Prepare product data and map fields correctly
    const productData = {
      ...productDataToSend,
      asin: asinValue,
      categoryId: productDataToSend.category, // Map category to categoryId for backend
      shippingDetails,
      returnPolicy,
      price: Number(productDataToSend.price) || 0,
      mrpPrice: Number(productDataToSend.mrpPrice) || 0,
      tags: productDataToSend.tags
        ? productDataToSend.tags.split(",").map((tag) => tag.trim())
        : [], // Convert tags string to array
    };

    // Remove unnecessary fields
    delete productData.category;
    delete productData.selectedCategory;
    delete productData.categoryAttributes;

    // Add the product data as JSON string
    formDataObj.append("product", JSON.stringify(productData));
    console.log("📦 Product data being sent:", productData);

    // Handle main product image
    if (mainImage) {
      console.log("🖼️ Appending main image:", {
        name: mainImage.name,
        type: mainImage.type,
        size: mainImage.size,
      });
      formDataObj.append("productImage", mainImage);
    }

    // Auto-generate ASIN if not provided    // Add variant images if they exist
    if (formData.variants && formData.variants.length > 0) {
      // Process variants to ensure attributes are properly formatted and numbers are numbers
      const processedVariants = formData.variants.map((variant) => ({
        ...variant,
        price: Number(variant.price) || 0,
        stock: Number(variant.stock) || 0,
        attributes:
          typeof variant.attributes === "string"
            ? (() => {
                try {
                  return JSON.parse(variant.attributes);
                } catch (e) {
                  return {};
                }
              })()
            : variant.attributes,
      }));

      // Append variant data as JSON
      formDataObj.append("variants", JSON.stringify(processedVariants));

      // Append variant images
      Object.entries(variantImages).forEach(([variantIndex, images]) => {
        // Check if images is an array (multiple images) or single image
        const imageArray = Array.isArray(images) ? images : [images];

        // If we have new images for this variant, add a flag to indicate existing images should be replaced
        if (imageArray.length > 0) {
          formDataObj.append(`replace_variant_images_${variantIndex}`, "true");
        }

        imageArray.forEach((image, imageIndex) => {
          if (image) {
            const fieldName = `variant_${variantIndex}_${imageIndex}`;
            console.log(
              `📎 Appending variant image with fieldname: ${fieldName}`,
              {
                name: image.name,
                type: image.type,
                size: image.size,
              }
            );
            formDataObj.append(fieldName, image);
          }
        });
      });
    }

    // Log complete FormData contents
    for (let pair of formDataObj.entries()) {
      console.log(pair[0], pair[1]);
    }

    // Use correct API endpoint based on whether we're editing or creating
    try {
      const apiUrl = id
        ? `${process.env.NEXT_PUBLIC_SERVER}/admin/edit-product/${id}`
        : `${process.env.NEXT_PUBLIC_SERVER}/admin/add-product`;

      const httpMethod = id ? axios.patch : axios.post;

      console.log("API URL:", apiUrl);
      const response = await httpMethod(apiUrl, formDataObj, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("API Response:", response.data); // Debug log

      setSubmitSuccess(
        id ? "Product updated successfully!" : "Product added successfully!"
      );
      // Reset form or redirect
      setTimeout(() => {
        // Reset form data
        setFormData({
          name: "",
          slug: "",
          brand: "",
          tags: "",
          category: "",
          asin: "",
          price: 0,
          mrpPrice: 0,
          discount: 0,
          totalStock: 0,
          description: "",
          seoTitle: "",
          seoDescription: "",
          isFeatured: false,
          isNewArrival: false,
          isTrending: false,
          variants: [],
          categoryAttributes: [],
          returnPolicy: {
            isReturnable: true,
            isReturnDays: 7,
            isReturnCost: 0,
          },
          warranty: {
            description: "",
            warrantyType: "Platform",
            policy: "",
          },
          shippingDetails: {
            weight: 0,
            weightUnit: "kg",
            height: 0,
            width: 0,
            depth: 0,
            dimensionUnit: "cm",
            shippingOption: [
              {
                shippingType: "Normal",
                cost: 0,
                estimatedDays: 3,
              },
            ],
          },
          productDimension: {
            weight: 0,
            weightUnit: "kg",
            height: 0,
            width: 0,
            depth: 0,
            dimensionUnit: "cm",
          },
        });

        // Reset file uploads
        setMainImage(null);
        setGalleryImages([]);
        setVariantImages({});
        setSubmitSuccess("");
        // add navication
        router.push("/admin/product")
      }, 2000);
    } catch (error) {
      console.error("Error adding product:", error);
      setSubmitError(
        error.response?.data?.message || id
          ? "Failed to update product. Please try again."
          : "Failed to add product. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Loading product data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-[70vw] mx-auto">
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">
          {id ? "Edit Product" : "Add New Product"}
        </h1>

        <Tabs defaultValue="basicInfo" className="w-full">
          <TabsList className="mb-6 overflow-x-auto">
            <TabsTrigger value="basicInfo">Basic Info</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="variants">Variants</TabsTrigger>
            <TabsTrigger value="shipping">Shipping Info</TabsTrigger>
            <TabsTrigger value="return">Return & Warranty</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="basicInfo" className="space-y-4">
            <Label>Product Name</Label>
            <Input name="name" value={formData.name} onChange={handleChange} />

            <Label>Slug (Auto-generated)</Label>
            <Input
              name="slug"
              value={formData.slug}
              readOnly
              className="bg-gray-100"
            />

            <Label>Category</Label>
            <div className="relative inline-block w-full">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-between"
                onClick={() => setCategoryMenuOpen((open) => !open)}
              >
                {selectedCategoryPath.length > 0
                  ? selectedCategoryPath.map((cat) => cat.name).join(" → ")
                  : "Select Category"}
                <span className="ml-2">▼</span>
              </Button>
              {categoryMenuOpen && (
                <div
                  className="absolute z-50 mt-2 bg-white border rounded-md shadow-lg flex min-w-[250px]"
                  style={{ minHeight: 200 }}
                >
                  <CascadingMenu
                    categories={categories}
                    onSelect={(cat, path) => {
                      setFormData((prev) => ({ ...prev, category: cat._id }));
                      setSelectedCategoryPath(path);
                      setCategoryMenuOpen(false);
                    }}
                  />
                </div>
              )}
            </div>
            {/* Display Selection */}
            {selectedCategoryPath.length > 0 && (
              <p className="mt-4 font-medium">
                Selected Path:{" "}
                {selectedCategoryPath.map((cat) => cat.name).join(" → ")}
              </p>
            )}

            <Label>Brand</Label>
            <Input
              name="brand"
              value={formData.brand}
              onChange={handleChange}
            />

            <Label>ASIN </Label>
            <Input
              name="asin"
              value={formData.asin}
              onChange={handleChange}
              placeholder="e.g. B0FJYGHQMX"
            />

            <Label>Tags</Label>
            <Input name="tags" value={formData.tags} onChange={handleChange} />

            <Label>Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="min-h-[120px]"
            />

            <Label>Weight</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                name="weight"
                min={0}
                className="flex-1 "
                value={formData.productDimension.weight}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    productDimension: {
                      ...formData.productDimension,
                      weight: e.target.value,
                    },
                  })
                }
              />
              <Select
                value={formData.productDimension.weightUnit}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    productDimension: {
                      ...formData.productDimension,
                      weightUnit: value,
                    },
                  })
                }
              >
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="g">g</SelectItem>
                  <SelectItem value="lb">lb</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Label>Dimensions</Label>
            <div className="flex justify-between gap-2 items-center">
              <div className="flex justify-center items-center border-2 rounded-sm ">
                <Input
                  type="number"
                  name="height"
                  placeholder="H"
                  min={1}
                  className="w-24 border-none"
                  value={formData.productDimension.height}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      productDimension: {
                        ...formData.productDimension,
                        height: e.target.value,
                      },
                    })
                  }
                />
                <p className="p-2">Hight</p>
              </div>
              <div className="flex justify-center items-center border-2 rounded-sm ">
                <Input
                  type="number"
                  name="width"
                  min={1}
                  placeholder="W"
                  className="w-24 border-none "
                  value={formData.productDimension.width}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      productDimension: {
                        ...formData.productDimension,
                        width: e.target.value,
                      },
                    })
                  }
                />
                <p className="p-2">Width</p>
              </div>
              <div className="flex justify-center items-center border-2 rounded-sm">
                <Input
                  type="number"
                  name="depth"
                  min={1}
                  placeholder="D"
                  className="w-24 border-none "
                  value={formData.productDimension.depth}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      productDimension: {
                        ...formData.productDimension,
                        depth: e.target.value,
                      },
                    })
                  }
                />
                <p className="p-2">Depth</p>
              </div>
              <Select
                value={formData.productDimension.dimensionUnit}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    productDimension: {
                      ...formData.productDimension,
                      dimensionUnit: value,
                    },
                  })
                }
              >
                <SelectTrigger className="w-28 p-5">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cm">cm</SelectItem>
                  <SelectItem value="m">m</SelectItem>
                  <SelectItem value="in">in</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4">
            <Label>Selling Price</Label>
            <Input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />

            <Label>MRP Price</Label>
            <Input
              type="number"
              name="mrpPrice"
              value={formData.mrpPrice}
              onChange={handleChange}
            />

            <Label>Discount (%)</Label>
            <Input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
            />

            <Label>Total Stock</Label>
            <Input
              type="number"
              name="totalStock"
              value={formData.totalStock}
              onChange={handleChange}
            />
          </TabsContent>

          <TabsContent value="shipping" className="space-y-4">
            <Label>Weight</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                name="weight"
                className="flex-1"
                value={formData.shippingDetails.weight}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    shippingDetails: {
                      ...formData.shippingDetails,
                      weight: e.target.value,
                    },
                  })
                }
              />
              <Select
                value={formData.shippingDetails.weightUnit}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    shippingDetails: {
                      ...formData.shippingDetails,
                      weightUnit: value,
                    },
                  })
                }
              >
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="g">g</SelectItem>
                  <SelectItem value="lb">lb</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Label>Dimensions</Label>
            <div className="flex  justify-between gap-2 items-center">
              <div className="flex justify-center items-center border-2 rounded-sm ">
                <Input
                  type="number"
                  name="height"
                  placeholder="H"
                  min={1}
                  className="w-24 border-none"
                  value={formData.shippingDetails.height}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shippingDetails: {
                        ...formData.shippingDetails,
                        height: e.target.value,
                      },
                    })
                  }
                />
                <p className="p-2">Hight</p>
              </div>
              <div className="flex justify-center items-center border-2 rounded-sm ">
                <Input
                  type="number"
                  name="width"
                  min={1}
                  placeholder="W"
                  className="w-24 border-none"
                  value={formData.shippingDetails.width}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shippingDetails: {
                        ...formData.shippingDetails,
                        width: e.target.value,
                      },
                    })
                  }
                />
                <p className="p-2">Width</p>
              </div>
              <div className="flex justify-center items-center border-2 rounded-sm">
                <Input
                  type="number"
                  name="depth"
                  min={1}
                  placeholder="D"
                  className="w-24 border-none"
                  value={formData.shippingDetails.depth}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shippingDetails: {
                        ...formData.shippingDetails,
                        depth: e.target.value,
                      },
                    })
                  }
                />
                <p className="p-2">Depth</p>
              </div>
              <Select
                value={formData.shippingDetails.dimensionUnit}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    shippingDetails: {
                      ...formData.shippingDetails,
                      dimensionUnit: value,
                    },
                  })
                }
              >
                <SelectTrigger className="w-28 p-5">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cm">cm</SelectItem>
                  <SelectItem value="m">m</SelectItem>
                  <SelectItem value="in">in</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Label>Shipping Type</Label>
            <Select
              value={formData.shippingDetails.shippingOption[0].shippingType}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  shippingDetails: {
                    ...formData.shippingDetails,
                    shippingOption: [
                      {
                        ...formData.shippingDetails.shippingOption[0],
                        shippingType: value,
                      },
                    ],
                  },
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select shipping type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="Express">Express</SelectItem>
                <SelectItem value="Free">Free</SelectItem>
              </SelectContent>
            </Select>

            <Label>Shipping Cost</Label>
            <Input
              type="number"
              value={formData.shippingDetails.shippingOption[0].cost}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  shippingDetails: {
                    ...formData.shippingDetails,
                    shippingOption: [
                      {
                        ...formData.shippingDetails.shippingOption[0],
                        cost: e.target.value,
                      },
                    ],
                  },
                })
              }
            />

            <Label>Estimated Delivery Days</Label>
            <Input
              type="number"
              value={formData.shippingDetails.shippingOption[0].estimatedDays}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  shippingDetails: {
                    ...formData.shippingDetails,
                    shippingOption: [
                      {
                        ...formData.shippingDetails.shippingOption[0],
                        estimatedDays: e.target.value,
                      },
                    ],
                  },
                })
              }
            />
          </TabsContent>

          <TabsContent value="return" className="space-y-4">
            <Label>Is Returnable</Label>
            <Select
              value={formData.returnPolicy.isReturnable.toString()}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  returnPolicy: {
                    ...formData.returnPolicy,
                    isReturnable: value === "true",
                  },
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>

            <Label>Return Days</Label>
            <Input
              type="number"
              value={formData.returnPolicy.isReturnDays}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  returnPolicy: {
                    ...formData.returnPolicy,
                    isReturnDays: e.target.value,
                  },
                })
              }
            />

            <Label>Return Cost</Label>
            <Input
              type="number"
              value={formData.returnPolicy.isReturnCost}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  returnPolicy: {
                    ...formData.returnPolicy,
                    isReturnCost: e.target.value,
                  },
                })
              }
            />

            <Label>Warranty Type</Label>
            <Select
              value={formData.warranty.warrantyType}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  warranty: {
                    ...formData.warranty,
                    warrantyType: value,
                  },
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select warranty type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Platform">Platform</SelectItem>
                <SelectItem value="Brand">Brand</SelectItem>
                <SelectItem value="Seller">Seller</SelectItem>
              </SelectContent>
            </Select>

            <Label>Warranty Description</Label>
            <Textarea
              value={formData.warranty.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  warranty: {
                    ...formData.warranty,
                    description: e.target.value,
                  },
                })
              }
            />

            <Label>Warranty Policy</Label>
            <Textarea
              value={formData.warranty.policy}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  warranty: {
                    ...formData.warranty,
                    policy: e.target.value,
                  },
                })
              }
            />
          </TabsContent>

          <TabsContent value="variants" className="space-y-4">
            <div className="mb-4">
              <Label>Product Variants</Label>
              <p className="text-sm text-gray-500 mt-1">
                Add variants like size, color, etc.
              </p>

              {formData.variants &&
                formData.variants.map((variant, index) => (
                  <div key={index} className="p-4 border rounded-md mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Variant {index + 1}</h3>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const updatedVariants = [...formData.variants];
                          updatedVariants.splice(index, 1);
                          setFormData((prev) => ({
                            ...prev,
                            variants: updatedVariants,
                          }));
                        }}
                      >
                        Remove
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label>SKU</Label>
                        <Input
                          value={variant.sku || ""}
                          onChange={(e) => {
                            const updatedVariants = [...formData.variants];
                            updatedVariants[index] = {
                              ...updatedVariants[index],
                              sku: e.target.value,
                            };
                            setFormData((prev) => ({
                              ...prev,
                              variants: updatedVariants,
                            }));
                          }}
                        />
                      </div>

                      <div>
                        <Label>Selling Price</Label>
                        <Input
                          type="number"
                          value={variant.price || 0}
                          onChange={(e) => {
                            const updatedVariants = [...formData.variants];
                            updatedVariants[index] = {
                              ...updatedVariants[index],
                              price: Number(e.target.value),
                            };
                            setFormData((prev) => ({
                              ...prev,
                              variants: updatedVariants,
                            }));
                          }}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <Label>Stock</Label>
                      <Input
                        type="number"
                        value={variant.stock || 0}
                        onChange={(e) => {
                          const updatedVariants = [...formData.variants];
                          updatedVariants[index] = {
                            ...updatedVariants[index],
                            stock: Number(e.target.value),
                          };
                          setFormData((prev) => ({
                            ...prev,
                            variants: updatedVariants,
                          }));
                        }}
                      />
                    </div>

                    <div className="mb-4">
                      <Label>Attributes</Label>
                      {formData.categoryAttributes?.length > 0 ? (
                        <div className="space-y-3 mt-2">
                          {formData.categoryAttributes
                            .filter(
                              (attr) =>
                                attr.name &&
                                Array.isArray(attr.values) &&
                                attr.values.some(
                                  (val) => val && val.trim() !== ""
                                )
                            )
                            .map((attr, attrIndex) => (
                              <div
                                key={attrIndex}
                                className="grid grid-cols-2 gap-2"
                              >
                                <div>
                                  <Label className="text-sm">{attr.name}</Label>
                                </div>
                                <div>
                                  <Select
                                    value={
                                      variant.attributes &&
                                      variant.attributes[attr.name]
                                        ? variant.attributes[attr.name]
                                        : ""
                                    }
                                    onValueChange={(value) => {
                                      const updatedVariants = [
                                        ...formData.variants,
                                      ];
                                      updatedVariants[index] = {
                                        ...updatedVariants[index],
                                        attributes: {
                                          ...(typeof updatedVariants[index]
                                            .attributes === "string"
                                            ? JSON.parse(
                                                updatedVariants[index]
                                                  .attributes || "{}"
                                              )
                                            : updatedVariants[index]
                                                .attributes || {}),
                                          [attr.name]: value,
                                        },
                                      };
                                      setFormData((prev) => ({
                                        ...prev,
                                        variants: updatedVariants,
                                      }));
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue
                                        placeholder={`Select ${attr.name}`}
                                      />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {attr.values
                                        .filter(
                                          (val) => val && val.trim() !== ""
                                        )
                                        .map((val, valIndex) => (
                                          <SelectItem
                                            key={valIndex}
                                            value={val}
                                          >
                                            {val}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="mt-2">
                          <Textarea
                            value={
                              typeof variant.attributes === "string"
                                ? variant.attributes
                                : JSON.stringify(variant.attributes || {})
                            }
                            onChange={(e) => {
                              try {
                                // Store the raw string value
                                const updatedVariants = [...formData.variants];
                                updatedVariants[index] = {
                                  ...updatedVariants[index],
                                  attributes: e.target.value,
                                };
                                setFormData((prev) => ({
                                  ...prev,
                                  variants: updatedVariants,
                                }));
                              } catch (error) {
                                console.error(
                                  "Error updating attributes:",
                                  error
                                );
                              }
                            }}
                            placeholder="Enter attributes as JSON, e.g. {color:red, size:XL}"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Enter attributes as JSON object
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label>Variant Images</Label>

                      <div
                        className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center mt-2 relative w-full"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const droppedFiles = Array.from(
                            e.dataTransfer.files
                          ).filter((file) => file.type.startsWith("image/"));
                          if (droppedFiles.length) {
                            setVariantImages((prev) => ({
                              ...prev,
                              [index]: [
                                ...(prev[index] || []),
                                ...droppedFiles,
                              ],
                            }));
                          }
                        }}
                      >
                        <input
                          type="file"
                          id={`variant_${index}`}
                          className="hidden"
                          multiple
                          accept="image/*"
                          onChange={(e) => {
                            const selected = Array.from(e.target.files);
                            setVariantImages((prev) => ({
                              ...prev,
                              [index]: [...(prev[index] || []), ...selected],
                            }));
                          }}
                        />

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            document.getElementById(`variant_${index}`).click()
                          }
                        >
                          Upload Images
                        </Button>

                        {/* New uploaded variant images */}
                        {variantImages[index]?.length > 0 && (
                          <div className="w-full mt-4">
                            <Label className="text-sm text-gray-600 mb-2 block">
                              New Uploaded Images
                            </Label>
                            <div className="flex flex-wrap gap-5">
                              {variantImages[index].map((file, imgIdx) => (
                                <div
                                  key={imgIdx}
                                  className="relative w-20 h-20 group"
                                >
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Variant ${index} - Image ${imgIdx}`}
                                    className="w-full h-full object-cover rounded border"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newImages = [
                                        ...variantImages[index],
                                      ];
                                      newImages.splice(imgIdx, 1);
                                      setVariantImages((prev) => ({
                                        ...prev,
                                        [index]: newImages,
                                      }));
                                    }}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs z-10"
                                    title="Remove"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Existing variant images from database */}
                        {formData.existingVariantImages &&
                          formData.existingVariantImages[index]?.length > 0 && (
                            <div className="w-full mt-4">
                              <Label className="text-sm text-gray-600 mb-2 block">
                                Current Images
                              </Label>
                              <div className="flex flex-wrap gap-5">
                                {formData.existingVariantImages[index].map(
                                  (imageUrl, imgIdx) => (
                                    <div
                                      key={`existing-${imgIdx}`}
                                      className="relative w-20 h-20 group"
                                    >
                                      <img
                                        src={imageUrl}
                                        alt={`Variant ${index} - Existing Image ${imgIdx}`}
                                        className="w-full h-full object-cover rounded border"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          // Create a copy of the existing images array
                                          const newExistingImages = [
                                            ...formData.existingVariantImages[
                                              index
                                            ],
                                          ];
                                          // Remove the image at the specified index
                                          newExistingImages.splice(imgIdx, 1);
                                          // Update the formData state
                                          setFormData((prev) => ({
                                            ...prev,
                                            existingVariantImages: {
                                              ...prev.existingVariantImages,
                                              [index]: newExistingImages,
                                            },
                                          }));
                                        }}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs z-10"
                                        title="Remove"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  )
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Click × to remove individual images or upload
                                new images above to add more
                              </p>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                ))}

              <Button
                type="button"
                className="mt-4"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    variants: [
                      ...(prev.variants || []),
                      {
                        sku: "",
                        price: 0,
                        stock: 0,
                        attributes: {},
                        hasImage: false,
                        isDefault: prev.variants?.length === 0,
                      },
                    ],
                  }));
                }}
              >
                Add Variant
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            <Label>Main Product Image</Label>

            <div className="w-full">
              {/* MAIN IMAGE UPLOAD */}
              <div
                className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center relative"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file?.type?.startsWith("image/")) setMainImage(file);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-500">Add main image</p>

                <input
                  type="file"
                  className="hidden"
                  name="productImage"
                  id="mainImage"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) setMainImage(e.target.files[0]);
                  }}
                />

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => document.getElementById("mainImage").click()}
                >
                  Upload
                </Button>
              </div>

              {/* MAIN IMAGE PREVIEW */}
              {mainImage ? (
                <div className="mt-4">
                  <Label className="text-sm text-gray-600">
                    Main Image Preview (New Upload)
                  </Label>
                  <img
                    src={URL.createObjectURL(mainImage)}
                    alt="Main Preview"
                    className="mt-2 w-24 h-24 object-cover rounded border"
                  />
                </div>
              ) : formData.existingMainImage ? (
                <div className="mt-4">
                  <Label className="text-sm text-gray-600">
                    Current Main Image
                  </Label>
                  <img
                    src={formData.existingMainImage}
                    alt="Current Main Image"
                    className="mt-2 w-24 h-24 object-cover rounded border"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload a new image to replace this one
                  </p>
                </div>
              ) : null}
            </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-4">
            <Label>SEO Title (Auto-generated from product name)</Label>
            <Input
              name="seoTitle"
              value={formData.seoTitle}
              readOnly
              className="bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              This field is automatically generated from the product name
            </p>

            <Label>
              SEO Description (Auto-generated from product description)
            </Label>
            <Textarea
              name="seoDescription"
              value={formData.seoDescription}
              readOnly
              className="bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              This field is automatically generated from the product description
            </p>

            <div className="mt-4">
              <Label>Product Visibility</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData({ ...formData, isFeatured: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="isFeatured" className="text-sm font-normal">
                    Featured Product
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isNewArrival"
                    checked={formData.isNewArrival}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isNewArrival: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="isNewArrival" className="text-sm font-normal">
                    New Arrival
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isTrending"
                    checked={formData.isTrending}
                    onChange={(e) =>
                      setFormData({ ...formData, isTrending: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="isTrending" className="text-sm font-normal">
                    Trending Product
                  </Label>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 space-y-4">
          {submitError && (
            <div
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{submitError}</span>
            </div>
          )}

          {submitSuccess && (
            <div
              className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{submitSuccess}</span>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : id ? (
              "Update Product"
            ) : (
              "Save Product"
            )}
          </Button>
        </div>
      </form>
      {/* Side Preview */}
      <div className="w-full lg:w-1/3 p-6 border rounded-lg h-fit bg-white shadow">
        <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
        <ProductPreview
          formData={formData}
          mainImage={mainImage}
          variantImages={variantImages}
        />
        <p className="text-xs text-gray-500 mt-4">
          Preview updates automatically as you fill the form.
        </p>
      </div>
    </div>
  );
}

function CascadingMenu({ categories, parentId = null, path = [], onSelect }) {
  const items = categories.filter((cat) => {
    const pId =
      typeof cat.parentId === "object" ? cat.parentId?._id : cat.parentId;
    return pId === parentId || (!pId && !parentId);
  });
  const [hovered, setHovered] = useState(null);
  return (
    <div className="flex">
      <div className="min-w-[180px] border-r bg-white">
        {items.map((cat) => (
          <div
            key={cat._id}
            className={`px-4 py-2 cursor-pointer hover:bg-accent ${
              hovered && hovered._id === cat._id ? "bg-accent" : ""
            }`}
            onMouseEnter={() => setHovered(cat)}
            onClick={() => {
              const children = categories.filter((c) => {
                const pId =
                  typeof c.parentId === "object" ? c.parentId?._id : c.parentId;
                return pId === cat._id;
              });
              if (children.length === 0) {
                onSelect(cat, [...path, cat]);
              } else {
                setHovered(cat);
              }
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

"use client";

import { useEffect, useState } from "react";
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

export default function AddProductForm() {
  // State for file uploads
  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [variantImages, setVariantImages] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER.replace(
            "/api",
            ""
          )}/api/admin/category`,
          { withCredentials: true }
        );
        setCategories(res.data.data.data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

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

  // Handle main product image upload
  const handleMainImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setMainImage(e.target.files[0]);
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

    // Create FormData object for file uploads
    const formDataObj = new FormData();

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
    console.log("Product data being sent:", productData); // Debug log

    // Add main image file if it exists
    if (mainImage) {
      formDataObj.append("productImage", mainImage);
      console.log("Main image added:", mainImage.name); // Debug log
    }

    // Add gallery images if they exist
    if (galleryImages && galleryImages.length > 0) {
      galleryImages.forEach((image) => {
        formDataObj.append("productImage", image);
      });
    }

    // Add variant images if they exist
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
      Object.entries(variantImages).forEach(([index, image]) => {
        formDataObj.append(`variant_${index}`, image);
      });
    }

    // Log complete FormData contents
    for (let pair of formDataObj.entries()) {
      console.log(pair[0], pair[1]);
    }

    // Use correct API endpoint
    try {
      console.log(
        "API URL:",
        `${process.env.NEXT_PUBLIC_SERVER}/admin/add-product`
      );
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/admin/add-product`,
        formDataObj,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("API Response:", response.data); // Debug log
     
        setSubmitSuccess("Product added successfully!");
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
          });

          // Reset file uploads
          setMainImage(null);
          setGalleryImages([]);
          setVariantImages({});
        }, 2000);
      
        
     
    } catch (error) {
      console.error("Error adding product:", error);
      setSubmitError(
        error.response?.data?.message ||
          "Failed to add product. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Product</h1>

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
          <Select
            value={formData.category}
            onValueChange={(value) => handleSelectChange("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat._id} value={cat._id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label>Brand</Label>
          <Input name="brand" value={formData.brand} onChange={handleChange} />

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
          <Input
            type="number"
            name="weight"
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

          <Label>Height</Label>
          <Input
            type="number"
            name="height"
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

          <Label>Width</Label>
          <Input
            type="number"
            name="width"
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

          <Label>Depth</Label>
          <Input
            type="number"
            name="depth"
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

          <Label>Weight Unit</Label>
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
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kg">Kilogram (kg)</SelectItem>
              <SelectItem value="g">Gram (g)</SelectItem>
              <SelectItem value="lb">Pound (lb)</SelectItem>
            </SelectContent>
          </Select>

          <Label>Dimension Unit</Label>
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
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cm">Centimeter (cm)</SelectItem>
              <SelectItem value="m">Meter (m)</SelectItem>
              <SelectItem value="in">Inch (in)</SelectItem>
            </SelectContent>
          </Select>

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
                                          : updatedVariants[index].attributes ||
                                            {}),
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
                                      .filter((val) => val && val.trim() !== "")
                                      .map((val, valIndex) => (
                                        <SelectItem key={valIndex} value={val}>
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
                    <Label>Variant Image</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center h-40 mt-2">
                      <input
                        type="file"
                        className="hidden"
                        id={`variant_${index}`}
                        onChange={(e) => handleVariantImageChange(e, index)}
                        accept="image/*"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById(`variant_${index}`).click()
                        }
                      >
                        Upload Image
                      </Button>
                      {variantImages[index] && (
                        <p className="mt-2 text-xs text-green-600">
                          {variantImages[index].name} selected
                        </p>
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
          <Label>Product Images</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center h-40">
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
                id="mainImage"
                onChange={handleMainImageChange}
                accept="image/*"
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
              {mainImage && (
                <p className="mt-2 text-xs text-green-600">
                  {mainImage.name} selected
                </p>
              )}
            </div>

            <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center h-40">
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
              <p className="mt-2 text-sm text-gray-500">Add gallery images</p>
              <input
                type="file"
                className="hidden"
                id="galleryImages"
                multiple
                onChange={handleGalleryImagesChange}
                accept="image/*"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => document.getElementById("galleryImages").click()}
              >
                Upload
              </Button>
              {galleryImages.length > 0 && (
                <p className="mt-2 text-xs text-green-600">
                  {galleryImages.length} images selected
                </p>
              )}
            </div>
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
                    setFormData({ ...formData, isNewArrival: e.target.checked })
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
          ) : (
            "Save Product"
          )}
        </Button>
      </div>
    </form>
  );
}

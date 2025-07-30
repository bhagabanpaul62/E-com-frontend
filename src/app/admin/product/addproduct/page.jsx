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
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    brand: "",
    tags: "",
    category: "",
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
          `${process.env.NEXT_PUBLIC_SERVER}/admin/category`,
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting", formData);
    // TODO: Submit logic using axios
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

          <Label>Slug</Label>
          <Input name="slug" value={formData.slug} onChange={handleChange} />

          <Label>Category</Label>
          <Select
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

          <Label>Tags</Label>
          <Input name="tags" value={formData.tags} onChange={handleChange} />
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <Label>Price</Label>
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

          {/* Add other shipping fields similarly */}
        </TabsContent>

        <TabsContent value="return" className="space-y-4">
          <Label>Is Returnable</Label>
          <Select
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
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Label>SEO Title</Label>
          <Input
            name="seoTitle"
            value={formData.seoTitle}
            onChange={handleChange}
          />
          <Label>SEO Description</Label>
          <Textarea
            name="seoDescription"
            value={formData.seoDescription}
            onChange={handleChange}
          />
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <Button type="submit" className="w-full">
          Save Product
        </Button>
      </div>
    </form>
  );
}

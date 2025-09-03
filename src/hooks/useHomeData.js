import { useState, useEffect } from "react";
import axios from "axios";

export const useHomeData = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to sanitize image URLs
  const getSafeImageUrl = (imageUrl) => {
    if (!imageUrl) return null;

    // If it's already an absolute URL, return as is
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }

    // If it's a relative path without leading slash, add it
    if (!imageUrl.startsWith("/")) {
      return `/${imageUrl}`;
    }

    return imageUrl;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [categoryRes, productRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_SERVER}/api/users/category`),
        axios.get(`${process.env.NEXT_PUBLIC_SERVER}/api/users/product`),
      ]);

      setCategories(categoryRes.data.data.data || []);
      setProducts(productRes.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Get products by category
  const getProductsByCategory = (categoryId) => {
    return products.filter((product) => {
      const productCategoryId =
        typeof product.categoryId === "object"
          ? product.categoryId._id || product.categoryId.id
          : product.categoryId;
      return productCategoryId === categoryId;
    });
  };

  // Get products by category name/type
  const getProductsByType = (type) => {
    const typeKeywords = {
      electronics: [
        "electronic",
        "phone",
        "computer",
        "laptop",
        "mobile",
        "gadget",
      ],
      fashion: ["clothing", "fashion", "apparel", "wear", "shirt", "dress"],
      beauty: ["beauty", "cosmetic", "makeup", "skincare"],
      food: ["food", "grocery", "snack", "beverage"],
      toys: ["toy", "game", "play"],
      sports: ["sport", "fitness", "exercise", "gym"],
      healthcare: ["health", "medical", "medicine", "care"],
      home: ["home", "furniture", "decor", "kitchen", "appliance"],
    };

    const keywords = typeKeywords[type.toLowerCase()] || [];

    return products.filter((product) => {
      const productName = product.name?.toLowerCase() || "";
      const categoryName =
        typeof product.categoryId === "object"
          ? product.categoryId.name?.toLowerCase() || ""
          : "";

      return keywords.some(
        (keyword) =>
          productName.includes(keyword) || categoryName.includes(keyword)
      );
    });
  };

  return {
    categories,
    products,
    loading,
    error,
    fetchData,
    getSafeImageUrl,
    getProductsByCategory,
    getProductsByType,
  };
};

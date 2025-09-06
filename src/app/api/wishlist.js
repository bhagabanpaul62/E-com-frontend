// src/app/api/wishlist.js
"use client";

import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_SERVER ||
  "https://tajbee-backend-g2exf9drgrejg0bh.centralindia-01.azurewebsites.net/api";

// Get user's wishlist
export const getUserWishlist = async () => {
  try {
    const response = await axios.get(`${API_URL}/wishlist`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to get wishlist");
  }
};

// Add product to wishlist
export const addToWishlist = async (productId) => {
  try {
    const response = await axios.post(
      `${API_URL}/wishlist/add`,
      { productId },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to add to wishlist"
    );
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (productId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/wishlist/remove/${productId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to remove from wishlist"
    );
  }
};

// Clear wishlist
export const clearWishlist = async () => {
  try {
    const response = await axios.delete(`${API_URL}/wishlist/clear`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to clear wishlist"
    );
  }
};

// Check if product is in wishlist
export const checkWishlistItem = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/wishlist/check/${productId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to check wishlist item"
    );
  }
};

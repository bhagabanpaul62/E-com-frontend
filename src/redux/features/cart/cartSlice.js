"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunks for cart operations
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return { items: [], totalItems: 0, totalPrice: 0 };

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/cart`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching cart"
      );
    }
  }
);

export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async ({ productId, quantity = 1, variantId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Authentication required");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/cart/add`,
        { productId, quantity, variantId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error adding item to cart"
      );
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ productId, quantity, variantId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Authentication required");

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER}/api/cart/update`,
        { productId, quantity, variantId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating cart item"
      );
    }
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async ({ productId, variantId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Authentication required");

      const url = variantId
        ? `${process.env.NEXT_PUBLIC_SERVER}/api/cart/remove/${productId}/${variantId}`
        : `${process.env.NEXT_PUBLIC_SERVER}/api/cart/remove/${productId}`;

      const response = await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error removing item from cart"
      );
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Authentication required");

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER}/api/cart/clear`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error clearing cart"
      );
    }
  }
);

const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  loading: false,
  error: null,
  lastAction: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCartError: (state) => {
      state.error = null;
    },
    resetCart: () => initialState,
  },
  extraReducers: (builder) => {
    // fetchCart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        // Ensure we have valid data structure even if backend returns incomplete data
        state.items =
          action.payload.items?.map((item) => ({
            ...item,
            product: item.product || {
              name: "Product not available",
              price: 0,
              images: [],
            },
          })) || [];
        state.totalItems = action.payload.totalItems || 0;
        state.totalPrice = action.payload.totalPrice || 0;
        state.loading = false;
        state.lastAction = "FETCH";
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching cart";
      });

    // addItemToCart
    builder
      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.items =
          action.payload.items?.map((item) => ({
            ...item,
            product: item.product || {
              name: "Product not available",
              price: 0,
              images: [],
            },
          })) || [];
        state.totalItems = action.payload.totalItems || 0;
        state.totalPrice = action.payload.totalPrice || 0;
        state.loading = false;
        state.lastAction = "ADD";
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // updateCartItem
    builder
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items =
          action.payload.items?.map((item) => ({
            ...item,
            product: item.product || {
              name: "Product not available",
              price: 0,
              images: [],
            },
          })) || [];
        state.totalItems = action.payload.totalItems || 0;
        state.totalPrice = action.payload.totalPrice || 0;
        state.loading = false;
        state.lastAction = "UPDATE";
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // removeCartItem
    builder
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.items =
          action.payload.items?.map((item) => ({
            ...item,
            product: item.product || {
              name: "Product not available",
              price: 0,
              images: [],
            },
          })) || [];
        state.totalItems = action.payload.totalItems || 0;
        state.totalPrice = action.payload.totalPrice || 0;
        state.loading = false;
        state.lastAction = "REMOVE";
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // clearCart
    builder
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.totalItems = 0;
        state.totalPrice = 0;
        state.loading = false;
        state.lastAction = "CLEAR";
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCartError, resetCart } = cartSlice.actions;
export { addItemToCart, updateCartItem, removeCartItem, fetchCart, clearCart };
export default cartSlice.reducer;

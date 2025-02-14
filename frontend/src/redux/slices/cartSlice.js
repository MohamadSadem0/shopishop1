// src/Redux/slices/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// const API_BASE_URL = "http://localhost:8080/customer/cart";
const API_BASE_URL = "http://84.8.108.111:8080/customer/cart";

// Get token from auth state
const getAuthToken = (state) => state.auth?.token || null;

/**
 * 1) Fetch the current user's cart from the backend.
 */
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { getState, rejectWithValue }) => {
    const token = getAuthToken(getState());
    if (!token) {
      // If not logged in, return an empty array or handle it gracefully
      return [];
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Return entire cart array
      console.log(response);
      
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch cart");
    }
  }
);

/**
 * 2) Add a product to cart
 */
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity = 1 }, { getState, rejectWithValue }) => {
    const token = getAuthToken(getState());
    if (!token) {
      return rejectWithValue("User not authenticated");
    }
    try {
      const response = await axios.post(
        `${API_BASE_URL}/add`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // If the server returns the single newly added item, you can either:
      //  (a) Return the entire updated cart from the server, or
      //  (b) Return just that item, then push it in the reducer.
      // Let's assume it returns the single new item:
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add to cart");
    }
  }
);

/**
 * 3) Remove an item from the cart by productId
 */
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId }, { getState, rejectWithValue }) => {
    const token = getAuthToken(getState());
    if (!token) {
      return rejectWithValue("User not authenticated");
    }
    try {
      // This might return no content or an updated cart array.
      await axios.delete(`${API_BASE_URL}/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // If server returns updated cart, handle accordingly.
      // Otherwise, we do a second call to fetchCart to get the new cart.
      return { productId };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to remove item");
    }
  }
);

/**
 * 4) Clear the entire cart
 */
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { getState, rejectWithValue }) => {
    const token = getAuthToken(getState());
    if (!token) {
      return rejectWithValue("User not authenticated");
    }
    try {
      await axios.delete(`${API_BASE_URL}/clear`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return [];
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to clear cart");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],      // array of cart items
    status: "idle", // or "loading" | "succeeded" | "failed"
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // fetchCart
    builder.addCase(fetchCart.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.items = action.payload; // entire cart array
    });
    builder.addCase(fetchCart.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });

    // addToCart
    builder.addCase(addToCart.fulfilled, (state, action) => {
      // If the server returns the *single* new cart item:
      // push it into the array
      state.items.push(action.payload);

      // If your server returns the entire updated cart:
      // state.items = action.payload;
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      state.error = action.payload;
    });

    // removeFromCart
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      // If the server returns just a productId:
      const { productId } = action.payload;
      state.items = state.items.filter((item) => item.productId !== productId);

      // If your server returns the entire updated cart, do:
      // state.items = action.payload;
    });
    builder.addCase(removeFromCart.rejected, (state, action) => {
      state.error = action.payload;
    });

    // clearCart
    builder.addCase(clearCart.fulfilled, (state, action) => {
      // If server returns []
      state.items = action.payload;
    });
    builder.addCase(clearCart.rejected, (state, action) => {
      state.error = action.payload;
    });
  },
});

export default cartSlice.reducer;

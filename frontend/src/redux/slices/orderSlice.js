import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../url";

const API_BASE_URL = `${baseURL}/customer/orders`;

// Helper: Get token from auth state
const getAuthToken = (state) => state.auth?.token || null;

/**
 * Fetch the current customer's orders from the backend.
 */
export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (_, { getState, rejectWithValue }) => {
    const token = getAuthToken(getState());
    if (!token) {
      return rejectWithValue("User not authenticated");
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Normalize the response:
      // - If the response data is an array, return it.
      // - If it is an object with an "orders" array, return that.
      // - Otherwise, return an empty array.
      const data = response.data;
      if (Array.isArray(data)) {
        return data;
      } else if (data && Array.isArray(data.orders)) {
        return data.orders;
      } else {
        return [];
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch orders"
      );
    }
  }
);

export const fetchOrderDetails = createAsyncThunk(
  "order/fetchOrderDetails", 
  async (orderId, { getState, rejectWithValue }) => {
    const token = getAuthToken(getState());
    if (!token) {
      return rejectWithValue("User not authenticated");
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch order details"
      );
    }
  }
);


export const fetchStoreOrders = createAsyncThunk(
  "storeOrders/fetchStoreOrders",
  async (_, { getState, rejectWithValue }) => {
    const token = getAuthToken(getState());
    if (!token) {
      return rejectWithValue("User not authenticated");
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/store`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // Expecting an array of StoreOrderResponse objects
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch store orders"
      );
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    status: "idle", // "loading" | "succeeded" | "failed"
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchOrderDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.order = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchStoreOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStoreOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload;
      })
      .addCase(fetchStoreOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
})

export default orderSlice.reducer;

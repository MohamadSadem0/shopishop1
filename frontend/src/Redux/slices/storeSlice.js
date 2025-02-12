import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base API URL
const API_URL = "http://localhost:8080/customer/store/create";

// Fetch user token from localStorage

// Initial state
const initialState = {
  store: null,
  loading: false,
  error: null,
};

// Async thunk for creating a store
export const createStore = createAsyncThunk(
  "store/createStore",
  async (storeData , { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, storeData, {
        headers: { Authorization: `Bearer ${storeData.token}` },
      });

      return response.data.store; // The store object returned from API
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Store creation failed");
    }
  }
);

// Store slice
const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    resetStore: (state) => {
      state.store = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createStore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStore.fulfilled, (state, action) => {
        state.loading = false;
        state.store = action.payload;
      })
      .addCase(createStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { resetStore } = storeSlice.actions;
export default storeSlice.reducer;

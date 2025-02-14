import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { persistStore } from "redux-persist";

// Base API URL
// const API_URL = "http://localhost:8080/public/auth";
const API_URL = "http://shopishop_backend:8080";

// Initial State
const initialState = {
  user: null,   // 🧑 Store user info (username, email, phoneNbr)
  token: null,  // 🔑 JWT token
  role: null,   // 🎭 User role (admin, merchant, customer)
  store: null,  // 🏪 Store details (only for MERCHANTS)
  loading: false,
  error: null,
};

// **Async thunk for user registration**
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data; // Response contains token and user info
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

// **Async thunk for user login**
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, userData);

      return {
        token: response.data.token,
        user: {
          username: response.data.username,
          email: response.data.email,
          phoneNbr: response.data.phoneNbr || "N/A",
          photoUrl: response.data.photoUrl || "",
        },
        role: response.data.role,
        store: response.data.role === "MERCHANT" ? response.data.storeDetails : null, // 🏪 Store details only for merchants
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.store = null; // 🏪 Clear store details on logout
      persistStore(null).purge(); // Clears persisted Redux state
    },
  },
  extraReducers: (builder) => {
    builder
      // **Register User**
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.store = action.payload.role === "MERCHANT" ? action.payload.storeDetails : null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // **Login User**
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.store = action.payload.store; // 🏪 Store details for MERCHANT role
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

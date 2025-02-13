import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchAllCategoriesAPI,
  fetchCategoriesBySectionNameAPI,
  fetchCategoriesByStoreIdAPI,
} from "../../services/fetchingService";
import { createCategoryAPI } from "../../services/createProductAPI";
import { deleteCategoryAPI } from "../../services/deleteService";
import { updateCategoryAPI } from "../../services/updateService";

// ✅ Fetch all categories
export const fetchAllCategories = createAsyncThunk(
  "category/fetchAllCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchAllCategoriesAPI();
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch categories.");
    }
  }
);

// ✅ Fetch categories by Store ID
export const fetchCategoriesByStoreId = createAsyncThunk(
  "category/fetchCategoriesByStoreId",
  async (storeId, { rejectWithValue }) => {
    try {
      const response = await fetchCategoriesByStoreIdAPI(storeId);
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch categories by store ID.");
    }
  }
);

// ✅ Fetch categories by Section Name
export const fetchCategoriesBySection = createAsyncThunk(
  "category/fetchCategoriesBySection",
  async (sectionName, { rejectWithValue }) => {
    try {
      const response = await fetchCategoriesBySectionNameAPI(sectionName);
      if (!response.data || response.data.length === 0) {
        return rejectWithValue("No categories found for this section.");
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch categories by section.");
    }
  }
);

// ✅ Create new category
export const createNewCategory = createAsyncThunk(
  "category/createNewCategory",
  async (categoryData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("Authentication token is missing. Please log in.");

      const response = await createCategoryAPI(categoryData, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create category.");
    }
  }
);

// ✅ Delete a category
export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (categoryId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("Authentication token is missing.");

      await deleteCategoryAPI(categoryId, token);
      return categoryId; // Return ID to remove from Redux state
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete category.");
    }
  }
);

// ✅ Update a category
export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ categoryId, updatedData }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("Authentication token is missing.");

      const response = await updateCategoryAPI(categoryId, updatedData, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update category.");
    }
  }
);

// ✅ Redux Slice
const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    resetCategories: (state) => {
      state.categories = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all categories
      .addCase(fetchAllCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch categories by section
      .addCase(fetchCategoriesBySection.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategoriesBySection.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload;
      })
      .addCase(fetchCategoriesBySection.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Error fetching categories.";
        state.categories = []; // Reset categories if failed
      })

      // Create new category
      .addCase(createNewCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createNewCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories.push(action.payload);
      })
      .addCase(createNewCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Delete category
      .addCase(deleteCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = state.categories.filter(
          (category) => category.id !== action.payload
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update category
      .addCase(updateCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.categories.findIndex(
          (category) => category.id === action.payload.id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetCategories } = categorySlice.actions;
export default categorySlice.reducer;

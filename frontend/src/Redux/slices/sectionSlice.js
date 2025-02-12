import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createSectionAPI } from "../../services/createProductAPI";
import { fetchAllSectionsAPI, fetchSectionsWithCategoriesAPI } from "../../services/fetchingService";

// ✅ Async thunk to create a new section
export const createSection = createAsyncThunk(
  "sections/createSection",
  async (sectionData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth; // Get token from Redux store
      const response = await createSectionAPI(sectionData, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create section");
    }
  }
);

// ✅ Async thunk to fetch all sections
export const fetchAllSections = createAsyncThunk(
  "sections/fetchAllSections",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchAllSectionsAPI();
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch sections");
    }
  }
);

// ✅ Async thunk to fetch sections with categories
export const fetchSectionsWithCategories = createAsyncThunk(
  "sections/fetchSectionsWithCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchSectionsWithCategoriesAPI();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch sections with categories");
    }
  }
);

const sectionSlice = createSlice({
  name: "sections",
  initialState: {
    sections: [],
    sectionsWithCategories: [],
    status: "idle",
    error: null,
  },
  reducers: {
    deleteSection: (state, action) => {
      state.sections = state.sections.filter((section) => section.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Fetch All Sections
      .addCase(fetchAllSections.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllSections.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sections = action.payload;
      })
      .addCase(fetchAllSections.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ✅ Fetch Sections with Categories
      .addCase(fetchSectionsWithCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSectionsWithCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sectionsWithCategories = action.payload;
      })
      .addCase(fetchSectionsWithCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ✅ Create Section
      .addCase(createSection.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createSection.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sections.push(action.payload);
      })
      .addCase(createSection.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { deleteSection } = sectionSlice.actions;
export default sectionSlice.reducer;

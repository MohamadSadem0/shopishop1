import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteProductAPI } from "../../services/deleteService";
import { createProductAPI } from "../../services/createProductAPI";
import { fetchAllProductsAPI, fetchProductsByStoreIdAPI, fetchPaginatedProductsAPI,fetchProductByIdAPI } from "../../services/fetchingService";
import axiosInstance from "../../utils/axiosInstance";


export const applyDiscount = createAsyncThunk(
  "products/applyDiscount",
  async ({ productId, discountData }, { getState, rejectWithValue }) => {
    try {
      // If you have an auth token in Redux
      const { token } = getState().auth || {};
      if (!token) throw new Error("Authentication token is missing.");

      // Example call: POST /merchant/product/apply-discount/{productId}
      // with discountData in the body
      const response = await axiosInstance.post(
        `/merchant/product/apply-discount/${productId}`,
        discountData,
        {
          headers: {
            // If axiosInstance doesn't already attach your token, do it here:
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // The backend returns { success, message, data: ProductResponse }
      return response.data.data; // The updated product
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to apply discount."
      );
    }
  }
);
export const fetchBestSellingProducts = createAsyncThunk(
  "products/fetchBestSellingProducts",
  async ({ page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/public/product/best-selling", {
        params: { page, size },
      });
      // The API returns: { success, message, data: Page<ProductResponse> }
      // So response.data.data is the Page object
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch best selling products."
      );
    }
  }
);
// ------------------------------
// 1) Best Deals Thunk
// ------------------------------
export const fetchBestDeals = createAsyncThunk(
  "products/fetchBestDeals",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/public/product/best-deals");
      // The data may be wrapped in { success, message, data } => adapt as needed
      return response.data.data; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch best deals."
      );
    }
  }
);

// ------------------------------
// 2) Featured Products Thunk
// ------------------------------
export const fetchFeaturedProducts = createAsyncThunk(
  "products/fetchFeaturedProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/public/product/featured");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch featured products."
      );
    }
  }
);
// ✅ Fetch all products (For public view)
export const fetchAllProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchAllProductsAPI();
      
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch products.");
    }
  }
);
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetchProductByIdAPI(id); // Call API
      
      return response.data; // Return product data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch product.");
    }
  }
);

export const fetchPaginatedProducts = createAsyncThunk(
  "products/fetchPaginatedProducts",
  async ({ page, category }, { rejectWithValue }) => {
    try {
      const response = await fetchPaginatedProductsAPI(page, 10, category);

      return {
        products: response.content || [],  // ✅ Extract `content`
        hasMore: !response.last, // ✅ Check if there are more pages
        page: response.number + 1, // ✅ Update the page number
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch products.");
    }
  }
);

// ✅ Fetch products by Store ID (For merchants)
export const fetchProductsByStoreId = createAsyncThunk(
  "products/fetchProductsByStoreId",
  async (storeId, { rejectWithValue }) => {
    try {
      if (!storeId) throw new Error("Store ID is missing.");
      const response = await fetchProductsByStoreIdAPI(storeId);
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch products for this store.");
    }
  }
);

// ✅ Create a product
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("Authentication token is missing.");

      const response = await createProductAPI(productData, token); 
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create product.");
    }
  }
);

// ✅ Delete a product
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("Authentication token is missing.");

      await deleteProductAPI(productId, token);
      return productId; // Remove from Redux state
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete product.");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    bestSelling: [],
    bestDeals: [],
    featuredProducts: [],
    selectedProduct: null,
    status: "idle",
    error: null,

    // For pagination
    page: 1,
    hasMore: true,
    bestSellingPage: 0,
    bestSellingHasMore: true,
  },
  reducers: {
    resetProducts: (state) => {
      state.products = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
        // ✅ Fetch single product by ID
        .addCase(applyDiscount.pending, (state) => {
          state.status = "loading";
        })
        .addCase(applyDiscount.fulfilled, (state, action) => {
          state.status = "succeeded";
          const updatedProduct = action.payload;
  
          // Option A: Update the product in state.products array
          const index = state.products.findIndex((p) => p.id === updatedProduct.id);
          if (index !== -1) {
            state.products[index] = updatedProduct;
          }
  
          // Option B: If selectedProduct is the same product, update it too
          if (state.selectedProduct && state.selectedProduct.id === updatedProduct.id) {
            state.selectedProduct = updatedProduct;
          }
        })
        .addCase(applyDiscount.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        })
  .addCase(fetchProductById.pending, (state) => {
    state.status = "loading";
  })
  .addCase(fetchProductById.fulfilled, (state, action) => {
    state.status = "succeeded";
    state.selectedProduct = action.payload;
  })
  .addCase(fetchProductById.rejected, (state, action) => {
    state.status = "failed";
    state.error = action.payload;
  })

      // ✅ Fetch paginated products
      .addCase(fetchPaginatedProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPaginatedProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = [...state.products, ...action.payload.products]; // ✅ Append new products
        state.hasMore = action.payload.hasMore; // ✅ Check if more products exist
        state.page += 1;
      })
      .addCase(fetchPaginatedProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ✅ Fetch all products
      .addCase(fetchAllProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ✅ Fetch products by Store ID
      .addCase(fetchProductsByStoreId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsByStoreId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProductsByStoreId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ✅ Create product
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })

      // ✅ Delete product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
      })
      
      .addCase(fetchBestDeals.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBestDeals.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bestDeals = action.payload;  // Save best deals to Redux state
      })
      .addCase(fetchBestDeals.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ---------------------------------
      // Handle Featured Products
      // ---------------------------------
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.featuredProducts = action.payload; // Save featured products
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      
      .addCase(fetchBestSellingProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBestSellingProducts.fulfilled, (state, action) => {
        state.status = "succeeded";

        // action.payload is a Page<ProductResponse>
        const pageData = action.payload; // { content, number, totalElements, last, etc. }

        // We'll append to bestSelling if you want an infinite scroll approach,
        // or just store the results if you only want one page at a time:

        // Example: store *only* the current page's content
        state.bestSelling = pageData.content;

        // Track if there is a next page
        state.bestSellingHasMore = !pageData.last;

        // current page returned by the server
        // number is zero-based, so if you want a 1-based reference:
        state.bestSellingPage = pageData.number;
      })
      .addCase(fetchBestSellingProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
  },
});

export const { resetProducts } = productSlice.actions;
export default productSlice.reducer;

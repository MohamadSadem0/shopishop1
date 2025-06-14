import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteProductAPI } from "../../services/deleteService";
import { createProductAPI } from "../../services/createProductAPI";
import { fetchAllProductsAPI, fetchProductsByStoreIdAPI, fetchPaginatedProductsAPI,fetchProductByIdAPI } from "../../services/fetchingService";
import axiosInstance from "../../utils/axiosInstance";



export const fetchBestSellingProducts = createAsyncThunk(
  "products/fetchBestSellingProducts",
  async ({ page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/public/products/best-selling", {
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

export const fetchStoreProducts = createAsyncThunk(
  "products/fetchStoreProducts",
  async ({ storeId, page = 0, size = 10, cursorId, cursorDate }, { rejectWithValue }) => {
    try {
      const params = { page, size };
      if (cursorId && cursorDate) {
        params.cursorId = cursorId;
        params.cursorDate = cursorDate;
      }


      const response = await axiosInstance.get(`/public/products/store/${storeId}`, {
        params
      });
      
      return {
        products: response.data.content || [],
        hasMore: !response.data.last,
        page: response.data.number,
        cursorId: response.data.content.length > 0 
          ? response.data.content[response.data.content.length - 1].id 
          : null,
        cursorDate: response.data.content.length > 0
          ? response.data.content[response.data.content.length - 1].createdAt
          : null
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch store products."
      );
    }
  }
);

export const removeDiscount = createAsyncThunk(
  "products/removeDiscount",
  async (productId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth || {};
      if (!token) throw new Error("Authentication token is missing.");
      
      const response = await axiosInstance.delete(
        `/merchant/products/remove-discount/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove discount."
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
      const response = await axiosInstance.get("/public/products/best-deals");
      // Check if response.data has 'data' or directly array
      return response.data.data || response.data || [];
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
      const response = await axiosInstance.get("/public/products/featured");
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


export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ productId, productData }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("Authentication token is missing.");
      // Corrected endpoint URL without '/update'
      const response = await axiosInstance.put(
        `/merchant/products/${productId}`, 
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data; // updated product
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update product.");
    }
  }
);
;

export const fetchPaginatedProducts = createAsyncThunk(
  "products/fetchPaginatedProducts",
  async ({ page, category }, { rejectWithValue }) => {
    try {
      const response = await fetchPaginatedProductsAPI(page, 10, category);
      console.log("API response:", response);
      
      return {
        products: response || [],
        hasMore: !response.last,
        page: response.number,  // zero-based page number from API
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch products.");
    }
  }
);


// // ✅ Fetch products by Store ID (For merchants)
// export const fetchProductsByStoreId = createAsyncThunk(
//   "products/fetchProductsByStoreId",
//   async (storeId, { rejectWithValue }) => {
//     try {
//       if (!storeId) throw new Error("Store ID is missing.");
//       const response = await fetchProductsByStoreIdAPI(storeId);
//       console.log(response);
      
//       return response.data.content || [];
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch products for this store.");
//     }
//   }
// );
export const fetchProductsByStoreId = createAsyncThunk(
  "products/fetchProductsByStoreId",
  async ({ storeId, page = 0, size = 10, cursorId, cursorDate }, { rejectWithValue }) => {
    try {
      if (!storeId) throw new Error("Store ID is missing.");
      
      const params = { page, size };
      if (cursorId && cursorDate) {
        params.cursorId = cursorId;
        params.cursorDate = cursorDate;
      }

      const response = await axiosInstance.get(`/public/products/store/${storeId}`, {
        params
      });
      
      // Log full response to help debug
      
      // Get products array safely (with fallbacks)
      const products = response.data?.data?.content || [];
      
      // Get last item safely for cursor
      const lastProduct = products.length > 0 ? products[products.length - 1] : null;
      
      return {
        products: products,
        hasMore: response.data?.data?.last === false, // Ensure correct boolean
        page: response.data?.data?.number || 0,
        cursorId: lastProduct?.id || null,
        cursorDate: lastProduct?.createdAt || null
      };

    } catch (error) {
      console.error("API error:", error);
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


export const applyDiscount = createAsyncThunk(
  "products/applyDiscount",
  async ({ productId, discountData }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth || {};
      if (!token) throw new Error("Authentication token is missing.");
      // Corrected endpoint URL to match backend mapping
      const response = await axiosInstance.post(
        `/merchant/products/${productId}/discounts`,
        discountData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to apply discount.");
    }
  }
);


// ... other thunks such as fetchBestSellingProducts, fetchBestDeals, etc.

export const updateProductQuantity = createAsyncThunk(
  "products/updateProductQuantity",
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("Authentication token is missing.");
      // Corrected endpoint URL to match backend mapping
      const response = await axiosInstance.put(
        `/merchant/products/${productId}/quantity`,
        { quantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data; // updated product with new quantity
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update product quantity.");
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
    page: 0,
    hasMore: true,
    bestSellingPage: 0,
    bestSellingHasMore: true,



  storeProducts: [], 

  storeProductsPage: 0,
  storeProductsHasMore: true,
  storeProductsCursorId: null,
  storeProductsCursorDate: null,
 
  },
  reducers: {

    resetStoreProducts: (state) => {
      state.storeProducts = [];
      state.storeProductsPage = 0;
      state.storeProductsHasMore = true;
      state.storeProductsCursorId = null;
      state.storeProductsCursorDate = null;
    },
    resetProducts: (state) => {
      state.products = [];
      state.page = 0;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchProductsByStoreId.pending, (state) => {
      state.status = "loading";
    })
    .addCase(fetchProductsByStoreId.fulfilled, (state, action) => {
      state.status = "succeeded";
      
      // If it's the first page, replace the products
      if (action.payload.page === 0) {
        state.storeProducts = action.payload.products; // Update storeProducts, not products
      } else {
        // Otherwise append to existing products
        state.storeProducts = [...state.storeProducts, ...action.payload.products]; // Update storeProducts
      }
      
      state.storeProductsHasMore = action.payload.hasMore; // Use storeProductsHasMore
      state.storeProductsPage = action.payload.page + 1;  // Use storeProductsPage
      state.storeProductsCursorId = action.payload.cursorId;
      state.storeProductsCursorDate = action.payload.cursorDate;
    })
    .addCase(fetchProductsByStoreId.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    })
    .addCase(fetchStoreProducts.pending, (state) => {
      state.status = "loading";
    })
    .addCase(fetchStoreProducts.fulfilled, (state, action) => {
      state.status = "succeeded";
      
      // If it's the first page, replace the products
      if (action.payload.page === 0) {
        state.storeProducts = action.payload.products;
      } else {
        // Otherwise append to existing products
        state.storeProducts = [...state.storeProducts, ...action.payload.products];
      }
      
      state.storeProductsHasMore = action.payload.hasMore;
      state.storeProductsPage = action.payload.page + 1;
      state.storeProductsCursorId = action.payload.cursorId;
      state.storeProductsCursorDate = action.payload.cursorDate;
    })
    .addCase(fetchStoreProducts.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    })
    .addCase(updateProduct.pending, (state) => {
      state.status = "loading";
    })
    .addCase(updateProduct.fulfilled, (state, action) => {
      state.status = "succeeded";
      const updatedProduct = action.payload;
      const index = state.products.findIndex((p) => p.id === updatedProduct.id);
      if (index !== -1) {
        state.products[index] = updatedProduct;
      }
      if (state.selectedProduct && state.selectedProduct.id === updatedProduct.id) {
        state.selectedProduct = updatedProduct;
      }
    })
    .addCase(updateProduct.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    })
    // New extraReducers for updateProductQuantity
    .addCase(updateProductQuantity.pending, (state) => {
      state.status = "loading";
    })
    .addCase(updateProductQuantity.fulfilled, (state, action) => {
      state.status = "succeeded";
      const updatedProduct = action.payload;
      const index = state.products.findIndex((p) => p.id === updatedProduct.id);
      if (index !== -1) {
        state.products[index] = updatedProduct;
      }
      if (state.selectedProduct && state.selectedProduct.id === updatedProduct.id) {
        state.selectedProduct = updatedProduct;
      }
    })
    .addCase(updateProductQuantity.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    })
    .addCase(removeDiscount.pending, (state) => {
      state.status = "loading";
    })
    .addCase(removeDiscount.fulfilled, (state, action) => {
      state.status = "succeeded";
      const updatedProduct = action.payload;
      const index = state.products.findIndex((p) => p.id === updatedProduct.id);
      if (index !== -1) {
        state.products[index] = updatedProduct;
      }
      if (state.selectedProduct && state.selectedProduct.id === updatedProduct.id) {
        state.selectedProduct = updatedProduct;
      }
    })
    .addCase(removeDiscount.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    })
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

  // Create a Map to keep unique products by id
  const productsMap = new Map();

  // First add existing products
  state.products.forEach(p => {
    productsMap.set(p.id, p);
  });

  // Then add new products, overwrite if duplicate
  action.payload.products.forEach(p => {
    productsMap.set(p.id, p);
  });

  // Set unique products back to state
  state.products = Array.from(productsMap.values());

  state.hasMore = action.payload.hasMore;
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

export const { resetProducts ,resetStoreProducts } = productSlice.actions;
export default productSlice.reducer;

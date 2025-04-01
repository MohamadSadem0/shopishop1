import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

export const applyDiscount = createAsyncThunk(
  'discount/apply',
  async ({ productId, discountData }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth || {};
      
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await axiosInstance.post(
        `/merchant/products/${productId}/discounts`, // Ensure this matches your backend route
        discountData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Discount application error:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Unknown error');
    }
  }
);

export const removeDiscount = createAsyncThunk(
  'discount/remove',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/products/${productId}/discounts`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getActiveDiscounts = createAsyncThunk(
  'discount/getActive',
  async (storeId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/products/discounts/active?storeId=${storeId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const applyBulkDiscount = createAsyncThunk(
  'discount/applyBulk',
  async ({ productIds, discountData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        '/products/discounts/bulk',
        { productIds, discountData }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const discountSlice = createSlice({
  name: 'discount',
  initialState: {
    items: [],
    loading: false,
    error: null,
    operationStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    currentDiscount: null
  },
  reducers: {
    resetDiscountStatus: (state) => {
      state.operationStatus = 'idle';
      state.error = null;
    },
    setCurrentDiscount: (state, action) => {
      state.currentDiscount = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Apply Discount
      .addCase(applyDiscount.pending, (state) => {
        state.loading = true;
        state.operationStatus = 'loading';
      })
      .addCase(applyDiscount.fulfilled, (state, action) => {
        state.loading = false;
        state.operationStatus = 'succeeded';
        // Update the specific product in items if needed
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(applyDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.operationStatus = 'failed';
      })
      
      // Remove Discount
      .addCase(removeDiscount.pending, (state) => {
        state.loading = true;
        state.operationStatus = 'loading';
      })
      .addCase(removeDiscount.fulfilled, (state, action) => {
        state.loading = false;
        state.operationStatus = 'succeeded';
        // Update the specific product in items
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(removeDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.operationStatus = 'failed';
      })
      
      // Get Active Discounts
      .addCase(getActiveDiscounts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getActiveDiscounts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getActiveDiscounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Apply Bulk Discount
      .addCase(applyBulkDiscount.pending, (state) => {
        state.loading = true;
        state.operationStatus = 'loading';
      })
      .addCase(applyBulkDiscount.fulfilled, (state, action) => {
        state.loading = false;
        state.operationStatus = 'succeeded';
        // Update all affected products
        action.payload.forEach(updatedProduct => {
          const index = state.items.findIndex(item => item.id === updatedProduct.id);
          if (index !== -1) {
            state.items[index] = updatedProduct;
          }
        });
      })
      .addCase(applyBulkDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.operationStatus = 'failed';
      });
  }
});

// Export actions and reducer
export const { resetDiscountStatus, setCurrentDiscount } = discountSlice.actions;
export default discountSlice.reducer;
// utils/reduxHelpers.js
export const getErrorMessage = (error, defaultMessage) => {
    return error.response?.data?.message || error.message || defaultMessage;
  };
  
  export const updateProductInState = (state, updatedProduct) => {
    const index = state.products.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) state.products[index] = updatedProduct;
    if (state.selectedProduct?.id === updatedProduct.id) {
      state.selectedProduct = updatedProduct;
    }
  };
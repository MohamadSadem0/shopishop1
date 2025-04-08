// services/api/productApi.js
import axiosInstance, { getAuthConfig } from './axiosConfig';

// Constants
const DEFAULT_PAGE_SIZE = 10;

// Helper for error message extraction
export const getErrorMessage = (error, fallbackMsg = 'Something went wrong') => {
  return error.response?.data?.message || error.message || fallbackMsg;
};

// Public endpoints
export const fetchAllProducts = () => {
  return axiosInstance.get('/public/product/all');
};

export const fetchProductById = (id) => {
  return axiosInstance.get(`/public/product/${id}`);
};

export const fetchPaginatedProducts = (page = 0, size = DEFAULT_PAGE_SIZE, category = null) => {
  const params = { page, size };
  if (category) params.category = category;
  return axiosInstance.get('/public/product/paginated', { params });
};

export const fetchBestSellingProducts = (page = 0, size = DEFAULT_PAGE_SIZE) => {
  return axiosInstance.get('/public/product/best-selling', { params: { page, size } });
};

export const fetchBestDeals = () => {
  return axiosInstance.get('/public/product/best-deals');
};

export const fetchFeaturedProducts = () => {
  return axiosInstance.get('/public/product/featured');
};

export const fetchProductsByStoreId = (storeId) => {
  if (!storeId) throw new Error("Store ID is missing.");
  return axiosInstance.get(`/public/product/store/${storeId}`);
};

// Protected endpoints (require authentication)
export const createProduct = (productData, token) => {
  return axiosInstance.post('/merchant/product/create', productData, getAuthConfig(token));
};

export const updateProduct = (productId, productData, token) => {
  return axiosInstance.put(`/merchant/product/update/${productId}`, productData, getAuthConfig(token));
};

export const deleteProduct = (productId, token) => {
  return axiosInstance.delete(`/merchant/product/delete/${productId}`, getAuthConfig(token));
};

export const applyDiscount = (productId, discountData, token) => {
  return axiosInstance.post(
    `/merchant/product/apply-discount/${productId}`,
    discountData,
    getAuthConfig(token)
  );
};

export const removeDiscount = (productId, token) => {
  return axiosInstance.delete(
    `/merchant/product/remove-discount/${productId}`,
    getAuthConfig(token)
  );
};

export const updateProductQuantity = (productId, quantity, token) => {
  return axiosInstance.put(
    `/merchant/product/update-quantity/${productId}`,
    { quantity },
    getAuthConfig(token)
  );
};
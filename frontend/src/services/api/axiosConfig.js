// services/api/axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const getAuthConfig = (token) => {
  if (!token) throw new Error("Authentication token is missing.");
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

// Global error handling
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // Log errors or handle them globally
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
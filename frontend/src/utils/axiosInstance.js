import axios from 'axios';

const baseURL = "http://localhost:8080"; // Default to local API if env variable is missing

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: { 
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;

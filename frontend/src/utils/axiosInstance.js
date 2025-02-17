import axios from 'axios';
import baseURL from '../../url';


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

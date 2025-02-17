// src/services/axiosInstance.js
// src/services/axiosInstance.js
import axios from "axios";
import store from "../redux/Store";  // <-- import your Redux store
import baseURL from "../../url";

const instance = axios.create({
  baseURL: baseURL, // or your actual base URL
});

instance.interceptors.request.use(
    (config) => {
      // Check Redux store for the latest token
      const token = store.getState().auth?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      // Handle error
      return Promise.reject(error);
    }
  );
  
  export default instance;
  
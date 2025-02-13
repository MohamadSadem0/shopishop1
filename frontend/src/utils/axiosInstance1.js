// src/services/axiosInstance.js
// src/services/axiosInstance.js
import axios from "axios";
import store from "../redux/store";  // <-- import your Redux store

const instance = axios.create({
  baseURL: "http://localhost:8080", // or your actual base URL
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
  
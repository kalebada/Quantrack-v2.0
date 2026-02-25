// api/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",  // Must match EXACTLY
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,  // CRITICAL for cookies
});

// Add a small delay to help Safari
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`🚀 Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
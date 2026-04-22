import { API_BASE } from "@/constants";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // send session cookie automatically
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Response interceptor — unwrap errors ──────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ??
      error.message ??
      "An unexpected error occurred.";

    return Promise.reject(new Error(message));
  },
);

export default axiosInstance;

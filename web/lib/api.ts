import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1",
});

api.interceptors.request.use((config) => {
  // Hanya ambil cookie jika di client-side
  if (typeof window !== "undefined") {
    const token = Cookies.get("lapisbaja_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      Cookies.remove("lapisbaja_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

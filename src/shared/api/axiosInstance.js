import axios from "axios";

export const $api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // http://localhost:8000
  headers: {
    "Content-Type": "application/json",
  },
});

$api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token1");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

$api.interceptors.response.use(
  (response) => response,
  async (error) => {
    return Promise.reject(error);
  },
);

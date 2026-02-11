import axios from "axios";

export const $api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Включил поддержку кук для refresh token
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};
$api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token1");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// Интерцептор на логаут/рефреш сессии ( Как я понял, это нужно для обработки 401 ошибки, если она будет.)
$api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Проверяем 401 ошибку.
    // Флаг _retry нужен, чтобы предотвратить бесконечный цикл:
    // если запрос уже один раз упал с 401 и мы попробовали обновить токен,
    // но он снова упал - значит, обновление не помогло, и нужно прервать процесс.
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url.includes("/refresh")) {
        localStorage.removeItem("token1");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return $api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await $api.post("/auth/refresh");

        const newToken = data.access_token || data.token;

        localStorage.setItem("token1", newToken);

        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return $api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("token1");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "store/auth/authSlice";
import { authApi } from "services/auth/authApi"; // Импортируем API

export const store = configureStore({
  reducer: {
    auth: authReducer, // Наш старый слайс (хранит токен и isAuth)
    [authApi.reducerPath]: authApi.reducer, // Новый RTK Query редьюсер
  },
  // Добавляем middleware для кэширования и инвалидации
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

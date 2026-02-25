import { configureStore } from "@reduxjs/toolkit";
import authReducer from "store/auth/authSlice";
import { authApi } from "services/auth/authApi"; // Импортируем API
import { bankApi } from "services/auth/bankApi";
export const store = configureStore({
  reducer: {
    auth: authReducer, // Наш старый слайс (хранит токен и isAuth)
    [authApi.reducerPath]: authApi.reducer,
    [bankApi.reducerPath]: bankApi.reducer, // Новый RTK Query редьюсер
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(bankApi.middleware),
});

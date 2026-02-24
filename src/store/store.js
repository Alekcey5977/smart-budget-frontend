import { configureStore } from "@reduxjs/toolkit";
import authReducer from "store/auth/authSlice";
import { authApi } from "services/auth/authApi";
import { goalsApi } from "services/goals/goalsApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [goalsApi.reducerPath]: goalsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, goalsApi.middleware),
});

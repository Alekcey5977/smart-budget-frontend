import { configureStore } from "@reduxjs/toolkit";
import authReducer from "store/auth/authSlice";
import { authApi } from "services/auth/authApi";
import { bankApi } from "services/auth/bankApi";
import { goalsApi } from "services/goals/goalsApi";
import { notificationApi } from "services/auth/notificationApi";
import { historyApi } from "services/auth/historyApi";
import { avatarApi } from "services/auth/avatarApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [bankApi.reducerPath]: bankApi.reducer,
    [goalsApi.reducerPath]: goalsApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [historyApi.reducerPath]: historyApi.reducer,
    [avatarApi.reducerPath]: avatarApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(bankApi.middleware)
      .concat(goalsApi.middleware)
      .concat(notificationApi.middleware)
      .concat(historyApi.middleware)
      .concat(avatarApi.middleware),
});

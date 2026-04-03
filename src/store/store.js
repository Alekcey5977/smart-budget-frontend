import { configureStore } from "@reduxjs/toolkit";
import authReducer from "store/auth/authSlice";
import { authApi } from "services/auth/authApi";
import { avatarApi } from "services/auth/avatarApi";
import { bankApi } from "services/auth/bankApi";
import { historyApi } from "services/auth/historyApi";
import { notificationApi } from "services/auth/notificationApi";
import { goalsApi } from "services/goals/goalsApi";
import { imagesApi } from "services/images/imagesApi";
import { transactionsApi } from "services/transactions/transactionsApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [avatarApi.reducerPath]: avatarApi.reducer,
    [bankApi.reducerPath]: bankApi.reducer,
    [historyApi.reducerPath]: historyApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [goalsApi.reducerPath]: goalsApi.reducer,
    [imagesApi.reducerPath]: imagesApi.reducer,
    [transactionsApi.reducerPath]: transactionsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(avatarApi.middleware)
      .concat(bankApi.middleware)
      .concat(historyApi.middleware)
      .concat(notificationApi.middleware)
      .concat(goalsApi.middleware)
      .concat(imagesApi.middleware)
      .concat(transactionsApi.middleware),
});
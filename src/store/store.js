import { configureStore } from "@reduxjs/toolkit";
import authReducer from "store/auth/authSlice";
import { authApi } from "services/auth/authApi";
import { bankApi } from "services/auth/bankApi";
import { goalsApi } from "services/goals/goalsApi";
import { transactionsApi } from "services/transactions/transactionsApi";
import { avatarApi } from "services/auth/avatarApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [bankApi.reducerPath]: bankApi.reducer,
    [goalsApi.reducerPath]: goalsApi.reducer,
    [transactionsApi.reducerPath]: transactionsApi.reducer,
    [avatarApi.reducerPath]: avatarApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(bankApi.middleware)
      .concat(goalsApi.middleware)
      .concat(transactionsApi.middleware)
      .concat(avatarApi.middleware),
});

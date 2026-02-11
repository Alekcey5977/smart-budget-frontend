import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "src/services/auth/authApi";

const STORAGE_KEY = "token1";

const getInitialState = () => {
  const token = localStorage.getItem(STORAGE_KEY);
  return {
    isAuth: Boolean(token),
    token: token ?? null,
    user: null, // Убрал thunk`и и status/error, они управляются RTK Query
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    logout(state) {
      localStorage.removeItem(STORAGE_KEY);
      state.isAuth = false;
      state.token = null;
      state.user = null;
    },
    setCredentials(state, action) {
      const token = action.payload;
      state.isAuth = true;
      state.token = token;
      localStorage.setItem(STORAGE_KEY, token);
    },
  },
  extraReducers: (builder) => {
    builder
      // Поставил addMatcher вместо addCase для связи RTK Query и Redux Store.
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          const token = payload.access_token || payload.token;
          state.isAuth = true;
          state.token = token;
          localStorage.setItem(STORAGE_KEY, token);
        },
      )
      .addMatcher(
        authApi.endpoints.getMe.matchFulfilled,
        (state, { payload }) => {
          state.user = payload;
        },
      );
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;

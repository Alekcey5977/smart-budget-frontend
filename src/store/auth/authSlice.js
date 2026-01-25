import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "token1";

const getInitialState = () => {
  const token = localStorage.getItem(STORAGE_KEY);
  return {
    isAuth: Boolean(token),
    token: token,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    login(state, action) {
      const token = action.payload?.token ?? "demo-token";
      state.isAuth = true;
      state.token = token;
      localStorage.setItem(STORAGE_KEY, token);
    },
    logout(state) {
      localStorage.removeItem(STORAGE_KEY);
      state.isAuth = false;
      state.token = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;

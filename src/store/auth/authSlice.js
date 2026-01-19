import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "token1";

const getInitialState = () => {
  const token = localStorage.getItem(STORAGE_KEY);
  return {
    isAuth: Boolean(token),
    token: token ?? null,
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

    logout() {
      localStorage.removeItem(STORAGE_KEY);
      return getInitialState();
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

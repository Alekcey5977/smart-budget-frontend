import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "token1";

const initialState = () => {
  const token = localStorage.getItem(STORAGE_KEY);
  return {
    isAuth: Boolean(token),
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState(),
  reducers: {
    login(state, action) {
      const token = action.payload?.token ?? "demo-token";

      state.isAuth = true;
      state.token = token;

      localStorage.setItem(STORAGE_KEY, token);
    },

    logout() {
      localStorage.removeItem(STORAGE_KEY);
      return { ...inintialState };
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

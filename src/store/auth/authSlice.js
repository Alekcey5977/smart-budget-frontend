import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const STORAGE_KEY = "token1";

// Асинхронный экшен для входа
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // Пытаемся прочитать ошибку от сервера
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Ошибка авторизации");
      }

      const data = await response.json();
      return data; // Ожидаем { access_token: "...", ... }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const getInitialState = () => {
  const token = localStorage.getItem(STORAGE_KEY);
  return {
    isAuth: Boolean(token),
    token: token ?? null,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
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
      state.status = "idle";
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuth = true;
        const token = action.payload.access_token || action.payload.token;
        state.token = token;
        localStorage.setItem(STORAGE_KEY, token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

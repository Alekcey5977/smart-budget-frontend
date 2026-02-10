import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const STORAGE_KEY = "token1";

// --- LOGIN ---
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Ошибка авторизации");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      const body = {
        email: userData.email,
        password: userData.password,
        first_name: userData.firstName,
        last_name: userData.lastName,
        middle_name: userData.middleName || null,
      };

      const response = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        const errorMessage = errorData.detail
          ? typeof errorData.detail === "string"
            ? errorData.detail
            : JSON.stringify(errorData.detail)
          : "Ошибка регистрации";

        throw new Error(errorMessage);
      }

      return dispatch(
        loginUser({ email: userData.email, password: userData.password }),
      ).unwrap();
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
    status: "idle",
    error: null,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    login(state, action) {
      const token = action.payload?.token;
      state.isAuth = true;
      state.token = token;
      localStorage.setItem(STORAGE_KEY, token);
    },
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
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { login, logout, clearError } = authSlice.actions;
export default authSlice.reducer;

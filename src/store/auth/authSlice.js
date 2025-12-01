import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuth: false,
};

const authSlice = createSlice({
  name: 'auth',      
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuth = true;
    },
    logout() {
      return {...initialState};
    },
  },
});


export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

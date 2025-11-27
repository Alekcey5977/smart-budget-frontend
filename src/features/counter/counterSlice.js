import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuth: false,
};

const counterSlice = createSlice({
  name: 'counter',      
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


export const { login, logout } = counterSlice.actions;
export default counterSlice.reducer;

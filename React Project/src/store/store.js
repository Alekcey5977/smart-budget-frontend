import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slice/Slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

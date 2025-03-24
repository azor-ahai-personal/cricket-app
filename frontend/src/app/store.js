import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/authSlice';
import playersReducer from '../store/playersSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    players: playersReducer,
  },
}); 
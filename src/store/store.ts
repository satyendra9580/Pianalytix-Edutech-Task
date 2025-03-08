
import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import authReducer from './authSlice';
import taskReducer from './taskSlice';
import { RootState } from './types';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    tasks: taskReducer
  }
});

export type AppDispatch = typeof store.dispatch;

export default store;

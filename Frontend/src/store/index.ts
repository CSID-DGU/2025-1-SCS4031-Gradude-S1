import {configureStore} from '@reduxjs/toolkit';
import authReducer from '@/store/slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// 루트 상태 타입 및 디스패치 타입
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

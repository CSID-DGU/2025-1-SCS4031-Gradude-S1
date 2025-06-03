// src/store/index.ts

import {configureStore, combineReducers} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import authReducer from './slices/authSlice';

// auth slice만 persist 대상(AsyncStorage에 저장)으로 설정
const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: ['accessToken', 'refreshToken', 'profileComplete'],
  // preSignupUserInfo는 로그인 직후에만 쓰고, 재실행 시에는 새로 로그인 흐름을 거치기 때문에,
  // persist할 필요 없다면 whitelist에서 제외해도 됩니다.
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  // 다른 slice가 있다면 여기에 추가
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist의 내부 액션(FLUSH, REHYDRATE 등)을 직렬화 검사에서 제외
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// PersistGate에서 사용할 persistor 객체
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

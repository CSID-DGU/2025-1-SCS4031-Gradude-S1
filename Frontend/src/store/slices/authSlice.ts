import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {UserInfo, TokenResponse} from '@/types/auth';

/* ── 상태 ── */
export interface AuthState {
  preSignupUserInfo: UserInfo | null;
  userProfile: UserInfo | null;
  accessToken: string | null;
  refreshToken: string | null;
  profileComplete: boolean;
}

const initialState: AuthState = {
  preSignupUserInfo: null,
  userProfile: null,
  accessToken: null,
  refreshToken: null,
  profileComplete: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setPreSignupUserInfo(state, action: PayloadAction<UserInfo>) {
      state.preSignupUserInfo = action.payload;
    },
    clearPreSignupUserInfo(state) {
      state.preSignupUserInfo = null;
    },

    setUserProfile(state, action: PayloadAction<UserInfo>) {
      state.userProfile = action.payload;
    },

    setTokens(state, action: PayloadAction<TokenResponse>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;

      // AsyncStorage에 토큰 저장
      AsyncStorage.setItem('accessToken', action.payload.accessToken);
      AsyncStorage.setItem('refreshToken', action.payload.refreshToken);
      console.log('💾 토큰 저장 완료 - Redux & AsyncStorage');
    },
    clearTokens(state) {
      state.accessToken = null;
      state.refreshToken = null;

      // AsyncStorage에서 토큰 제거
      AsyncStorage.removeItem('accessToken');
      AsyncStorage.removeItem('refreshToken');
      console.log('🗑️ 토큰 삭제 완료 - Redux & AsyncStorage');
    },

    setProfileComplete(state, action: PayloadAction<boolean>) {
      state.profileComplete = action.payload;
    },

    resetAuthState(state) {
      // 상태 초기화
      Object.assign(state, initialState);

      // AsyncStorage에서도 토큰 제거
      AsyncStorage.removeItem('accessToken');
      AsyncStorage.removeItem('refreshToken');
      console.log('🔄 인증 상태 초기화 완료 - Redux & AsyncStorage');
    },
  },
});

export const {
  setPreSignupUserInfo,
  clearPreSignupUserInfo,
  setUserProfile,
  setTokens,
  clearTokens,
  setProfileComplete,
  resetAuthState,
} = authSlice.actions;

export default authSlice.reducer;

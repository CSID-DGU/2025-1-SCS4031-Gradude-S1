// src/store/slices/authSlice.ts

import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {UserInfo, TokenResponse} from '@/types/auth';

export interface AuthState {
  preSignupUserInfo: UserInfo | null;
  accessToken: string | null;
  refreshToken: string | null;
  profileComplete: boolean; // ← 추가
}

const initialState: AuthState = {
  preSignupUserInfo: null,
  accessToken: null,
  refreshToken: null,
  profileComplete: false, // ← 초기값 false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 1) 회원가입 전에 미리 받아둔 사용자 정보 저장
    setPreSignupUserInfo(state, action: PayloadAction<UserInfo>) {
      state.preSignupUserInfo = action.payload;
    },
    // 2) 회원가입 전 사용자 정보 초기화
    clearPreSignupUserInfo(state) {
      state.preSignupUserInfo = null;
    },

    // 3) 토큰 저장 (로그인 성공 시 호출)
    setTokens(state, action: PayloadAction<TokenResponse>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    // 4) 토큰 제거 (로그아웃 시 호출)
    clearTokens(state) {
      state.accessToken = null;
      state.refreshToken = null;
    },

    // 5) 프로필 완료 여부 설정(true/false)
    setProfileComplete(state, action: PayloadAction<boolean>) {
      state.profileComplete = action.payload;
    },

    // 6) 전체 Auth 상태 초기화 (로그아웃/탈퇴 시 사용)
    resetAuthState() {
      return initialState;
    },
  },
});

export const {
  setPreSignupUserInfo,
  clearPreSignupUserInfo,
  setTokens,
  clearTokens,
  setProfileComplete,
  resetAuthState,
} = authSlice.actions;

export default authSlice.reducer;

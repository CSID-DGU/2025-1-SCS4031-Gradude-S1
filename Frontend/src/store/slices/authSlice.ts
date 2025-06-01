import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {UserInfo, TokenResponse} from '@/types/auth';

interface AuthState {
  preSignupUserInfo: UserInfo | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  preSignupUserInfo: null,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 회원가입 전에 미리 받아둔 사용자 정보 저장
    setPreSignupUserInfo(state, action: PayloadAction<UserInfo>) {
      state.preSignupUserInfo = action.payload;
    },
    // 회원가입 전 사용자 정보 초기화
    clearPreSignupUserInfo(state) {
      state.preSignupUserInfo = null;
    },

    // 토큰 저장 (로그인 성공 시 호출)
    setTokens(state, action: PayloadAction<TokenResponse>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    // 토큰 제거 (로그아웃 시 호출)
    clearTokens(state) {
      state.accessToken = null;
      state.refreshToken = null;
    },

    // 전체 Auth 상태 초기화
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
  resetAuthState,
} = authSlice.actions;
export default authSlice.reducer;

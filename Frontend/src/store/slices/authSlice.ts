import {createSlice, PayloadAction} from '@reduxjs/toolkit';
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
    },
    clearTokens(state) {
      state.accessToken = null;
      state.refreshToken = null;
    },

    setProfileComplete(state, action: PayloadAction<boolean>) {
      state.profileComplete = action.payload;
    },

    resetAuthState() {
      return initialState;
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

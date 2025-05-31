import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {UserInfo} from '@/types/auth';

interface AuthState {
  preSignupUserInfo: UserInfo | null;
}

const initialState: AuthState = {
  preSignupUserInfo: null,
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
  },
});

export const {setPreSignupUserInfo, clearPreSignupUserInfo} = authSlice.actions;
export default authSlice.reducer;

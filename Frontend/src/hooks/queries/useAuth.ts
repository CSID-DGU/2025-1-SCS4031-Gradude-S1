import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useDispatch, useSelector} from 'react-redux';
import {kakaoTokenLogin, postSignup, getProfile} from '@/api/auth';
import {
  setTokens,
  setPreSignupUserInfo,
  setProfileComplete,
  resetAuthState,
  clearPreSignupUserInfo,
  setUserProfile,
} from '@/store/slices/authSlice';
import {setHeader, removeHeader} from '@/utils';
import type {RootState, AppDispatch} from '@/store';
import queryClient from '@/api/queryClient';
import React from 'react';

export default function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  const accessToken = useSelector((s: RootState) => s.auth.accessToken);
  const profileComplete = useSelector((s: RootState) => s.auth.profileComplete);
  const preSignupInfo = useSelector((s: RootState) => s.auth.preSignupUserInfo);

  /* ── 1) 카카오 로그인 ── */
  const kakaoLoginMutation = useMutation({
    mutationFn: kakaoTokenLogin,
    onSuccess: ({result}) => {
      const {tokenResponse, userInfo, firstLogin} = result;

      // ① 토큰 세팅
      if (tokenResponse) {
        dispatch(setTokens(tokenResponse));
        setHeader('Authorization', `Bearer ${tokenResponse.accessToken}`);
      }

      // ② 첫 로그인 / 기존 로그인 분기
      if (firstLogin && userInfo) {
        dispatch(setPreSignupUserInfo(userInfo));
        dispatch(setProfileComplete(false));
      } else {
        dispatch(setProfileComplete(true));
        if (userInfo) dispatch(setUserProfile(userInfo));
      }
    },
  });

  /* ── 2) 회원가입 ── */
  const signupMutation = useMutation({
    mutationFn: postSignup,
    onSuccess: async res => {
      // ① 토큰 저장
      dispatch(setTokens(res.result));
      setHeader('Authorization', `Bearer ${res.result.accessToken}`);

      // ② 최신 프로필 동기화
      const profile = await getProfile();
      dispatch(setUserProfile(profile));
      dispatch(setProfileComplete(true));
      dispatch(clearPreSignupUserInfo());
      queryClient.setQueryData(['auth', 'profile'], profile);
    },
  });

  /* ── 3) 전체 초기화 후 로그아웃/탈퇴 처리 ── */
  React.useEffect(() => {
    // resetAuthState() 는 logoutMutation / deleteAccountMutation 내부(onSuccess)에서 호출
  }, []);

  return {
    kakaoLoginMutation,
    signupMutation,
    preSignupUserInfo: preSignupInfo,
    isAuthenticated: Boolean(accessToken),
    isProfileComplete: profileComplete,
  };
}

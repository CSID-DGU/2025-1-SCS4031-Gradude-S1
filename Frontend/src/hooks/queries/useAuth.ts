// src/hooks/queries/useAuth.ts

import {useDispatch, useSelector} from 'react-redux';
import {
  setTokens,
  setPreSignupUserInfo,
  setProfileComplete,
  resetAuthState,
  clearPreSignupUserInfo,
} from '@/store/slices/authSlice';
import type {RootState, AppDispatch} from '@/store';
import {useMutation} from '@tanstack/react-query';
import {kakaoLogin, postSignup} from '@/api/auth';
import {
  useGetRefreshToken,
  useLogout,
  useDeleteAccount,
} from './useAuthHelpers';
import queryClient from '@/api/queryClient';
import React from 'react';

export default function useAuth() {
  const dispatch = useDispatch<AppDispatch>();

  // Redux에서 인증/프로필 상태를 읽어 옵니다.
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const profileComplete = useSelector(
    (state: RootState) => state.auth.profileComplete,
  );
  const preSignupUserInfo = useSelector(
    (state: RootState) => state.auth.preSignupUserInfo,
  );

  // 1) 카카오 로그인Mutation
  const kakaoLoginMutation = useMutation({
    mutationFn: kakaoLogin,
    onSuccess: res => {
      const {firstLogin, tokenResponse, userInfo} = res.result;

      if (tokenResponse) {
        // ❗ 로그인 성공 시 토큰을 Redux에 저장
        dispatch(
          setTokens({
            accessToken: tokenResponse.accessToken,
            refreshToken: tokenResponse.refreshToken,
          }),
        );
      }

      if (firstLogin && userInfo) {
        // ❗ 첫 가입 유저라면, preSignupUserInfo를 Redux에 저장하고 profileComplete는 false로 설정
        dispatch(setPreSignupUserInfo(userInfo));
        dispatch(setProfileComplete(false));
      } else {
        // ❗ 기존 유저라면 profileComplete를 true로 설정
        dispatch(setProfileComplete(true));
      }
    },
    onSettled: () => {
      // 토큰 세팅 후, refreshQuery를 다시 실행해서 백엔드에서 AccessToken 갱신 혹은 재검증
      queryClient.refetchQueries({queryKey: ['auth', 'getAccessToken']});
    },
  });

  // 2) 회원가입Mutation
  const signupMutation = useMutation({
    mutationFn: postSignup,
    onSuccess: () => {
      // 회원가입 완료 시 profileComplete를 true로 바꾸고, preSignupUserInfo는 초기화
      dispatch(setProfileComplete(true));
      dispatch(clearPreSignupUserInfo());
      queryClient.invalidateQueries({queryKey: ['auth', 'getProfile']});
    },
  });

  // 3) 리프레시 토큰 & 로그아웃/탈퇴 훅은 기존과 동일
  const refreshQuery = useGetRefreshToken();
  const logoutMutation = useLogout();
  const deleteAccountMutation = useDeleteAccount();

  // 로그아웃/탈퇴 성공 시 전체 auth 상태 초기화
  React.useEffect(() => {
    if (logoutMutation.isSuccess || deleteAccountMutation.isSuccess) {
      dispatch(resetAuthState());
      queryClient.clear();
    }
  }, [logoutMutation.isSuccess, deleteAccountMutation.isSuccess, dispatch]);

  return {
    // 네비게이터 분기에서 필요한 값들
    preSignupUserInfo,
    kakaoLoginMutation,
    signupMutation,
    refreshQuery,
    logoutMutation,
    deleteAccountMutation,
    isAuthenticated: Boolean(accessToken), // accessToken이 있으면 로그인된 상태
    isProfileComplete: profileComplete,
    isLoading: refreshQuery.isLoading,
  };
}

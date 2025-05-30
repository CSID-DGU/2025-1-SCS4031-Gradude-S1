import {useEffect, useState} from 'react';
import {useMutation} from '@tanstack/react-query';
import {kakaoLogin, postSignup} from '@/api/auth';
import type {
  KakaoLoginResponse,
  SignupRequest,
  SignupResponse,
  UserInfo,
} from '@/types/auth';
import {
  setHeader,
  setEncryptStorage,
  removeHeader,
  removeEncryptStorage,
} from '@/utils';
import queryClient from '@/api/queryClient';
import {queryKeys, storageKeys} from '@/constants';
import {
  useGetRefreshToken,
  useGetProfile,
  useLogout,
  useDeleteAccount,
} from '@/hooks/queries/useAuthHelpers';

function useAuth() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);

  // 1) 회원가입: 성공 시 profileComplete = true
  const signupMutation = useMutation<SignupResponse, Error, SignupRequest>({
    mutationFn: postSignup,
    onSuccess: () => {
      setProfileComplete(true);
      queryClient.invalidateQueries({
        queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE],
      });
    },
  });

  // 2) 카카오 로그인: firstLogin 기반으로 profileComplete 세팅
  const kakaoLoginMutation = useMutation<KakaoLoginResponse, any, string>({
    mutationFn: kakaoLogin,
    onSuccess: res => {
      const {firstLogin, tokenResponse, userInfo} = res.result;

      if (tokenResponse) {
        setHeader('Authorization', `Bearer ${tokenResponse.accessToken}`);
        setEncryptStorage(
          storageKeys.REFRESH_TOKEN,
          tokenResponse.refreshToken,
        );
      }

      // 첫 로그인(false) 이 아닌 경우 existing user → profileComplete true
      setProfileComplete(!firstLogin);

      // 첫 로그인 시, 닉네임·이미지 미리 세팅
      if (firstLogin && userInfo) {
        queryClient.setQueryData<UserInfo>(
          [queryKeys.AUTH, queryKeys.GET_PROFILE],
          userInfo,
        );
      }
    },
    onSettled: () => {
      queryClient.refetchQueries({
        queryKey: [queryKeys.AUTH, queryKeys.GET_ACCESS_TOKEN],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE],
      });
    },
  });

  const refreshQuery = useGetRefreshToken();
  const profileQuery = useGetProfile(); // UI용 프로필 조회
  const logoutMutation = useLogout();
  const deleteAccountMutation = useDeleteAccount();

  // 로그아웃·탈퇴 시 profileComplete 리셋
  useEffect(() => {
    if (logoutMutation.isSuccess || deleteAccountMutation.isSuccess) {
      setProfileComplete(false);
      removeHeader('Authorization');
      removeEncryptStorage(storageKeys.REFRESH_TOKEN);
    }
  }, [logoutMutation.isSuccess, deleteAccountMutation.isSuccess]);

  // 토큰확인 로딩 끝나면 초기 로딩 false
  useEffect(() => {
    if (!refreshQuery.isLoading) {
      setIsInitialLoading(false);
    }
  }, [refreshQuery.isLoading]);

  return {
    signupMutation,
    kakaoLoginMutation,
    refreshQuery,
    profileQuery,
    logoutMutation,
    deleteAccountMutation,
    isAuthenticated: refreshQuery.isSuccess,
    isProfileComplete: profileComplete,
    isLoading: isInitialLoading,
  };
}

export default useAuth;

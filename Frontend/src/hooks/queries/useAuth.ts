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
  useLogout,
  useDeleteAccount,
} from '@/hooks/queries/useAuthHelpers';

export default function useAuth() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);

  // **카카오 로그인 직후 받은 userInfo를 저장**
  const [preSignupUserInfo, setPreSignupUserInfo] = useState<UserInfo | null>(
    null,
  );

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

      // 기존 회원이면 바로 프로필 완료
      setProfileComplete(!firstLogin);

      // 첫 로그인일 땐 userInfo를 preSignupUserInfo에 보관
      if (firstLogin && userInfo) {
        setPreSignupUserInfo(userInfo);
      }
    },
    onSettled: () => {
      queryClient.refetchQueries({
        queryKey: [queryKeys.AUTH, queryKeys.GET_ACCESS_TOKEN],
      });
    },
  });

  const signupMutation = useMutation<SignupResponse, Error, SignupRequest>({
    mutationFn: postSignup,
    onSuccess: () => {
      setProfileComplete(true);
      queryClient.invalidateQueries({
        queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE],
      });
    },
  });

  const refreshQuery = useGetRefreshToken();
  const logoutMutation = useLogout();
  const deleteAccountMutation = useDeleteAccount();

  useEffect(() => {
    if (!refreshQuery.isLoading) {
      setIsInitialLoading(false);
    }
  }, [refreshQuery.isLoading]);

  useEffect(() => {
    if (logoutMutation.isSuccess || deleteAccountMutation.isSuccess) {
      setProfileComplete(false);
      removeHeader('Authorization');
      removeEncryptStorage(storageKeys.REFRESH_TOKEN);
      setPreSignupUserInfo(null);
    }
  }, [logoutMutation.isSuccess, deleteAccountMutation.isSuccess]);

  return {
    preSignupUserInfo,
    // 위에거 회원가입용
    kakaoLoginMutation,
    signupMutation,
    refreshQuery,
    logoutMutation,
    deleteAccountMutation,
    isAuthenticated: refreshQuery.isSuccess,
    isProfileComplete: profileComplete,
    isLoading: isInitialLoading,
  };
}

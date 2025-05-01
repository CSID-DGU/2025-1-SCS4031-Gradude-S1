import {useEffect} from 'react';
import {useMutation, useQuery} from '@tanstack/react-query';

import {
  kakaoLogin,
  postSignup,
  getAccessToken,
  getProfile,
  logout,
  signout,
} from '@/api/auth';
import type {
  KakaoLoginResponse,
  TokenResponse,
  UserInfo,
  SignupRequest,
  SignupResponse,
} from '@/types/auth';
import {
  setHeader,
  removeHeader,
  setEncryptStorage,
  removeEncryptStorage,
} from '@/utils';
import queryClient from '@/api/queryClient';
import {numbers, queryKeys, storageKeys} from '@/constants';
import type {
  ResponseError,
  UseMutationCustomOptions,
  UseQueryCustomOptions,
} from '@/types/common';

export function useSignup(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: postSignup,
    ...mutationOptions,
  });
}
export function useKakaoLogin(
  mutationOptions?: UseMutationCustomOptions<KakaoLoginResponse>,
) {
  return useMutation({
    mutationFn: kakaoLogin,
    onSuccess: res => {
      const {firstLogin, tokenResponse, userInfo} = res.result;
      if (firstLogin && userInfo) {
        queryClient.setQueryData(
          [queryKeys.AUTH, queryKeys.GET_PROFILE],
          userInfo,
        );
      }
      // …
    },
    onSettled: () => {
      queryClient.refetchQueries({
        queryKey: [queryKeys.AUTH, queryKeys.GET_ACCESS_TOKEN],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE],
      });
    },
    ...mutationOptions,
  });
}

export function useGetRefreshToken() {
  const {data, error, isSuccess, isError, isPending} = useQuery({
    queryKey: [queryKeys.AUTH, queryKeys.GET_ACCESS_TOKEN],
    queryFn: getAccessToken,
    staleTime: numbers.ACCESS_TOKEN_REFRESH_TIME,
    refetchInterval: numbers.ACCESS_TOKEN_REFRESH_TIME,
    refetchOnReconnect: true,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (isSuccess) {
      setHeader('Authorization', `Bearer ${data.accessToken}`);
      setEncryptStorage(storageKeys.REFRESH_TOKEN, data.refreshToken);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      removeHeader('Authorization');
      removeEncryptStorage(storageKeys.REFRESH_TOKEN);
    }
  }, [isError]);

  return {isSuccess, isError, isPending};
}
export function useGetProfile(options?: UseQueryCustomOptions<UserInfo>) {
  return useQuery<UserInfo, ResponseError>({
    queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE],

    queryFn: () => {
      const cached = queryClient.getQueryData<UserInfo>([
        queryKeys.AUTH,
        queryKeys.GET_PROFILE,
      ]);
      if (!cached) {
        throw new Error('로그인 후 프로필 정보가 없습니다');
      }
      return cached;
    },

    enabled: false,
    initialData: () =>
      queryClient.getQueryData<UserInfo>([
        queryKeys.AUTH,
        queryKeys.GET_PROFILE,
      ])!,

    ...options,
  });
}

export function useLogout(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      removeHeader('Authorization');
      removeEncryptStorage(storageKeys.REFRESH_TOKEN);
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: [queryKeys.AUTH]});
    },
    ...mutationOptions,
  });
}

export function useDeleteAccount(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: signout,
    onSuccess: () => {
      removeHeader('Authorization');
      removeEncryptStorage(storageKeys.REFRESH_TOKEN);
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: [queryKeys.AUTH]});
    },
    ...mutationOptions,
  });
}

function useAuth() {
  const signupMutation = useSignup();
  const kakaoLoginMutation = useKakaoLogin();
  const refreshQuery = useGetRefreshToken();
  const profileQuery = useGetProfile();
  const logoutMutation = useLogout();
  const deleteAccountMutation = useDeleteAccount();
  const isLogin = profileQuery.isSuccess;
  const isLoginLoading = refreshQuery.isPending;

  return {
    signupMutation,
    kakaoLoginMutation,
    refreshQuery,
    profileQuery,
    isLogin,
    logoutMutation,
    deleteAccountMutation,
    isLoginLoading,
  };
}
export default useAuth;

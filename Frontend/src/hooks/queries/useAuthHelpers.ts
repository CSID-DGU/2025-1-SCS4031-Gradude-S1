import {useEffect} from 'react';
import {useMutation, useQuery} from '@tanstack/react-query';
import {getAccessToken, getProfile, logout, signout} from '@/api/auth';
import type {UserInfo} from '@/types/auth';
import {
  setHeader,
  removeHeader,
  setEncryptStorage,
  removeEncryptStorage,
} from '@/utils';
import queryClient from '@/api/queryClient';
import {numbers, queryKeys, storageKeys} from '@/constants';
import type {UseMutationCustomOptions} from '@/types/common';

/**
 * AccessToken 갱신
 */
export function useGetRefreshToken() {
  const {data, isSuccess, isError, isLoading} = useQuery({
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
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError) {
      removeHeader('Authorization');
      removeEncryptStorage(storageKeys.REFRESH_TOKEN);
    }
  }, [isError]);

  return {isSuccess, isError, isLoading};
}

/**
 *  프로필 조회
 */
export function useGetProfile() {
  return useQuery<UserInfo>({
    queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE],
    queryFn: getProfile, // UI에서 프로필 조회 용
  });
}

/**
 * 로그아웃
 */
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

/**
 * 회원 탈퇴
 */
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

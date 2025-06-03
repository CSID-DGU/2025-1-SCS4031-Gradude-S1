import {useQuery, useMutation} from '@tanstack/react-query';
import {getProfile, logout, signout} from '@/api/auth';
import type {UserInfo} from '@/types/auth';
import {removeHeader, removeEncryptStorage} from '@/utils';
import queryClient from '@/api/queryClient';
import {queryKeys, storageKeys} from '@/constants';
import type {UseMutationCustomOptions} from '@/types/common';

/* ── 1) 프로필 조회 ── */
export function useGetProfile() {
  return useQuery<UserInfo>({
    queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE],
    queryFn: getProfile,
  });
}

/* ── 2) 로그아웃 ── */
export function useLogout(options?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      removeHeader('Authorization');
      removeEncryptStorage(storageKeys.REFRESH_TOKEN);
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: [queryKeys.AUTH]});
    },
    ...options,
  });
}

/* ── 3) 회원 탈퇴 ── */
export function useDeleteAccount(options?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: signout,
    onSuccess: () => {
      removeHeader('Authorization');
      removeEncryptStorage(storageKeys.REFRESH_TOKEN);
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: [queryKeys.AUTH]});
    },
    ...options,
  });
}

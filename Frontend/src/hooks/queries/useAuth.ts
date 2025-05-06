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
// export function useGetProfile(options?: UseQueryCustomOptions<UserInfo>) {
//   return useQuery<UserInfo, ResponseError>({
//     queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE],

//     queryFn: () => {
//       const cached = queryClient.getQueryData<UserInfo>([
//         queryKeys.AUTH,
//         queryKeys.GET_PROFILE,
//       ]);
//       if (!cached) {
//         throw new Error('로그인 후 프로필 정보가 없습니다');
//       }
//       return cached;
//     },

//     enabled: false,
//     initialData: () =>
//       queryClient.getQueryData<UserInfo>([
//         queryKeys.AUTH,
//         queryKeys.GET_PROFILE,
//       ])!,

//     ...options,
//   });
// }

export function useGetProfile(options?: any) {
  return useQuery<UserInfo>({
    queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE],
    queryFn: getProfile,
    enabled: true, // *항상* 서버에서 프로필을 가져오도록
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
  const signupMutation = useMutation<SignupResponse, Error, SignupRequest>({
    mutationFn: postSignup,
    onSuccess: () => {
      // 프로필을 다시 불러오면, 이제 userInfo 가 완전해집니다
      queryClient.invalidateQueries({
        queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE],
      });
    },
  });
  const kakaoLoginMutation = useMutation<KakaoLoginResponse, any, string>({
    mutationFn: kakaoLogin,
    onSuccess: res => {
      if (res.result.tokenResponse) {
        // 기존 로그인 유저: 토큰 세팅
        setHeader(
          'Authorization',
          `Bearer ${res.result.tokenResponse.accessToken}`,
        );
        setEncryptStorage(
          storageKeys.REFRESH_TOKEN,
          res.result.tokenResponse.refreshToken,
        );
      }
    },
  });
  const refreshQuery = useGetRefreshToken();
  const profileQuery = useGetProfile();
  const logoutMutation = useLogout();
  const deleteAccountMutation = useDeleteAccount();

  // 1) “로그인(토큰갱신) 성공” 여부
  const isAuthenticated = refreshQuery.isSuccess;
  // 2) “프로필 조회” 성공 여부 → 첫 로그인 유저는 postSignup 전까지 false
  const isProfileComplete = profileQuery.isSuccess;

  return {
    signupMutation,
    kakaoLoginMutation,
    refreshQuery,
    profileQuery,
    logoutMutation,
    deleteAccountMutation,
    // 로그인 상태
    isAuthenticated,
    // 회원가입(프로필 완성) 상태
    isProfileComplete,
    // 전체 로딩 플래그
    isLoading: refreshQuery.isPending,
  };
}

export default useAuth;

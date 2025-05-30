import axiosInstance from '@/api/axios';
import {getEncryptStorage} from '@/utils';
import type {
  KakaoLoginResponse,
  TokenResponse,
  UserInfo,
  SignupRequest,
  SignupResponse,
} from '@/types/auth';
import {storageKeys} from '@/constants';

export const kakaoLogin = async (code: string): Promise<KakaoLoginResponse> => {
  const endpoint = `/api/auth/login?code=${encodeURIComponent(code)}`;
  const {data} = await axiosInstance.post<KakaoLoginResponse>(endpoint);
  return data;
};

export const postSignup = async (
  payload: SignupRequest,
): Promise<SignupResponse> => {
  const {data} = await axiosInstance.post<SignupResponse>(
    '/api/auth/signup',
    payload,
  );
  return data;
};
export const getAccessToken = async (): Promise<TokenResponse> => {
  const refreshToken = await getEncryptStorage(storageKeys.REFRESH_TOKEN);

  const {data} = await axiosInstance.post(
    '/api/auth/reissue',
    {}, // 빈 바디
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    },
  );

  // 만약 API가 { result: TokenResponse } 형태라면:
  // return data.result;
  // 아니라 data가 곧 TokenResponse라면:
  return data;
};

export const getProfile = async (): Promise<UserInfo> => {
  const {data} = await axiosInstance.post('/api/auth/profile');
  return data.result;
};

export const logout = async (): Promise<void> => {
  await axiosInstance.post('/api/auth/logout');
};

export const signout = async (): Promise<void> => {
  await axiosInstance.delete('/api/auth/delete');
};

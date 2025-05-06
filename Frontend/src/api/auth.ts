import axiosInstance from 'axios';
import {getEncryptStorage} from '@/utils';
import type {
  KakaoLoginResponse,
  TokenResponse,
  UserInfo,
  SignupRequest,
  SignupResponse,
} from '@/types/auth';

export const kakaoLogin = async (code: string): Promise<KakaoLoginResponse> => {
  const endpoint = `/api/auth/login?code=${encodeURIComponent(code)}`;
  const {data} = await axiosInstance.post<KakaoLoginResponse>(endpoint, {});
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
  const refreshToken = await getEncryptStorage('refreshToken');

  const {data} = await axiosInstance.get('/api/auth/reissue', {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  return data;
};

export const getProfile = async (authCode: string): Promise<UserInfo> => {
  const {data} = await axiosInstance.post<UserInfo>('/api/auth/signup');
  return data;
};

export const logout = async (): Promise<void> => {
  await axiosInstance.post('/api/auth/logout');
};

export const signout = async (): Promise<void> => {
  await axiosInstance.delete('/api/auth/delete');
};

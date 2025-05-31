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
  console.log('▶️ [postSignup] payload:', payload);

  const {data} = await axiosInstance.post<SignupResponse>(
    '/api/auth/signup',
    payload,
  );
  console.log('◀️ [postSignup] response data:', data);
  return data;
};

export const getAccessToken = async (): Promise<TokenResponse> => {
  const refreshToken = await getEncryptStorage(storageKeys.REFRESH_TOKEN);

  const {data} = await axiosInstance.post(
    '/api/auth/reissue',
    {},
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    },
  );
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

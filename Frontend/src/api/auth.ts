// src/api/auth.ts

import axiosInstance from '@/api/axios';
import type {
  KakaoLoginResponse,
  KakaoTokenRequest,
  SignupRequest,
  SignupResponse,
  UserInfo,
  TokenResponse, // 이미 정의되어 있어야 하는 타입
  ApiResponse, // ApiResponse<T> 제너릭 래퍼 타입
} from '@/types/auth';

/* ───── 1) 네이티브 SDK 토큰 로그인 ───── */
export const kakaoTokenLogin = async (
  payload: KakaoTokenRequest,
): Promise<KakaoLoginResponse> => {
  const {data} = await axiosInstance.post<KakaoLoginResponse>(
    '/api/auth/login',
    payload,
  );
  return data;
};

/* ───── 2) 회원가입(추가 정보) ───── */
export const postSignup = async (
  payload: SignupRequest,
): Promise<SignupResponse> => {
  const {data} = await axiosInstance.post<SignupResponse>(
    '/api/auth/signup',
    payload,
  );
  return data;
};

/* ───── 3) 프로필 조회 ───── */
export const getProfile = async (): Promise<UserInfo> => {
  const {data} = await axiosInstance.post<{result: UserInfo}>(
    '/api/auth/profile',
  );
  return data.result;
};

/* ───── 4) 로그아웃·탈퇴 ───── */
export const logout = () => axiosInstance.post('/api/auth/logout');
export const signout = () => axiosInstance.delete('/api/auth/delete');

/* ───── 5) 토큰 재발급 (Refresh Token → New Tokens) ───── */
export type ReissueResponse = ApiResponse<TokenResponse>;

export const reissueToken = async (
  refreshToken: string,
): Promise<TokenResponse> => {
  // 요청 바디에 { refreshToken } 형태로 보내면, 백엔드에서 새로운 access/refresh 토큰을 내려줍니다.
  const {data} = await axiosInstance.post<ReissueResponse>(
    '/api/auth/reissue',
    {refreshToken},
  );
  // ApiResponse<TokenResponse> 구조의 result 필드만 꺼내서 리턴
  return data.result;
};

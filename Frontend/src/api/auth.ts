import axiosInstance from '@/api/axios';
import type {
  KakaoLoginResponse,
  KakaoTokenRequest,
  SignupRequest,
  SignupResponse,
  UserInfo,
} from '@/types/auth';

/* ───── 1) 네이티브 SDK 토큰 로그인 ───── */

export const kakaoTokenLogin = async (
  payload: KakaoTokenRequest,
): Promise<KakaoLoginResponse> => {
  const {data} = await axiosInstance.post<KakaoLoginResponse>(
    '/api/auth/kakao/token',
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
  return data; // data.result.{accessToken,refreshToken}
};

/* ───── 3) 프로필 조회 ───── */
export const getProfile = async (): Promise<UserInfo> => {
  const {data} = await axiosInstance.post('/api/auth/profile');
  return data.result; // { kakaoId, nickname, … }
};

/* ───── 4) 로그아웃·탈퇴 ───── */
export const logout = () => axiosInstance.post('/api/auth/logout');
export const signout = () => axiosInstance.delete('/api/auth/delete');

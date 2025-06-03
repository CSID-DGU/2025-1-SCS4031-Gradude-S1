import type {KakaoProfile, Profile} from './profile';

export interface KakaoTokenRequest {
  accessToken: string;
  kakaoId: string;
  nickname?: string;
  profileImage?: string;
}

/* 토큰 페이로드 */
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

/* 로그인 결과 */
export interface LoginResult {
  tokenResponse: TokenResponse | null;
  userInfo: KakaoProfile | null;
  firstLogin: boolean;
}

/* 공통 래퍼 */
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export type KakaoLoginResponse = ApiResponse<LoginResult>;

/* ── 회원가입 ── */
export type SignupRequest = Profile;

export interface SignupResult {
  accessToken: string;
  refreshToken: string;
}

export type SignupResponse = ApiResponse<SignupResult>;

/* 프로필 조회 */
export type UserInfo = KakaoProfile;

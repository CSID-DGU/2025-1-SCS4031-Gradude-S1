// src/types/auth.ts

/** ── 카카오 로그인 직후 받을 최소 프로필 ── */
export interface KakaoProfile {
  kakaoId: number;
  nickname: string;
  profileImageUrl: string;
}

/** ── 회원가입 시 서버에 보낼 전체 타입 (KakaoProfile 확장) ── */
export interface Profile extends KakaoProfile {
  gender: 'MALE' | 'FEMALE';
  birth: string; // ex. '1990-05-21'
  faceRecognitionAgreed: boolean; // ex. true / false
}

/** ── 카카오 로그인 요청 ── */
export interface KakaoTokenRequest {
  accessToken: string;
  kakaoId: number;
  nickname?: string;
  profileImage?: string;
}

/** ── 토큰 페이로드 ── */
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

/** ── 로그인 결과 ── */
export interface LoginResult {
  tokenResponse: TokenResponse;
  userInfo: KakaoProfile;
  firstLogin: boolean;
}

/** ── 공통 응답 래퍼 ── */
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

/** ── 카카오 로그인 전체 응답 ── */
export type KakaoLoginResponse = ApiResponse<LoginResult>;

/** ── 회원가입 요청 페이로드 ── */
export type SignupRequest = Profile;

export interface SignupResult {
  accessToken: string;
  refreshToken: string;
}

export type SignupResponse = ApiResponse<SignupResult>;

/** ── 프로필 조회 시 쓸 수 있는 타입 ── */
export type UserInfo = KakaoProfile;

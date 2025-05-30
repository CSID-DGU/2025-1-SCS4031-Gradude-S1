import type {KakaoProfile, Profile} from './profile';

/** 토큰 페이로드 */
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

/** 로그인 API의 result.userInfo */
export type UserInfo = KakaoProfile;

/** 로그인 API의 result 전체 구조 */
export interface LoginResult {
  tokenResponse: TokenResponse | null;
  userInfo: UserInfo | null;
  firstLogin: boolean;
}
/** 공통 응답 래퍼 */
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

/** 최종 로그인 응답 타입 */
export type KakaoLoginResponse = ApiResponse<LoginResult>;

/** 회원가입 요청 페이로드 */
export type SignupRequest = Profile;

/** 회원가입 응답 타입 */
export interface SignupResponse {
  isSuccess: boolean;
  message: string;
}

// src/hooks/queries/useAuth.ts

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useDispatch, useSelector} from 'react-redux';
import {kakaoTokenLogin, postSignup, getProfile} from '@/api/auth';
import {
  setTokens,
  setProfileComplete,
  setUserProfile,
  setPreSignupUserInfo,
  clearPreSignupUserInfo,
  resetAuthState,
} from '@/store/slices/authSlice';
import {setHeader, removeHeader} from '@/utils';
import type {RootState, AppDispatch} from '@/store';
import React from 'react';
import type {KakaoProfile, SignupRequest} from '@/types/auth';

export default function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const reactQueryClient = useQueryClient();

  // Redux store에서 필요한 상태 꺼내오기
  const accessToken = useSelector((s: RootState) => s.auth.accessToken);
  const profileComplete = useSelector((s: RootState) => s.auth.profileComplete);
  const userProfile = useSelector((s: RootState) => s.auth.userProfile);
  const preSignupUserInfo = useSelector(
    (s: RootState) => s.auth.preSignupUserInfo,
  );

  /**
   * ─── 1) “앱 재실행 시” 또는 “필요할 때” 프로필 조회용 useQuery ───
   * - enabled 조건:
   *    • accessToken이 있어야 하고(= 로그인 상태)
   *    • 아직 Redux에 userProfile이 세팅되어 있지 않아야 함(= profileComplete이 false여야 함),
   *    • 동시에 첫 가입 후 preSignupUserInfo 단계가 아닐 때(= 이미 회원가입 완료된 유저일 때)
   */
  const profileQuery = useQuery<KakaoProfile, Error>({
    queryKey: ['auth', 'profile'],
    queryFn: async () => {
      try {
        const profileFromServer = await getProfile();
        // ① 서버로부터 받아온 프로필을 Redux에 저장
        dispatch(
          setUserProfile({
            kakaoId: profileFromServer.kakaoId,
            nickname: profileFromServer.nickname,
            profileImageUrl: profileFromServer.profileImageUrl,
          }),
        );
        dispatch(setProfileComplete(true));

        // ② react-query 캐시에도 저장 (다른 곳에서 useQuery(['auth','profile']) 로도 쓸 수 있도록)
        reactQueryClient.setQueryData(['auth', 'profile'], profileFromServer);

        return profileFromServer;
      } catch (err) {
        // console.error('❌ useQuery fetchProfile error ▶', err);
        // 예를 들어 토큰 만료 등으로 프로필 조회 실패 시, 강제 로그아웃 처리
        dispatch(resetAuthState());
        removeHeader('Authorization');
        throw err;
      }
    },
    enabled: Boolean(accessToken) && !userProfile && !preSignupUserInfo,
    retry: false,
  });

  /** ─── 2) 카카오 토큰 로그인 뮤테이션 ───
   *  “네이티브 SDK에서 받은 accessToken”을 백엔드에 전달해서
   *   • firstLogin 여부,
   *   • userInfo(카카오 프로필)
   *   • tokenResponse(access/refresh)
   *  등을 받아옵니다.
   */
  const kakaoLoginMutation = useMutation({
    mutationFn: kakaoTokenLogin, // payload: { accessToken, kakaoId, nickname, profileImageUrl }
    onSuccess: ({result}) => {
      const {tokenResponse, userInfo, firstLogin} = result;

      // ① 서버에서 내려준 tokenResponse를 Redux 및 axios 헤더에 세팅
      if (tokenResponse) {
        dispatch(
          setTokens({
            accessToken: tokenResponse.accessToken,
            refreshToken: tokenResponse.refreshToken,
          }),
        );
        setHeader('Authorization', `Bearer ${tokenResponse.accessToken}`);
      }

      if (firstLogin) {
        // ── 첫 로그인(= 아직 백엔드에 유저가 없는 상태) ──
        if (userInfo) {
          // Redux에 “preSignupUserInfo”만 저장
          dispatch(
            setPreSignupUserInfo({
              kakaoId: userInfo.kakaoId,
              nickname: userInfo.nickname,
              profileImageUrl: userInfo.profileImageUrl,
            }),
          );
        }
        // profileComplete은 false로 유지 (회원가입을 거쳐야 완료)
        dispatch(setProfileComplete(false));
      } else {
        // ── 기존에 가입된 유저라면 ──
        if (userInfo) {
          dispatch(
            setUserProfile({
              kakaoId: userInfo.kakaoId,
              nickname: userInfo.nickname,
              profileImageUrl: userInfo.profileImageUrl,
            }),
          );
        }
        dispatch(setProfileComplete(true));
        // preSignupUserInfo 초기화
        dispatch(clearPreSignupUserInfo());
      }
    },
    onError: err => {
      // console.error('❌ kakaoLoginMutation error ▶', err);
    },
  });

  /** ─── 3) 회원가입(추가 정보 입력) 뮤테이션 ─── */
  const signupMutation = useMutation({
    mutationFn: (payload: SignupRequest) => postSignup(payload),
    onSuccess: async res => {
      // ① 서버가 내려준 토큰을 Redux 및 axios 헤더에 세팅
      dispatch(
        setTokens({
          accessToken: res.result.accessToken,
          refreshToken: res.result.refreshToken,
        }),
      );
      setHeader('Authorization', `Bearer ${res.result.accessToken}`);

      // ② 회원가입 완료 후, 최종 프로필을 getProfile()을 통해 다시 받아와서 Redux에 저장
      try {
        const profileFromServer = await getProfile();
        dispatch(
          setUserProfile({
            kakaoId: profileFromServer.kakaoId,
            nickname: profileFromServer.nickname,
            profileImageUrl: profileFromServer.profileImageUrl,
          }),
        );
        dispatch(setProfileComplete(true));
        reactQueryClient.setQueryData(['auth', 'profile'], profileFromServer);
      } catch (profileErr) {
        console.error(
          '❌ signupMutation onSuccess ▶ getProfile error:',
          profileErr,
        );
      }
    },
    onError: err => {
      // console.error('❌ signupMutation error ▶', err);
    },
  });

  /** ─── 4) 로그아웃/탈퇴 시 전체 Redux 상태 초기화 ─── */
  React.useEffect(() => {
    // 실제 로그아웃 API나 탈퇴 API를 호출할 때, 아래처럼 호출하면 됩니다:
    // dispatch(resetAuthState());
    // removeHeader('Authorization');
    // 이 훅 내부에서는 별도 로직 필요 없음
  }, []);

  return {
    // React Query
    profileQuery, // “앱 재실행 시” 자동 프로필 조회
    // Mutations
    kakaoLoginMutation, // 카카오 로그인
    signupMutation, // 회원가입 (추가 정보 입력)
    // Redux에 저장된 인증/프로필 상태
    isAuthenticated: Boolean(accessToken),
    isProfileComplete: profileComplete,
    userProfile, // 프로필 정보가 필요한 컴포넌트에서 직접 꺼내 쓰기 좋습니다
    preSignupUserInfo, // 첫 가입 시점(회원가입 화면에서만 사용)
  };
}

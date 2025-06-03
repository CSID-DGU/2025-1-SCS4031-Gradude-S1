import React, {useEffect, useRef} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {hideSplash, showSplash} from 'react-native-splash-view';

import AuthStackNavigator from '@/navigations/stack/AuthStackNavigator';
import SignupScreen from '@/screens/Auth/SignupScreen';
import TabNavigator from '@/navigations/tab/TabNavigator';
import useAuth from '@/hooks/queries/useAuth';
import {authNavigations} from '@/constants';
import type {KakaoProfile} from '@/types/auth';

export type RootStackParamList = {
  AuthStack: undefined;
  [authNavigations.SIGNUP]: {kakaoProfile: KakaoProfile};
  TabNavigator: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const {
    isAuthenticated,
    isProfileComplete,
    kakaoLoginMutation,
    signupMutation,
    profileQuery,
  } = useAuth();

  /* ───── Splash 화면 처리 ───── */
  const didShowSplash = useRef(false);

  useEffect(() => {
    if (!didShowSplash.current) {
      showSplash();
      didShowSplash.current = true;
    }
  }, []);

  /** 모든 mutation이 끝나면 스플래시 숨김 */
  useEffect(() => {
    const busy = kakaoLoginMutation.isPending || signupMutation.isPending;
    if (didShowSplash.current && !busy) {
      hideSplash();
    }
  }, [kakaoLoginMutation.isPending, signupMutation.isPending]);

  useEffect(() => {
    // “이미 액세스 토큰이 남아 있다면(=로그인 상태 유지)” 때마다 서버로 프로필을 불러온다.
    if (isAuthenticated) {
      profileQuery.refetch();
    }
  }, [isAuthenticated, profileQuery]);

  /* 네비게이터 렌더 전 로딩 인디케이터 (Splash 안 보이는 케이스 대비) */
  const stillLoading = kakaoLoginMutation.isPending || signupMutation.isPending;
  if (stillLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <RootStack.Navigator screenOptions={{headerShown: false}}>
      {/* 1) 로그인 전 전체 스택 */}
      {!isAuthenticated && (
        <RootStack.Screen name="AuthStack" component={AuthStackNavigator} />
      )}

      {/* 2) 첫 로그인 → 추가 정보 입력 */}
      {isAuthenticated && !isProfileComplete && (
        <RootStack.Screen
          name={authNavigations.SIGNUP}
          component={SignupScreen}
        />
      )}

      {/* 3) 로그인 + 프로필 완료 → 탭 네비게이터 */}
      {isAuthenticated && isProfileComplete && (
        <RootStack.Screen name="TabNavigator" component={TabNavigator} />
      )}
    </RootStack.Navigator>
  );
}

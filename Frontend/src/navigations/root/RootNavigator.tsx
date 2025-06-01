import React, {useEffect, useRef} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AuthStackNavigator from '../stack/AuthStackNavigator';
import SignupScreen from '@/screens/Auth/SignupScreen';
import TabNavigator from '../tab/TabNavigator';
import useAuth from '@/hooks/queries/useAuth';
import {authNavigations} from '@/constants';
import {hideSplash, showSplash} from 'react-native-splash-view';

export type RootStackParamList = {
  AuthStack: undefined; // 로그인 흐름 전체
  [authNavigations.SIGNUP]: {authCode: string};
  TabNavigator: undefined; // 로그인 후 BottomTabs 전체
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const {isAuthenticated, isProfileComplete, isLoading} = useAuth();
  const didShowSplash = useRef(false);

  // Splash 처리
  useEffect(() => {
    showSplash();
    didShowSplash.current = true;
  }, []);

  useEffect(() => {
    if (didShowSplash.current && !isLoading) {
      hideSplash();
    }
  }, [isLoading]);

  // 로딩 중이라면 로딩 인디케이터만 띄우고, 네비게이터는 아직 렌더링하지 않음
  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <RootStack.Navigator
      screenOptions={{headerShown: false}}
      // 초기 진입할 화면을 isAuthenticated / isProfileComplete 에 따라 선택
      initialRouteName={
        !isAuthenticated
          ? 'AuthStack'
          : !isProfileComplete
          ? authNavigations.SIGNUP
          : 'TabNavigator'
      }>
      {/* 1) 로그인 전 흐름 전체를 담고 있는 네비게이터 */}
      <RootStack.Screen name="AuthStack" component={AuthStackNavigator} />

      {/* 2) 프로필이 완성되지 않아 회원가입(Signup) 화면으로 가야 할 때 */}
      <RootStack.Screen
        name={authNavigations.SIGNUP}
        component={SignupScreen}
      />

      {/* 3) 로그인 & 프로필 완료된 뒤 보여줄 BottomTabs 전체 */}
      <RootStack.Screen name="TabNavigator" component={TabNavigator} />
    </RootStack.Navigator>
  );
}

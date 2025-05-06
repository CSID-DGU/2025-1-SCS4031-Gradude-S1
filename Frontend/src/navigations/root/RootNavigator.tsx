// src/navigations/root/RootNavigator.tsx
import React from 'react';
import {Text, View, ActivityIndicator} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AuthStackNavigator from '../stack/AuthStackNavigator';
import SignupScreen from '@/screens/Auth/SignupScreen';
import TapNavigator from '../tab/TabNavigator';
import useAuth from '@/hooks/queries/useAuth';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {authNavigations} from '@/constants';

// 연동 시, 아래 코드 주석 해제
// export type AuthStackParamList = {
//   [authNavigations.SIGNUP]: {authCode: string};
// };

// const Stack = createNativeStackNavigator<AuthStackParamList>();

// export default function RootNavigator() {
//   const {isAuthenticated, isProfileComplete, isLoading} = useAuth();

//   // 0) 아직 토큰 확인 중
//   if (isLoading) {
//     return (
//       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   // 1) 토큰이 없으면 → 로그인/카카오로그인/회원가입 스택
//   if (!isAuthenticated) {
//     return <AuthStackNavigator />;
//   }

//   // 2) 토큰은 있는데, 프로필(추가정보) 없으면 → SignupScreen
//   if (!isProfileComplete) {
//     <Stack.Navigator screenOptions={{headerShown: false}}>
//       <Stack.Screen
//         name={authNavigations.SIGNUP}
//         component={SignupScreen}
//         options={{
//           headerTitle: '회원가입',
//         }}
//       />
//     </Stack.Navigator>;
//   }

//   // 3) 모두 완료된 회원 → 메인 탭 네비게이터
//   return <TapNavigator />;
// }

// 아래 코드로 테스트

export default RootNavigator;
function RootNavigator() {
  const isLogin = true;
  if (isLogin === undefined) {
    return <Text>로딩중…</Text>;
  }
  return isLogin ? <TapNavigator /> : <AuthStackNavigator />;
}

// import React, {useEffect, useRef} from 'react';
// import {View, ActivityIndicator} from 'react-native';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import AuthStackNavigator from '../stack/AuthStackNavigator';
// import SignupScreen from '@/screens/Auth/SignupScreen';
// import TabNavigator from '../tab/TabNavigator';
// import useAuth from '@/hooks/queries/useAuth';
// import {authNavigations} from '@/constants';
// import {hideSplash, showSplash} from 'react-native-splash-view';
// import type {RootState} from '@/store';
// import {useSelector} from 'react-redux';

// export type RootStackParamList = {
//   AuthStack: undefined;
//   [authNavigations.SIGNUP]: {authCode: string};
//   TabNavigator: undefined;
// };

// const RootStack = createNativeStackNavigator<RootStackParamList>();

// export default function RootNavigator() {
//   // ① useAuth 훅에서 isLoading, isAuthenticated, isProfileComplete 받아오기
//   //    (useAuth 내부에서 redux-persist 복원, 리프레시 토큰 체크 등을 처리합니다.)
//   const {isLoading, isAuthenticated, isProfileComplete} = useAuth();

//   console.log(
//     '🛠️ [RootNavigator] isLoading, isAuthenticated, isProfileComplete →',
//     isLoading,
//     isAuthenticated,
//     isProfileComplete,
//   );

//   const didShowSplash = useRef(false);

//   // Splash 띄우기
//   useEffect(() => {
//     showSplash();
//     didShowSplash.current = true;
//   }, []);

//   // 리프레시 로딩 완료되면 Splash 숨기기
//   useEffect(() => {
//     if (didShowSplash.current && !isLoading) {
//       hideSplash();
//     }
//   }, [isLoading]);

//   // 앱이 로딩 중이면 인디케이터만 보여준다
//   if (isLoading) {
//     return (
//       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   // 인증/프로필 여부에 따라 초기 화면 분기
//   // isAuthenticated: 로그인 복원 여부 (accessToken 존재 여부)
//   // isProfileComplete: 프로필(회원가입) 완료 여부
//   return (
//     <RootStack.Navigator
//       screenOptions={{headerShown: false}}
//       initialRouteName={
//         !isAuthenticated
//           ? 'AuthStack'
//           : !isProfileComplete
//           ? authNavigations.SIGNUP
//           : 'TabNavigator'
//       }>
//       <RootStack.Screen name="AuthStack" component={AuthStackNavigator} />
//       <RootStack.Screen
//         name={authNavigations.SIGNUP}
//         component={SignupScreen}
//       />
//       <RootStack.Screen name="TabNavigator" component={TabNavigator} />
//     </RootStack.Navigator>
//   );
// }

import {SafeAreaProvider} from 'react-native-safe-area-context';
import AuthStackNavigator from '../stack/AuthStackNavigator';
import SignupScreen from '@/screens/Auth/SignupScreen';
import TapNavigator from '../tab/TabNavigator';
import useAuth from '@/hooks/queries/useAuth';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {authNavigations} from '@/constants';
import {Text} from 'react-native-gesture-handler';

export default RootNavigator;
function RootNavigator() {
  const isLogin = true;
  if (isLogin === undefined) {
    return <Text>로딩중…</Text>;
  }
  return isLogin ? <TapNavigator /> : <AuthStackNavigator />;
}

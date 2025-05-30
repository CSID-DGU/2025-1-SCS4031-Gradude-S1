import React, {useEffect, useRef} from 'react';
import {Text, View, ActivityIndicator} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AuthStackNavigator from '../stack/AuthStackNavigator';
import SignupScreen from '@/screens/Auth/SignupScreen';
import TapNavigator from '../tab/TabNavigator';
import useAuth from '@/hooks/queries/useAuth';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {authNavigations} from '@/constants';
import {hideSplash, showSplash} from 'react-native-splash-view';

export type AuthStackParamList = {
  [authNavigations.SIGNUP]: {authCode: string};
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function RootNavigator() {
  const {isAuthenticated, isProfileComplete, isLoading} = useAuth();
  const didShowSplash = useRef(false);

  useEffect(() => {
    showSplash();
    didShowSplash.current = true;
  }, []);

  useEffect(() => {
    if (didShowSplash.current && !isLoading) {
      hideSplash();
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <AuthStackNavigator />;
  }

  if (!isProfileComplete) {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen
          name={authNavigations.SIGNUP}
          component={SignupScreen}
          options={{
            headerTitle: '회원가입',
          }}
        />
      </Stack.Navigator>
    );
  }

  return <TapNavigator />;
}

// 아래 코드로 테스트

// export default RootNavigator;
// function RootNavigator() {
//   const isLogin = true;
//   if (isLogin === undefined) {
//     return <Text>로딩중…</Text>;
//   }
//   return isLogin ? <TapNavigator /> : <AuthStackNavigator />;
// }

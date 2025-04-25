import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StyleSheet} from 'react-native';
import LoginScreen from '../screens/Auth/LoginScreen';
import KakaoLoginScreen from '../screens/Auth/KakaoLoginScreen';
import {SafeAreaView} from 'react-native-safe-area-context';
import {authNavigations} from '../constants';

export type AuthStackParamList = {
  [authNavigations.LOGIN]: undefined;
  [authNavigations.KAKAO_LOGIN]: undefined;
};
function AuthStackNavigator() {
  const Stack = createNativeStackNavigator<AuthStackParamList>();
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Navigator>
        <Stack.Screen name={authNavigations.LOGIN} component={LoginScreen} />
        <Stack.Screen
          name={authNavigations.KAKAO_LOGIN}
          component={KakaoLoginScreen}
        />
        {/* <stack.Screen name="SignUp" component={SignupScreen} /> */}
      </Stack.Navigator>
    </SafeAreaView>
  );
}

export default AuthStackNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

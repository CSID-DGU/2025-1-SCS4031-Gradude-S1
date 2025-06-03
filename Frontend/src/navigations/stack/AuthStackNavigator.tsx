import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {authNavigations, colors} from '@/constants';
import LoginScreen from '@/screens/Auth/LoginScreen';
import SignupScreen from '@/screens/Auth/SignupScreen';

export type AuthStackParamList = {
  [authNavigations.AUTH_HOME]: undefined;

  [authNavigations.SIGNUP]: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();
function AuthStackNavigator() {
  return (
    <View style={styles.container}>
      <Stack.Navigator
        screenOptions={{
          contentStyle: {
            backgroundColor: colors.WHITE,
          },
          headerStyle: {
            backgroundColor: colors.SEMIWHITE,
          },
          headerShadowVisible: true,
          headerTitleStyle: {
            fontSize: 15,
          },
          headerTintColor: colors.BLACK,
        }}>
        <Stack.Screen
          name={authNavigations.AUTH_HOME}
          component={LoginScreen}
          options={{
            headerTitle: '',
            headerBackVisible: false,
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={authNavigations.SIGNUP}
          component={SignupScreen}
          options={{
            headerTitle: '회원가입',
          }}
        />
      </Stack.Navigator>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {flex: 1},
});

export default AuthStackNavigator;

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StyleSheet, View} from 'react-native';
import {colors, healthNavigations} from '@/constants';
import HealthScreen from '@/screens/Health/HealthScreen';

export type HealthStackParamList = {
  [healthNavigations.HEALTH_HOME]: undefined;
};

const Stack = createNativeStackNavigator<HealthStackParamList>();
function HealthStackNavigator() {
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
          name={healthNavigations.HEALTH_HOME}
          component={HealthScreen}
          options={{
            headerTitle: '',
            headerBackVisible: false,
            headerShown: false,
          }}
        />
        {/* <Stack.Screen
          name={authNavigations.KAKAO_LOGIN}
          component={KakaoLoginScreen}
          options={{
            headerTitle: '카카오 로그인',
          }}
        /> */}
        {/* <Stack.Screen
          name={authNavigations.SIGNUP}
          component={SignupScreen}
          options={{
            headerTitle: '회원가입',
          }}
        /> */}
      </Stack.Navigator>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {flex: 1},
});

export default HealthStackNavigator;

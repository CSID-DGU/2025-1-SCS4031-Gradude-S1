import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StyleSheet, View} from 'react-native';
import {colors, healthNavigations} from '@/constants';
import HealthScreen from '@/screens/Health/HealthScreen';
import CalendarScreen from '../../screens/Health/CalendarScreen';
import HealthDairyScreen from '../../screens/Health/HealthDairyScreen';
import HealthResultScreen from '@/screens/Health/HealthResultScreen';
import FinalResultListScreen from '@/screens/Health/FinalResultListScreen';
import StrokeScreen from '@/screens/Health/StrokeScreen';

export type HealthStackParamList = {
  [healthNavigations.HEALTH_HOME]: undefined;
  [healthNavigations.CALENDAR]: undefined;
  [healthNavigations.HEALTH_DAIRY]: undefined;
  [healthNavigations.HEALTH_RESULT]: undefined;
  [healthNavigations.FINAL_RESULT_LIST]: undefined;
  [healthNavigations.STROKE_DETAIL]: undefined;
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
        <Stack.Screen
          name={healthNavigations.CALENDAR}
          component={CalendarScreen}
          options={{
            headerTitle: '',
          }}
        />
        <Stack.Screen
          name={healthNavigations.HEALTH_DAIRY}
          component={HealthDairyScreen}
          options={{
            headerTitle: '',
            headerBackVisible: false,
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={healthNavigations.HEALTH_RESULT}
          component={HealthResultScreen}
          options={{
            headerTitle: '',
            headerBackVisible: false,
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={healthNavigations.FINAL_RESULT_LIST}
          component={FinalResultListScreen}
          options={{
            headerTitle: '',
          }}
        />
        <Stack.Screen
          name={healthNavigations.STROKE_DETAIL}
          component={StrokeScreen}
          options={{
            headerTitle: '',
          }}
        />
      </Stack.Navigator>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {flex: 1},
});

export default HealthStackNavigator;

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {colors, healthNavigations} from '@/constants';
import HealthScreen from '@/screens/Health/HealthScreen';
import CalendarScreen from '../../screens/Health/CalendarScreen';
import HealthDairyScreen from '../../screens/Health/HealthDairyScreen';
import HealthResultScreen from '@/screens/Health/HealthResultScreen';
import FinalResultListScreen from '@/screens/Health/FinalResultListScreen';
import StrokeScreen from '@/screens/Health/StrokeScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';

export type HealthStackParamList = {
  [healthNavigations.HEALTH_HOME]: undefined;
  [healthNavigations.CALENDAR]: undefined;
  [healthNavigations.HEALTH_DAIRY]: {date: string};
  [healthNavigations.HEALTH_RESULT]: {diaryId: number};
  [healthNavigations.FINAL_RESULT_LIST]: undefined;
  [healthNavigations.STROKE_DETAIL]: undefined;
};

// TODO : 건강 수첩 결과지에서 캘린더 다시 눌렀을때 < BACK 사라지는지 확인

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
            headerBackTitle: '',
            headerBackVisible: true,
            headerShown: true,
          }}
        />
        <Stack.Screen
          name={healthNavigations.HEALTH_DAIRY}
          component={HealthDairyScreen}
          options={{
            headerTitle: '',
            headerBackVisible: true,
            headerShown: true,
          }}
        />
        <Stack.Screen
          name={healthNavigations.HEALTH_RESULT}
          component={HealthResultScreen}
          options={({navigation}) => ({
            title: '오늘의 건강 점수',
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  navigation.popToTop();
                  navigation.navigate(healthNavigations.CALENDAR);
                }}
                style={{marginRight: 16}}>
                <Ionicons
                  name="calendar-outline"
                  size={24}
                  color={colors.BLACK}
                />
              </TouchableOpacity>
            ),
          })}
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

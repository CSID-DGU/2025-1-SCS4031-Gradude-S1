import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StyleSheet, View} from 'react-native';
import {colors, homeNavigations} from '@/constants';

import HomeScreen from '@/screens/Home/HomeScreen';
import FaceSmileScreen from '@/screens/Home/FaceSmileScreen';
import CameraScreen from '@/screens/Home/CameraScreen';
import RecordScreen from '@/screens/Home/RecordScreen';
import LoadingScreen from '@/screens/Home/LoadingScreen';
import MidResultScreen from '@/screens/Home/MidResultScreen';
import FinalResultScreen from '@/screens/Home/FinalResultScreen'; // 경로 확인
import type {SurveyResultDto} from '@/types/diagnosis';
import SelfDgsScreen from '@/screens/Home/SelfDgsScreen';

export type HomeStackParamList = {
  [homeNavigations.MAIN_HOME]: undefined;
  [homeNavigations.FACE_SMILE]: undefined;
  [homeNavigations.CAMERA]: undefined;
  [homeNavigations.RECORD]: {CameraUri: string};

  Loading:
    | {CameraUri: string; AudioUri: string}
    | {
        surveyPayload: {
          orientationMonth: number;
          orientationAge: number;
          gaze: 0 | 1;
          arm: 0 | 1;
        };
      };

  [homeNavigations.MID_RESULT]: {
    facePrediction: boolean;
    speechPrediction: boolean;
  };
  [homeNavigations.SELF_DGS]: undefined;

  // ↓ 여기만 수정
  [homeNavigations.FINAL_RESULT]: {surveyResult: SurveyResultDto};
  // 원래는 { diagnosisId: number } 였지만, LoadingScreen에서 surveyResult 를 직접 넘기므로
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

function HomeStackNavigator() {
  return (
    <View style={styles.container}>
      <Stack.Navigator
        screenOptions={{
          contentStyle: {backgroundColor: colors.WHITE},
          headerStyle: {backgroundColor: colors.SEMIWHITE},
          headerShadowVisible: true,
          headerTitleStyle: {fontSize: 15},
          headerTintColor: colors.BLACK,
        }}>
        <Stack.Screen
          name={homeNavigations.MAIN_HOME}
          component={HomeScreen}
          options={{
            headerTitle: '',
            headerBackVisible: false,
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={homeNavigations.FACE_SMILE}
          component={FaceSmileScreen}
          options={{
            headerTitle: '',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={homeNavigations.CAMERA}
          component={CameraScreen}
          options={{
            headerTitle: '',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={homeNavigations.RECORD}
          component={RecordScreen}
          options={{
            headerTitle: '',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={homeNavigations.LOADING}
          component={LoadingScreen}
          options={{
            headerTitle: '',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={homeNavigations.MID_RESULT}
          component={MidResultScreen}
          options={{
            headerTitle: '',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={homeNavigations.SELF_DGS}
          component={SelfDgsScreen}
          options={{
            headerTitle: '',
          }}
        />
        <Stack.Screen
          // ▶ 여기서 FINAL_RESULT의 params 타입을 { diagnosisId: number }로 변경
          name={homeNavigations.FINAL_RESULT}
          component={FinalResultScreen}
          options={{
            headerTitle: '진단 결과',
          }}
        />
      </Stack.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
});

export default HomeStackNavigator;

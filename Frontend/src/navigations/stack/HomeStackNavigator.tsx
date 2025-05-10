import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StyleSheet, View} from 'react-native';
import {colors, homeNavigations} from '@/constants';
import HomeScreen from '@/screens/Home/HomeScreen';
import FaceSmileScreen from '@/screens/Home/FaceSmileScreen';
import FaceWinkScreen from '@/screens/Home/FaceWinkScreen';
import RecordScreen from '@/screens/Home/RecordScreen';
import LoadingScreen from '@/screens/Home/LoadingScreen';
import SelfDgsScreen from '@/screens/Home/SelfDgsScreen';
import MidResultScreen from '@/screens/Home/MidResultScreen';
import FinalResultScreen from '@/screens/Home/FinalResultScreen';
import VideoPlayerScreen from '@/screens/Home/VideoPlayerScreen';
import type {ImageSourcePropType} from 'react-native';

export type HomeStackParamList = {
  [homeNavigations.DIAGNOSE_HOME]: undefined;
  [homeNavigations.FACE_SMILE]: undefined;
  [homeNavigations.FACE_WINK]: undefined;
  [homeNavigations.RECORD]: undefined;
  [homeNavigations.LOADING]: undefined;
  [homeNavigations.MID_RESULT]: undefined;
  [homeNavigations.SELF_DGS]: undefined;
  [homeNavigations.FINAL_RESULT]: undefined;
  [homeNavigations.EXERCISE_LIST]: undefined;
  [homeNavigations.VIDEO_PLAYER]: {
    uri: string | number;
    thumbnail: ImageSourcePropType;
    videoId: string;
  };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();
function HomeStackNavigator() {
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
          name={homeNavigations.DIAGNOSE_HOME}
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
          name={homeNavigations.FACE_WINK}
          component={FaceWinkScreen}
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
          name={homeNavigations.FINAL_RESULT}
          component={FinalResultScreen}
          options={{
            headerTitle: '진단 결과',
          }}
        />
        <Stack.Screen
          name={homeNavigations.VIDEO_PLAYER}
          component={VideoPlayerScreen}
          options={{
            headerTitle: '',
            headerShown: false,
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

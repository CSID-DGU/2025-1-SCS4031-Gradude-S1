import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, homeNavigations} from '@/constants';
import HomeScreen from '@/screens/Home/HomeScreen';
import FaceSmileScreen from '@/screens/Home/FaceSmile';

export type HomeStackParamList = {
  [homeNavigations.MAIN_HOME]: undefined;
  [homeNavigations.FACE_SMILE]: undefined;
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
            headerBackVisible: false,
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

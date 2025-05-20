import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StyleSheet, View} from 'react-native';
import {colors, mapNavigations} from '@/constants';
import MapScreen from '@/screens/Map/MapScreen';

export type MapStackParamList = {
  [mapNavigations.MAP_HOME]: undefined;
};

const Stack = createNativeStackNavigator<MapStackParamList>();
function MapStackNavigator() {
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
          name={mapNavigations.MAP_HOME}
          component={MapScreen}
          options={{
            headerTitle: '',
            headerBackVisible: false,
            headerShown: false,
          }}
        />
        {/* <Stack.Screen
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
        /> */}
      </Stack.Navigator>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {flex: 1},
});

export default MapStackNavigator;

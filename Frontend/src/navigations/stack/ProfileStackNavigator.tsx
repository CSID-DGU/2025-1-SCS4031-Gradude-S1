import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StyleSheet, View} from 'react-native';
import {colors, profileNavigations} from '@/constants';
import ProfileScreen from '@/screens/Profile/ProfileScreen';
import InfoScreen from '@/screens/Profile/InfoScreen';

export type ProfileStackParamList = {
  [profileNavigations.PROFILE_HOME]: undefined;
  [profileNavigations.INFO]: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();
function ProfileStackNavigator() {
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
          name={profileNavigations.PROFILE_HOME}
          component={ProfileScreen}
          options={{
            headerTitle: '',
            headerBackVisible: false,
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={profileNavigations.INFO}
          component={InfoScreen}
          options={{
            headerTitle: '개인정보약관',
          }}
        />
      </Stack.Navigator>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {flex: 1},
});

export default ProfileStackNavigator;

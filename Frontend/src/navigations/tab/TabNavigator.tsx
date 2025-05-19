import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ProfileScreen from '@/screens/Profile/ProfileScreen';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors} from '@/constants';
import HomeStackNavigator from '../stack/HomeStackNavigator';
import MapStackNavigator from '../stack/MapStackNavigator';
import HealthStackNavigator from '../stack/HealthStackNavigator';

export const mainTabNavigations = {
  HOME: 'Home',
  MAP: 'Map',
  HEALTH: 'Health',
  PROFILE: 'Profile',
} as const;

export type MainTabParamList = {
  [mainTabNavigations.HOME]: undefined;
  [mainTabNavigations.MAP]: undefined;
  [mainTabNavigations.HEALTH]: undefined;
  [mainTabNavigations.PROFILE]: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string;

          if (route.name === mainTabNavigations.HOME) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === mainTabNavigations.MAP) {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === mainTabNavigations.HEALTH) {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === mainTabNavigations.PROFILE) {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.MAINBLUE,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}>
      <Tab.Screen
        name={mainTabNavigations.HOME}
        component={HomeStackNavigator}
        options={{tabBarLabel: '홈'}}
      />
      <Tab.Screen
        name={mainTabNavigations.MAP}
        component={MapStackNavigator}
        options={{tabBarLabel: '병원찾기'}}
      />
      <Tab.Screen
        name={mainTabNavigations.HEALTH}
        component={HealthStackNavigator}
        options={{tabBarLabel: '건강수첩'}}
      />
      <Tab.Screen
        name={mainTabNavigations.PROFILE}
        component={ProfileScreen}
        options={{tabBarLabel: '내정보'}}
      />
    </Tab.Navigator>
  );
}

export default TabNavigator;

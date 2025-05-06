import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '@/screens/Home/HomeScreen';
import ProfileScreen from '@/screens/Profile/ProfileScreen';
import MapScreen from '@/screens/Map/MapScreen';
import HealthScreen from '@/screens/Health/HealthScreen';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors, homeNavigations} from '@/constants';
import HomeStackNavigator from '../stack/HomeStackNavigator';

export type MainTabParamList = {
  Home: undefined;
  Map: undefined;
  Health: undefined;
  Profile: undefined;
};
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string;

          if (route.name === homeNavigations.MAIN_HOME) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Health') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.MAINBLUE, // 활성화된 탭 색
        tabBarInactiveTintColor: 'gray', // 비활성 탭 색
        headerShown: false,
      })}>
      <Tab.Screen
        name={homeNavigations.MAIN_HOME}
        component={HomeStackNavigator}
        options={{tabBarLabel: '홈'}}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{tabBarLabel: '병원찾기'}}
      />
      <Tab.Screen
        name="Health"
        component={HealthScreen}
        options={{tabBarLabel: '건강기록'}}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{tabBarLabel: '내정보'}}
      />
    </Tab.Navigator>
  );
}

export default TabNavigator;

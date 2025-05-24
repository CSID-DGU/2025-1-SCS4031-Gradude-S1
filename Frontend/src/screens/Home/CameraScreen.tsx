import React, {useCallback} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import RecordCamera from '@/components/home/RecordCamera';
import {HomeStackParamList} from '@/navigations/stack/HomeStackNavigator';
import {homeNavigations} from '@/constants';
import {
  mainTabNavigations,
  MainTabParamList,
} from '@/navigations/tab/TabNavigator';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {useFocusEffect} from '@react-navigation/native';

type CameraScreenProps = StackScreenProps<
  HomeStackParamList,
  typeof homeNavigations.CAMERA
>;

// 부모 탭 네비게이터 타입 — Home 탭을 가리키고 있습니다.
type ParentTabProp = BottomTabNavigationProp<
  MainTabParamList,
  typeof mainTabNavigations.HOME
>;

export default function CameraScreen({navigation}: CameraScreenProps) {
  // 화면이 포커스될 때 / 언포커스될 때 부모 탭바 옵션 토글
  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent<ParentTabProp>();
      parent?.setOptions({tabBarStyle: {display: 'none'}});

      return () => {
        parent?.setOptions({tabBarStyle: undefined});
      };
    }, [navigation]),
  );

  // 녹화 완료 후 uri를 받아서 다음 화면으로 이동
  const handleFinish = useCallback(
    (uri: string) =>
      navigation.navigate(homeNavigations.RECORD, {CameraUri: uri}),
    [navigation],
  );

  return <RecordCamera label="카메라 촬영" onFinish={handleFinish} />;
}

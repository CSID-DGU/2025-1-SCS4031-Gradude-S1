import React, {useCallback} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import RecordCamera from '@/components/home/RecordCamera';
import {HomeStackParamList} from '@/navigations/stack/HomeStackNavigator';
import {homeNavigations} from '@/constants';

type CameraScreenProps = StackScreenProps<
  HomeStackParamList,
  typeof homeNavigations.CAMERA
>;

export default function CameraScreen({navigation}: CameraScreenProps) {
  const handleFinish = useCallback(
    (uri: string) =>
      navigation.navigate(homeNavigations.RECORD, {CameraUri: uri}),
    [navigation],
  );

  return <RecordCamera label="카메라 촬영" onFinish={handleFinish} />;
}

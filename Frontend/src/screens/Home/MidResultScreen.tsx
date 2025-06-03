// src/screens/home/MidResultScreen.tsx
import React from 'react';
import {Linking, SafeAreaView, StyleSheet} from 'react-native';
import CautionCard from '@/components/home/MidResultCard/CautionCard';
import NormalCard from '@/components/home/MidResultCard/NormalCard';
import FaceDisCard from '@/components/home/MidResultCard/FaceDisCard';
import VoiceDisCard from '@/components/home/MidResultCard/VoiceDisCard';
import {colors, homeNavigations} from '@/constants';
import {StackScreenProps} from '@react-navigation/stack';
import {HomeStackParamList} from '@/navigations/stack/HomeStackNavigator';

type Props = StackScreenProps<
  HomeStackParamList,
  typeof homeNavigations.MID_RESULT
>;

export default function MidResultScreen({navigation, route}: Props) {
  // LoadingScreen 에서 넘겨준 facePrediction, speechPrediction을 받습니다.
  const {facePrediction, speechPrediction} = route.params;

  const handleCall119 = () => {
    const url = `tel:119`;
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        }
        console.warn('전화 걸기 기능을 지원하지 않는 디바이스입니다.');
      })
      .catch(err => console.error('An error occurred', err));
  };

  // 네 가지 경우에 따라 다른 컴포넌트 렌더링
  let ContentComponent = null;
  if (facePrediction && speechPrediction) {
    // 얼굴+음성 모두 이상 → CautionCard (응급 조치권장)
    ContentComponent = (
      <CautionCard
        onCallPress={handleCall119}
        onSelfPress={() => navigation.navigate(homeNavigations.SELF_DGS)}
      />
    );
  } else if (facePrediction && !speechPrediction) {
    // 얼굴 이상만 → FaceDisCard
    ContentComponent = (
      <FaceDisCard
        onCallPress={handleCall119}
        onSelfPress={() => navigation.navigate(homeNavigations.SELF_DGS)}
      />
    );
  } else if (!facePrediction && speechPrediction) {
    // 음성 이상만 → VoiceDisCard
    ContentComponent = (
      <VoiceDisCard
        onCallPress={handleCall119}
        onSelfPress={() => navigation.navigate(homeNavigations.SELF_DGS)}
      />
    );
  } else {
    // 둘 다 정상 → NormalCard (자가 진단 진행 페이지로 이동)
    ContentComponent = (
      <NormalCard
        onSelfPress={() => navigation.navigate(homeNavigations.SELF_DGS)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>{ContentComponent}</SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGRAY,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

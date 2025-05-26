import React from 'react';
import {Linking, SafeAreaView, StyleSheet} from 'react-native';
import CautionCard from '@/components/home/MidResultCard/CautionCard';
import NormalCard from '@/components/home/MidResultCard/NormalCard';
import {colors, homeNavigations} from '@/constants';
import FaceDisCard from '@/components/home/MidResultCard/FaceDisCard';
import VoiceDisCard from '@/components/home/MidResultCard/VoiceDisCard';

interface MidResultScreenProps {
  navigation: any;
}

function MidResultScreen({navigation}: MidResultScreenProps) {
  // TODO: 서버 연동 전, 4가지 버전에 따라 다름
  const isSuccess = false;

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

  return (
    <SafeAreaView style={styles.safeArea}>
      {isSuccess ? (
        <NormalCard
          onSelfPress={() => navigation.navigate(homeNavigations.SELF_DGS)}
        />
      ) : (
        <VoiceDisCard
          onCallPress={handleCall119}
          onSelfPress={() => navigation.navigate(homeNavigations.SELF_DGS)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.BACKGRAY,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MidResultScreen;

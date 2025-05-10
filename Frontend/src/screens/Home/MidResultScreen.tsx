import React from 'react';
import {Linking, SafeAreaView, StyleSheet} from 'react-native';
import CautionCard from '@/components/home/CautionCard';
import NormalCard from '@/components/home/NormalCard';
import {colors, homeNavigations} from '@/constants';

interface MidResultScreenProps {
  navigation: any;
}

function MidResultScreen({navigation}: MidResultScreenProps) {
  // 서버 연동 전, 임시 -> true: 정상, false: 위험
  const isSuccess = true;

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
        <CautionCard
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

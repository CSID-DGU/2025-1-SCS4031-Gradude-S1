import {colors} from '@/constants';
import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

interface FinalResutProps {
  // TODO : 진단 결과 연동
}

function FinalResultCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>
        안면 비대칭 분석 결과{'\n'}
        {'\n'} 안면 비대칭 수치: 80%{'\n'}왼쪽 입술과 눈꼬리가 약간 처진 형태로
        확인되었으며, 전체적인 얼굴 균형에서 미세한 비대칭이 관찰되었습니다.
        이러한 안면 비대칭은 일시적인 근육 피로나 습관의 영향일 수도 있으나,
        {'\n'} {'\n'}
        특정 신경학적 이상이나 뇌졸중 초기 증상과 연관될 가능성도 배제할 수
        없습니다. 따라서 보다 정확한 판단을 위해 전문 의료진의 추가 상담 및 정밀
        검진을 권장합니다.{'\n'}
        {'\n'}
        위험도 85%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.WHITE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: colors.BLACK,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
    elevation: 4,
  },
  text: {lineHeight: 20, fontSize: 16},
});

export default FinalResultCard;

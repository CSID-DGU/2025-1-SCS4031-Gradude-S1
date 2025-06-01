import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '@/constants';
import type {HospitalSummaryDto} from '@/types/hospital';

interface Props {
  item: HospitalSummaryDto;
}

export default function HospitalListCard({item}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.distance}>{item.distance.toFixed(1)}km</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: colors.LIGHTGRAY,
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    flex: 1, // 가능한 수평 공간을 다 차지
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  distance: {
    fontSize: 14,
    color: colors.MAINBLUE,
  },
});

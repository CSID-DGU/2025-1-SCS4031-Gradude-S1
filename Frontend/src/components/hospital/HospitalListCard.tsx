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
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#EEE',
  },
  name: {
    fontSize: 16,
    color: colors.BLACK,
  },
  distance: {
    fontSize: 14,
    color: colors.GRAY,
  },
});

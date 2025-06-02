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
    width: '90%',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderColor: colors.LIGHTGRAY,
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  distance: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.MAINBLUE,
  },
});

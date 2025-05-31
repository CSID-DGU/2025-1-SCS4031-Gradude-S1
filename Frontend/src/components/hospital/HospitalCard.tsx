import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors} from '@/constants';
import {HospitalDetailDto} from '@/types/hospital';

interface HospitalCardProps {
  data: HospitalDetailDto;
}

export default function HospitalCard({data}: HospitalCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {data.name}
        </Text>
        <Text style={styles.distance}>{data.distance.toFixed(1)}km</Text>
      </View>

      <Text style={styles.address} numberOfLines={1} ellipsizeMode="tail">
        {data.address}
      </Text>

      <View style={styles.infoRow}>
        <Ionicons name="call" size={14} color={colors.GRAY} />
        <Text style={styles.infoText} numberOfLines={1} ellipsizeMode="tail">
          {data.phoneNumber}
        </Text>
        <Ionicons
          name="time"
          size={14}
          color={colors.GRAY}
          style={styles.iconSpacing}
        />
        <Text
          style={[
            styles.infoText,
            data.open ? styles.openText : styles.closedText,
          ]}>
          {data.open ? '진료 중' : '진료 마감'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minWidth: 280,
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: colors.WHITE,
    borderRadius: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.BLACK,
    marginRight: 8,
  },
  distance: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.MAINBLUE,
  },
  address: {
    fontSize: 13,
    color: colors.BLACK,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 4,
    marginRight: 12,
    fontSize: 13,
    color: colors.BLACK,
  },
  iconSpacing: {
    marginLeft: 0,
  },
  openText: {
    color: colors.GREEN,
    fontWeight: 'bold',
  },
  closedText: {
    color: colors.RED,
    fontWeight: 'bold',
  },
});

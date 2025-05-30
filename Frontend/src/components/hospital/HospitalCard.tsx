import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors} from '@/constants';
import {useHospitalMarker} from '@/hooks/queries/useHospitals';

interface HospitalMarkerCardProps {
  hospitalId: string;
  userLatitude: number;
  userLongitude: number;
}

export default function HospitalCard({
  hospitalId,
  userLatitude,
  userLongitude,
}: HospitalMarkerCardProps) {
  const {data, isLoading, isError} = useHospitalMarker(
    hospitalId,
    userLatitude,
    userLongitude,
  );

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.MAINBLUE} />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>병원 정보를 불러오지 못했습니다.</Text>
      </View>
    );
  }

  // data: HospitalDetail
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{data.name}</Text>
        <Text style={styles.distance}>{data.distance.toFixed(1)}km</Text>
      </View>
      <Text style={styles.address}>{data.address}</Text>
      <View style={styles.infoRow}>
        <Ionicons name="call" size={16} color={colors.GRAY} />
        <Text style={styles.infoText}>{data.phoneNumber}</Text>
        <Ionicons
          name="time"
          size={16}
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
  loaderContainer: {
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: colors.RED,
  },
  card: {
    height: 110,
    backgroundColor: colors.WHITE,
    justifyContent: 'space-evenly',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.BLACK,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  distance: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.MAINBLUE,
  },
  address: {
    fontSize: 14,
    color: colors.BLACK,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 4,
    marginRight: 16,
    fontSize: 14,
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

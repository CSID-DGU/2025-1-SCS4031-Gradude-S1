import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors} from '@/constants';
import type {Hospital, OpeningHours} from '@/types/hospital';

function getTodaySchedule(openingHours: OpeningHours): string {
  const dayKeys: Array<keyof OpeningHours> = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  const todayIndex = new Date().getDay();
  const key = dayKeys[todayIndex];
  return openingHours[key];
}

const korDays = ['일', '월', '화', '수', '목', '금', '토'] as const;

type Props = {hospital: Hospital};

function HospitalDetail({hospital}: Props) {
  const {latitude, longitude, phoneNumber, openingHours} = hospital;
  const todayIndex = new Date().getDay();
  const todaySchedule = getTodaySchedule(openingHours);

  const openDirections = () => {
    const lat = hospital.latitude;
    const lng = hospital.longitude;
    const label = encodeURIComponent(hospital.name);

    const googleUrl = `comgooglemaps://?daddr=${lat},${lng}&q=${label}&directionsmode=driving`;
    const appleUrl = `http://maps.apple.com/?daddr=${lat},${lng}&q=${label}`;

    Linking.canOpenURL(googleUrl)
      .then(supported => {
        if (supported) {
          // Google Maps 앱이 설치되어 있으면 구글맵으로 이동
          Linking.openURL(googleUrl);
        } else {
          // 아니면 Apple Maps로 폴백
          Linking.openURL(appleUrl);
        }
      })
      .catch(err => console.warn('경로 열기 실패', err));
  };

  // TODO : 응급실 전화 설정
  const callEmergency = () => {
    const digits = phoneNumber.replace(/[^0-9]/g, '');
    const telUrl = `tel:${digits}`;
    Linking.canOpenURL(telUrl)
      .then(supported => supported && Linking.openURL(telUrl))
      .catch(err => console.warn('전화 걸기 실패', err));
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.name}>{hospital.name}</Text>
        <Text style={styles.distance}>{hospital.distance}km</Text>
      </View>

      <Text style={styles.address}>{hospital.address}</Text>

      <View style={styles.row}>
        <Ionicons name="call" size={16} color={colors.GRAY} />
        <Text style={styles.text}>{phoneNumber}</Text>
      </View>

      <View style={[styles.row, {marginTop: 8, marginBottom: 16}]}>
        <Ionicons name="time" size={16} color={colors.GRAY} />
        <Text style={styles.text}>
          {korDays[todayIndex]}요일: {todaySchedule}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.btn, {backgroundColor: colors.MAINBLUE}]}
        onPress={openDirections}>
        <Ionicons
          name="location"
          size={25}
          color={colors.WHITE}
          style={{marginRight: 8}}
        />
        <Text style={styles.btnText}>지도에서 경로 탐색</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, {backgroundColor: colors.RED}]}
        onPress={callEmergency}>
        <Ionicons
          name="call"
          size={25}
          color={colors.WHITE}
          style={{marginRight: 8}}
        />
        <Text style={styles.btnText}>응급실 전화걸기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 36,
    marginBottom: 30,
    paddingHorizontal: 16,
    backgroundColor: colors.WHITE,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    flex: 1,
    fontSize: 25,
    fontWeight: 'bold',
    color: colors.MAINBLUE,
    marginBottom: 4,
  },
  distance: {
    fontSize: 18,
    color: colors.BLACK,
  },
  address: {
    fontSize: 18,
    color: colors.BLACK,
    marginBottom: 12,
  },
  text: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.BLACK,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 30,
    marginTop: 12,
    width: '100%',
    justifyContent: 'center',
  },
  btnText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default HospitalDetail;

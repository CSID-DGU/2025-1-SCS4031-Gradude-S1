import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors} from '@/constants';
import {useHospitalDetail} from '@/hooks/queries/useHospitals';
import type {HospitalDetailDto, OpeningHourDto} from '@/types/hospital';

interface Props {
  hospitalId: string;
  userLatitude: number;
  userLongitude: number;
}

// 요일 키 순서 및 한글 요일 배열
const dayKeys: Array<keyof OpeningHourDto> = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];
const korDays = ['일', '월', '화', '수', '목', '금', '토'] as const;

export default function HospitalDetail({
  hospitalId,
  userLatitude,
  userLongitude,
}: Props) {
  const {data, isLoading, isError} = useHospitalDetail(
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
        <Text style={styles.errorText}>병원 정보를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  // DTO에서 데이터 분해
  const {
    name,
    distance,
    address,
    phoneNumber,
    openingHour,
    open,
    latitude: lat,
    longitude: lng,
  } = data as HospitalDetailDto;

  const openDirections = () => {
    const label = encodeURIComponent(name);
    const googleUrl = `comgooglemaps://?daddr=${lat},${lng}&q=${label}&directionsmode=driving`;
    const appleUrl = `http://maps.apple.com/?daddr=${lat},${lng}&q=${label}`;
    Linking.canOpenURL(googleUrl)
      .then(supported =>
        supported ? Linking.openURL(googleUrl) : Linking.openURL(appleUrl),
      )
      .catch(err => console.warn('경로 열기 실패', err));
  };

  const callEmergency = () => {
    const digits = phoneNumber.replace(/[^0-9]/g, '');
    const telUrl = `tel:${digits}`;
    Linking.canOpenURL(telUrl)
      .then(supported => supported && Linking.openURL(telUrl))
      .catch(err => console.warn('전화 걸기 실패', err));
  };

  return (
    // SafeAreaView로 최상단 노치 영역까지 흰색 배경을 채워줍니다.
    <View style={styles.safeArea}>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.distance}>{distance.toFixed(1)}km</Text>
        </View>

        <Text style={styles.address}>{address}</Text>

        <View style={styles.row}>
          <Ionicons name="call" size={16} color={colors.GRAY} />
          <Text style={styles.infoText}>{phoneNumber}</Text>
          <Ionicons
            name="time"
            size={16}
            color={colors.GRAY}
            style={styles.iconSpacing}
          />
          <Text
            style={[
              styles.infoText,
              open ? styles.openText : styles.closedText,
            ]}>
            {open ? '진료 중' : '진료 마감'}
          </Text>
        </View>

        <View style={{marginTop: 16, marginBottom: 16}}>
          {dayKeys.map((day, idx) => (
            <View key={day} style={[styles.row, idx > 0 && {marginTop: 4}]}>
              <Ionicons name="time" size={16} color={colors.GRAY} />
              <Text style={styles.infoText}>
                {korDays[idx]}요일:{' '}
                {openingHour[day] !== null && openingHour[day] !== ''
                  ? openingHour[day]
                  : '영업 종료'}
              </Text>
            </View>
          ))}
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
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.WHITE, // 모달 최상단까지 흰색으로 채움
  },
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
    backgroundColor: colors.WHITE,
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  distance: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.MAINBLUE,
  },
  address: {
    marginVertical: 10,
    fontSize: 18,
    color: colors.BLACK,
  },
  infoText: {
    marginLeft: 8,
    marginRight: 16,
    fontSize: 16,
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
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 30,
    marginTop: 12,
    justifyContent: 'center',
  },
  btnText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
});

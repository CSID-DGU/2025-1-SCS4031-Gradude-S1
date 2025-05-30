// src/screens/MapScreen.tsx
import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  TextInput,
  FlatList,
  Pressable,
  Alert,
} from 'react-native';
import MapView, {
  Callout,
  Marker,
  PROVIDER_GOOGLE,
  MapPressEvent,
  MarkerPressEvent,
  Region,
} from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors} from '@/constants';
import ModalWrapper from '@/components/commons/ModalWrapper';
import HospitalListCard from '@/components/hospital/HospitalListCard';
import {HospitalMarkerDto, HospitalSummaryDto} from '@/types/hospital';
import {
  useHospitalMarkers,
  useNearestHospitals,
  useHospitalSearch,
} from '@/hooks/queries/useHospitals';
import useUserLocation from '@/hooks/useUserLocation';
import usePermission from '@/hooks/usePermisson';
import HospitalDetail from '@/components/hospital/HospitalDetail';
import HospitalCard from '@/components/hospital/HospitalCard';

export default function MapScreen() {
  const mapRef = useRef<MapView | null>(null);
  const markerRefs = useRef<
    Record<string, {showCallout(): void; hideCallout(): void}>
  >({});

  // 사용자 위치 훅
  const {latitude, longitude, isUserLocationError} = useUserLocation();
  usePermission('LOCATION');

  // 초기 region 설정
  const [region, setRegion] = useState<Region | null>(null);
  useEffect(() => {
    if (!isUserLocationError && latitude != null && longitude != null) {
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  }, [latitude, longitude, isUserLocationError]);

  // bounds 계산
  const bounds = region
    ? {
        neLatitude: region.latitude + region.latitudeDelta / 2,
        neLongitude: region.longitude + region.longitudeDelta / 2,
        swLatitude: region.latitude - region.latitudeDelta / 2,
        swLongitude: region.longitude - region.longitudeDelta / 2,
      }
    : undefined;

  // 마커 훅
  const {
    data: markers = [],
    isLoading: loadingMarkers,
    isError: markersError,
    error: markersErrorObj,
  } = useHospitalMarkers(bounds);

  // 디버그 로그
  useEffect(() => {
    console.log('[MapScreen] bounds =', bounds);

    if (markersError && markersErrorObj) {
      console.log('[MapScreen] markers fetch error =', markersErrorObj);
      console.log(
        '[MapScreen] status code =',
        (markersErrorObj as any).response?.status,
      );
    }
  }, [bounds, markersError, markersErrorObj]);

  // 리스트용 훅
  const {data: nearest = [], isLoading: loadingNearest} = useNearestHospitals(
    latitude,
    longitude,
  );
  const [searchTerm, setSearchTerm] = useState('');
  const {data: searched = [], isLoading: loadingSearch} = useHospitalSearch(
    latitude,
    longitude,
    searchTerm,
  );
  const listData: HospitalSummaryDto[] =
    searchTerm.length >= 2 ? searched : nearest;

  // 모달 상태
  const [listVisible, setListVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);

  // 내 위치 버튼
  const handlePressUserLocation = () => {
    if (isUserLocationError) {
      Alert.alert('위치 정보를 가져올 수 없습니다.');
      return;
    }
    mapRef.current?.animateCamera({center: {latitude, longitude}, zoom: 14});
  };

  // 마커/지도 핸들러
  const handleMapPress = (_: MapPressEvent) =>
    Object.values(markerRefs.current).forEach(ref => ref.hideCallout());

  const handleMarkerPress = (h: HospitalMarkerDto) => (_: MarkerPressEvent) => {
    mapRef.current?.animateCamera({
      center: {latitude: h.latitude, longitude: h.longitude},
      zoom: 15,
    });
    Object.entries(markerRefs.current).forEach(([id, ref]) => {
      if (id !== h.hospitalId.toString()) ref.hideCallout();
    });
    markerRefs.current[h.hospitalId.toString()]?.showCallout();
  };

  const openDetail = (h: {hospitalId: string | number}) => {
    setDetailId(h.hospitalId.toString());
    setDetailVisible(true);
  };

  // 로딩/에러 처리
  if (isUserLocationError)
    return (
      <View style={styles.center}>
        <Text>위치 정보를 가져올 수 없습니다.</Text>
      </View>
    );
  if (!region)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.MAINBLUE} />
      </View>
    );

  return (
    <>
      <MapView
        ref={mapRef}
        style={styles.container}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        showsUserLocation
        followsUserLocation
        onPress={handleMapPress}
        onRegionChangeComplete={r => setRegion(r)}>
        {!loadingMarkers &&
          markers.map(h => (
            <Marker
              key={h.hospitalId.toString()}
              coordinate={{latitude: h.latitude, longitude: h.longitude}}
              pinColor={h.strokeCenter ? colors.RED : colors.MAINBLUE}
              ref={ref => {
                if (ref) markerRefs.current[h.hospitalId.toString()] = ref;
              }}
              onPress={handleMarkerPress(h)}>
              <Callout tooltip onPress={() => openDetail(h)}>
                <HospitalCard
                  hospitalId={h.hospitalId.toString()}
                  userLatitude={latitude}
                  userLongitude={longitude}
                />
              </Callout>
            </Marker>
          ))}
      </MapView>

      {/* 검색/리스트 버튼 */}
      <TouchableOpacity
        style={styles.searchBtn}
        onPress={() => setListVisible(true)}>
        <Text style={styles.searchText}>병원 리스트 / 검색</Text>
        <Ionicons name="search" size={20} color={colors.GRAY} />
      </TouchableOpacity>

      {/* 내 위치 버튼 */}
      <View style={styles.buttonList}>
        <Pressable style={styles.mapButton} onPress={handlePressUserLocation}>
          <Ionicons name="locate-outline" size={25} color={colors.WHITE} />
        </Pressable>
      </View>

      {/* 리스트/검색 모달 */}
      <ModalWrapper
        visible={listVisible}
        onClose={() => {
          setListVisible(false);
          setSearchTerm('');
        }}>
        <View style={{padding: 16}}>
          <TextInput
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="병원명 검색 (2자 이상)"
            style={styles.searchInput}
          />
          {(loadingNearest && !searchTerm) ||
          (loadingSearch && !!searchTerm) ? (
            <ActivityIndicator size="large" color={colors.MAINBLUE} />
          ) : (
            <FlatList
              data={listData}
              keyExtractor={item => item.hospitalId.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.listItem}
                  onPress={() => {
                    setListVisible(false);
                    mapRef.current?.animateCamera({
                      center: {
                        latitude: item.latitude,
                        longitude: item.longitude,
                      },
                      zoom: 15,
                    });
                    setTimeout(
                      () =>
                        markerRefs.current[
                          item.hospitalId.toString()
                        ]?.showCallout(),
                      500,
                    );
                  }}>
                  <HospitalListCard item={item} />
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </ModalWrapper>

      {/* 마커 상세 모달 */}
      <ModalWrapper
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}>
        {detailId && (
          <HospitalDetail
            hospitalId={detailId}
            userLatitude={latitude}
            userLongitude={longitude}
          />
        )}
      </ModalWrapper>
    </>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  searchBtn: {
    position: 'absolute',
    top: 70,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.WHITE,
    padding: 12,
    borderRadius: 25,
    elevation: 2,
    shadowColor: colors.GRAY,
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.3,
  },
  searchText: {fontSize: 16, fontWeight: 'bold', color: colors.GRAY},
  searchInput: {
    borderWidth: 1,
    borderColor: colors.GRAY,
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  mapButton: {
    backgroundColor: colors.MAINBLUE,
    marginVertical: 5,
    height: 48,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    shadowColor: colors.GRAY,
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.5,
    elevation: 2,
  },
  buttonList: {
    position: 'absolute',
    bottom: 30,
    right: 15,
    alignItems: 'center',
  },
});

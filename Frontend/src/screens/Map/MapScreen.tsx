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
  Keyboard,
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
import ModalWrapper from '@/components/commons/ModalWrapper';

import {useQueries} from '@tanstack/react-query';
import {fetchHospitalMarker} from '@/api/hospitals';

export default function MapScreen() {
  const mapRef = useRef<MapView | null>(null);
  const markerRefs = useRef<
    Record<string, {showCallout(): void; hideCallout(): void}>
  >({});

  /* 1) 사용자 위치 가져오기 */
  const {latitude, longitude, isUserLocationError} = useUserLocation();
  usePermission('LOCATION');

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

  const bounds =
    region != null
      ? {
          neLatitude: region.latitude + region.latitudeDelta / 2,
          neLongitude: region.longitude + region.longitudeDelta / 2,
          swLatitude: region.latitude - region.latitudeDelta / 2,
          swLongitude: region.longitude - region.longitudeDelta / 2,
        }
      : undefined;

  /* 2) 병원 마커 및 근처 병원/검색 결과 조회 */
  const {data: markers = [], isLoading: loadingMarkers} =
    useHospitalMarkers(bounds);

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
  // 검색어가 2자 이상일 때는 검색 결과, 그렇지 않으면 nearest 목록
  const listData: HospitalSummaryDto[] =
    searchTerm.length >= 2 ? searched : nearest;

  /* 3) 입력창 포커스/리스트 표시 상태, 상세 모달 상태 */
  const [listVisible, setListVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);

  /* 4) 각 마커별 상세 데이터 미리 fetch (useQueries) */
  const hospitalDetailQueries = useQueries({
    queries:
      region != null && latitude != null && longitude != null
        ? markers.map(h => ({
            queryKey: ['hospitalMarker', h.hospitalId, latitude, longitude],
            queryFn: () =>
              fetchHospitalMarker(
                h.hospitalId.toString(),
                latitude as number,
                longitude as number,
              ),
            enabled: latitude != null && longitude != null,
          }))
        : [],
  });

  /* 위치 정보 가져오기 실패 처리 */
  if (isUserLocationError) {
    return (
      <View style={styles.center}>
        <Text>위치 정보를 가져올 수 없습니다.</Text>
      </View>
    );
  }
  if (!region) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.MAINBLUE} />
      </View>
    );
  }

  /* 내 위치 버튼 클릭 시 */
  const handlePressUserLocation = () => {
    if (isUserLocationError) {
      Alert.alert('위치 정보를 가져올 수 없습니다.');
      return;
    }
    mapRef.current?.animateCamera(
      {center: {latitude, longitude}, zoom: 14},
      {duration: 300},
    );
  };

  /* 지도를 눌렀을 때 모든 콜아웃 닫기 + 키보드 내리기 */
  const handleMapPress = (_: MapPressEvent) => {
    Object.values(markerRefs.current).forEach(ref => ref.hideCallout());
    Keyboard.dismiss();
  };

  /* 마커 클릭 시 해당 마커 카메라 이동 + 콜아웃 열기 */
  const handleMarkerPress = (h: HospitalMarkerDto) => (_: MarkerPressEvent) => {
    mapRef.current?.animateCamera(
      {
        center: {latitude: h.latitude, longitude: h.longitude},
        zoom: 15,
      },
      {duration: 0},
    );

    Object.entries(markerRefs.current).forEach(([id, ref]) => {
      if (id !== h.hospitalId.toString()) {
        ref.hideCallout();
      }
    });

    requestAnimationFrame(() => {
      markerRefs.current[h.hospitalId.toString()]?.showCallout();
    });
  };

  //   const handleMarkerPress = (h: HospitalMarkerDto) => (_: MarkerPressEvent) => {
  //
  //   mapRef.current?.animateCamera(
  //     {
  //       center: { latitude: h.latitude, longitude: h.longitude },
  //       zoom: 15,
  //     },
  //     { duration: 300 },
  //   );

  //
  //   Object.entries(markerRefs.current).forEach(([id, ref]) => {
  //     if (id !== h.hospitalId.toString()) {
  //       ref.hideCallout();
  //     }
  //   });

  //
  //   setTimeout(() => {
  //     markerRefs.current[h.hospitalId.toString()]?.showCallout();
  //   }, 100);
  // };

  /* 콜아웃 눌렀을 때 상세 모달 열기 */
  const openDetail = (h: {hospitalId: string | number}) => {
    setDetailId(h.hospitalId.toString());
    setDetailVisible(true);
  };

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
        {/* 실제 병원 마커들 */}
        {!loadingMarkers &&
          markers.map((h, i) => {
            const detailQuery = hospitalDetailQueries[i];
            return (
              <Marker
                key={h.hospitalId.toString()}
                coordinate={{latitude: h.latitude, longitude: h.longitude}}
                pinColor={h.strokeCenter ? colors.RED : colors.MAINBLUE}
                ref={ref => {
                  if (ref) {
                    markerRefs.current[h.hospitalId.toString()] = ref;
                  }
                }}
                onPress={handleMarkerPress(h)}>
                <Callout onPress={() => openDetail(h)} tooltip={true}>
                  {detailQuery?.isLoading && (
                    <ActivityIndicator size="small" color={colors.MAINBLUE} />
                  )}
                  {detailQuery?.isError && (
                    <Text style={styles.errorText}>
                      정보를 불러올 수 없습니다.
                    </Text>
                  )}
                  {detailQuery?.data && (
                    <HospitalCard data={detailQuery.data} />
                  )}
                </Callout>
              </Marker>
            );
          })}
      </MapView>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Ionicons
            name="search"
            size={18}
            color={colors.GRAY}
            style={{marginLeft: 8}}
          />
          <TextInput
            value={searchTerm}
            onChangeText={text => {
              setSearchTerm(text);
              if (!listVisible) setListVisible(true);
            }}
            placeholder="병원 리스트 / 검색"
            style={styles.searchTextInput}
            returnKeyType="search"
            onFocus={() => setListVisible(true)}
          />

          <TouchableOpacity
            onPress={() => {
              setSearchTerm('');
              setListVisible(false);
              Keyboard.dismiss();
            }}
            style={styles.clearIcon}>
            <Ionicons name="close" size={18} color={colors.GRAY} />
          </TouchableOpacity>
        </View>
      </View>

      {listVisible && (
        <View style={styles.listContainer}>
          {(loadingNearest && !searchTerm) ||
          (loadingSearch && !!searchTerm) ? (
            <ActivityIndicator
              size="large"
              color={colors.MAINBLUE}
              style={{marginTop: 16}}
            />
          ) : (
            <FlatList
              data={listData}
              keyExtractor={item => item.hospitalId.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.listItem}
                  onPress={() => {
                    setListVisible(false);
                    mapRef.current?.animateCamera(
                      {
                        center: {
                          latitude: item.latitude,
                          longitude: item.longitude,
                        },
                        zoom: 15,
                      },
                      {duration: 300},
                    );
                    setTimeout(
                      () =>
                        markerRefs.current[
                          item.hospitalId.toString()
                        ]?.showCallout(),
                      500,
                    );
                    Keyboard.dismiss();
                  }}>
                  <HospitalListCard item={item} />
                </TouchableOpacity>
              )}
              style={{maxHeight: 350}}
            />
          )}
        </View>
      )}

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.markerColor, {backgroundColor: colors.RED}]} />
          <Text style={styles.legendText}>뇌졸중 전문 센터</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.markerColor, {backgroundColor: colors.MAINBLUE}]}
          />
          <Text style={styles.legendText}>일반병원</Text>
        </View>
      </View>

      <View style={styles.buttonList}>
        <Pressable style={styles.mapButton} onPress={handlePressUserLocation}>
          <Ionicons name="locate-outline" size={25} color={colors.WHITE} />
        </Pressable>
      </View>

      <ModalWrapper
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}>
        {detailId && (
          <HospitalDetail
            hospitalId={detailId}
            userLatitude={latitude as number}
            userLongitude={longitude as number}
          />
        )}
      </ModalWrapper>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchContainer: {
    position: 'absolute',
    top: 70,
    left: 20,
    right: 20,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    borderRadius: 20,
    height: 40,
    paddingHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  searchTextInput: {
    flex: 1,
    height: '100%',
    marginLeft: 6,
    fontSize: 14,
    paddingVertical: 0,
  },
  clearIcon: {
    paddingHorizontal: 8,
  },

  /* ========= 검색 리스트 박스 ========= */
  listContainer: {
    position: 'absolute',
    top: 70 + 40 + 8,
    left: 20,
    right: 20,
    backgroundColor: colors.WHITE,
    borderRadius: 12,
    shadowColor: colors.LIGHTGRAY,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: 350,
  },
  listItem: {},

  legendContainer: {
    position: 'absolute',
    bottom: 110,
    right: 15,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  markerColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: colors.BLACK,
  },

  mapButton: {
    backgroundColor: colors.MAINBLUE,
    marginVertical: 5,
    height: 48,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
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

  errorText: {
    fontSize: 14,
    color: colors.RED,
    textAlign: 'center',
  },
});

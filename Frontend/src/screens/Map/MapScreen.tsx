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
import usePermission from '@/hooks/usePermission';
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
  // TODO: 로그인 문제 해결 되면, 위치 허가 앱 초기 진입으로 빼기
  // MAIN_HOME으로
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

  const listData: HospitalSummaryDto[] =
    searchTerm.length >= 2 ? searched : nearest;

  /* 3) 입력창 포커스/리스트 표시 상태, 상세 모달 상태 */
  const [listVisible, setListVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);

  /* 4) 각 마커별 상세 데이터 미리 fetch (useQueries) */
  const detailQueries = useQueries({
    queries: markers.map(({hospitalId}) => ({
      queryKey: ['hospitalMarker', hospitalId, latitude, longitude],
      queryFn: () =>
        fetchHospitalMarker(String(hospitalId), latitude!, longitude!),
      enabled: !!latitude && !!longitude,
      staleTime: 1000 * 60 * 5,
    })),
  });
  const detailMap = Object.fromEntries(
    detailQueries.map((q, idx) => [markers[idx].hospitalId, q]),
  );

  /* 콜아웃을 열기 위한 대기 ID */
  const [pendingCalloutId, setPendingCalloutId] = useState<string | null>(null);

  /* 위치 정보 가져오기 실패 시 */
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
    if (isUserLocationError || !mapRef.current) {
      Alert.alert('위치 정보를 가져올 수 없습니다.');
      return;
    }
    mapRef.current.animateCamera(
      {center: {latitude, longitude}, zoom: 14},
      {duration: 300},
    );
  };

  /* 지도를 누르면 모든 콜아웃 닫기 + 키보드 내리기 */
  const handleMapPress = (_: MapPressEvent) => {
    Object.values(markerRefs.current).forEach(ref => {
      try {
        ref.hideCallout();
      } catch {
        // 무시
      }
    });
    Keyboard.dismiss();
  };

  /* 마커 클릭 시 카메라 이동 + 콜아웃 열기 (fallback: 일정 시간 뒤 강제 showCallout) */
  const handleMarkerPress = (h: HospitalMarkerDto) => (_: MarkerPressEvent) => {
    // 1) 다른 콜아웃 숨기기
    Object.entries(markerRefs.current).forEach(([id, ref]) => {
      if (id !== h.hospitalId.toString()) {
        try {
          ref.hideCallout();
        } catch {}
      }
    });

    // 2) pending ID와 로컬 캡처된 ID 생성
    const idStr = h.hospitalId.toString();
    setPendingCalloutId(idStr);

    // 3) 카메라 이동
    mapRef.current?.animateCamera(
      {
        center: {latitude: h.latitude, longitude: h.longitude},
        zoom: 15,
      },
      {duration: 300},
    );

    // 4) fallback: animateCamera 후 350ms 뒤에 강제 showCallout
    setTimeout(() => {
      const ref = markerRefs.current[idStr];
      if (ref) {
        ref.showCallout();
        setPendingCalloutId(null);
      }
    }, 350);
  };

  /* 리스트 클릭 시 카메라 이동 + 콜아웃 열기 (fallback) */
  const handleListItemPress = (item: HospitalSummaryDto) => {
    setListVisible(false);
    const idStr = item.hospitalId.toString();
    setPendingCalloutId(idStr);

    mapRef.current?.animateCamera(
      {
        center: {latitude: item.latitude, longitude: item.longitude},
        zoom: 15,
      },
      {duration: 300},
    );

    setTimeout(() => {
      const ref = markerRefs.current[idStr];
      if (ref) {
        ref.showCallout();
        setPendingCalloutId(null);
      }
    }, 450);

    Keyboard.dismiss();
  };

  /* 영역 변경 완료 시 (onRegionChangeComplete에서 콜아웃 시도) */
  const onRegionChangeComplete = (newRegion: Region) => {
    setRegion(newRegion);

    if (pendingCalloutId) {
      const ref = markerRefs.current[pendingCalloutId];
      if (ref) {
        ref.showCallout();
      }
      setPendingCalloutId(null);
    }
  };

  /* 콜아웃 클릭 시 상세 모달 열기 */
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
        onRegionChangeComplete={onRegionChangeComplete}>
        {!loadingMarkers &&
          markers.map(h => {
            const detailQuery = detailMap[h.hospitalId];
            const idStr = h.hospitalId.toString();

            return (
              <Marker
                key={idStr}
                coordinate={{latitude: h.latitude, longitude: h.longitude}}
                pinColor={h.strokeCenter ? colors.RED : colors.MAINBLUE}
                tracksViewChanges={false} // 깜빡임 방지
                ref={ref => {
                  if (ref) {
                    markerRefs.current[idStr] = ref;
                  }
                }}
                onPress={handleMarkerPress(h)}>
                <Callout onPress={() => openDetail(h)} tooltip>
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

      {/* 검색창 / 리스트 */}
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
                  onPress={() => handleListItemPress(item)}>
                  <HospitalListCard item={item} />
                </TouchableOpacity>
              )}
              style={{maxHeight: 350}}
            />
          )}
        </View>
      )}

      {/* 범례 */}
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

      {/* 내 위치 버튼 */}
      <View style={styles.buttonList}>
        <Pressable style={styles.mapButton} onPress={handlePressUserLocation}>
          <Ionicons name="locate-outline" size={25} color={colors.WHITE} />
        </Pressable>
      </View>

      {/* 상세 모달 */}
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
    height: 55,
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
    fontSize: 16,
    paddingVertical: 6,
  },
  clearIcon: {
    paddingHorizontal: 8,
  },
  listContainer: {
    position: 'absolute',
    top: 70 + 55 + 8,
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
  listItem: {
    alignItems: 'center',
  },
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
    zIndex: 1,
  },
  buttonList: {
    position: 'absolute',
    bottom: 30,
    right: 15,
    alignItems: 'center',
    zIndex: 5,
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
  errorText: {
    fontSize: 14,
    color: colors.RED,
    textAlign: 'center',
  },
});

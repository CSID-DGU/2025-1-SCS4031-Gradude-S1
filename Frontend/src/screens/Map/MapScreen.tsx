import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, {
  Callout,
  Marker,
  PROVIDER_GOOGLE,
  MapPressEvent,
  MarkerPressEvent,
} from 'react-native-maps';
import useUserLocation from '@/hooks/useUserLocation';
import {colors} from '@/constants';
import usePermission from '@/hooks/usePermisson';
import Ionicons from 'react-native-vector-icons/Ionicons';
import hospitals from '@/data/hospitals.json';
import HospitalCard from '@/components/hospital/HospitalCard';
import HospitalDetail from '@/components/hospital/HospitalDetail';
import ModalWrapper from '@/components/commons/ModalWrapper';
import {MainTabParamList} from '@/navigations/tab/TabNavigator';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {StackNavigationProp} from '@react-navigation/stack';
import {MapStackParamList} from '@/navigations/stack/MapStackNavigator';

type Navigation = CompositeNavigationProp<
  StackNavigationProp<MapStackParamList>,
  BottomTabNavigationProp<MainTabParamList>
>;

interface MarkerRef {
  showCallout: () => void;
  hideCallout: () => void;
}

export default function MapScreen() {
  const navigation = useNavigation<Navigation>();
  const mapRef = useRef<MapView | null>(null);

  const markerRefs = useRef<Record<string, MarkerRef | null>>({});
  const {userLocation, isUserLocationError} = useUserLocation();
  const [openId, setOpenId] = useState<string | null>(null);
  usePermission('LOCATION');
  useEffect(() => {
    setTimeout(() => {
      mapRef.current?.animateCamera({
        center: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        },
        zoom: 14,
      });
    }, 500);
  }, [userLocation]);
  const handlePressUserLocation = () => {
    if (isUserLocationError) {
      Alert.alert('위치 정보를 가져올 수 없습니다.');
      return;
    }
    mapRef.current?.animateCamera({
      center: {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      },
      zoom: 14,
    });

    if (openId) {
      markerRefs.current[openId]?.hideCallout();
      setOpenId(null);
    }
  };
  const handleMapPress = (e: MapPressEvent) => {
    if (openId) {
      markerRefs.current[openId]?.hideCallout();
      setOpenId(null);
    }
  };

  const handleMarkerPress =
    (h: (typeof hospitals)[0]) => (e: MarkerPressEvent) => {
      mapRef.current?.animateCamera({
        center: {
          latitude: h.latitude,
          longitude: h.longitude,
        },
        zoom: 15,
      });

      if (openId && openId !== h.id) {
        markerRefs.current[openId]?.hideCallout();
      }

      markerRefs.current[h.id]?.showCallout();
      setOpenId(h.id);
    };

  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState<(typeof hospitals)[0] | null>(null);

  const openDetail = (h: (typeof hospitals)[0]) => {
    setSelected(h);
    setModalVisible(true);
  };

  return (
    <>
      <MapView
        ref={mapRef}
        style={styles.container}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        followsUserLocation
        onPress={handleMapPress}
        showsMyLocationButton={false}>
        {hospitals.map(h => (
          <Marker
            key={h.id}
            coordinate={{latitude: h.latitude, longitude: h.longitude}}
            pinColor={h.isCenter ? colors.MAINBLUE : colors.RED}
            ref={ref => {
              if (ref) markerRefs.current[h.id] = ref;
            }}
            onPress={handleMarkerPress(h)}
            calloutAnchor={{x: 0.5, y: -0.1}}>
            <Callout
              tooltip
              onPress={() => openDetail(h)}
              style={styles.calloutWrapper}>
              <HospitalCard item={h} />
            </Callout>
          </Marker>
        ))}
      </MapView>

      <TouchableOpacity style={styles.searchBtn}>
        <Text style={styles.searchText}>병원 리스트 / 검색</Text>
        <Ionicons name="search" size={25} color={colors.GRAY} />
      </TouchableOpacity>

      <View style={styles.buttonList}>
        <Pressable style={styles.mapButton} onPress={handlePressUserLocation}>
          <Ionicons name="locate-outline" size={25} color={colors.WHITE} />
        </Pressable>
      </View>

      <ModalWrapper
        visible={modalVisible}
        onClose={() => setModalVisible(false)}>
        {selected && <HospitalDetail hospital={selected} />}
      </ModalWrapper>
    </>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  buttonList: {
    position: 'absolute',
    bottom: 30,
    right: 15,
    alignItems: 'center',
  },
  calloutWrapper: {
    backgroundColor: 'transparent',
    alignSelf: 'flex-start',
    width: 300,
    shadowColor: colors.BLACK,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
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
  searchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 70,
    left: 20,
    right: 20,
    padding: 20,
    backgroundColor: colors.WHITE,
    borderRadius: 25,
    elevation: 2,
    shadowColor: colors.GRAY,
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.5,
  },
  searchText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    color: colors.GRAY,
  },
});

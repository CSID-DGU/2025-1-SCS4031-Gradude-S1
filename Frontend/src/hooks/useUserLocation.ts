import {useEffect, useState} from 'react';
import {LatLng} from 'react-native-maps';
import GeoLocation from '@react-native-community/geolocation';

function useUserLocation() {
  const [coords, setCoords] = useState<LatLng>({
    latitude: 37.5516032365118,
    longitude: 126.98989626020192,
  });
  const [isUserLocationError, setIsUserLocationError] = useState(false);

  useEffect(() => {
    GeoLocation.getCurrentPosition(
      info => {
        setCoords({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        });
        setIsUserLocationError(false);
      },
      () => {
        setIsUserLocationError(true);
      },
      {
        enableHighAccuracy: true,
      },
    );
  }, []);

  // 좌표를 바로 분리 반환
  return {
    latitude: coords.latitude,
    longitude: coords.longitude,
    isUserLocationError,
  };
}

export default useUserLocation;

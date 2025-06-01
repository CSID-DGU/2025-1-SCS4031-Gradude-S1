import {useEffect} from 'react';
import {Alert, Linking} from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  Permission,
} from 'react-native-permissions';
import {alerts} from '@/constants';

type PermissionType = 'LOCATION' | 'PHOTO' | 'CAMERA' | 'MICROPHONE';

const iosPermissions: Record<PermissionType, Permission> = {
  LOCATION: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  PHOTO: PERMISSIONS.IOS.PHOTO_LIBRARY,
  CAMERA: PERMISSIONS.IOS.CAMERA,
  MICROPHONE: PERMISSIONS.IOS.MICROPHONE,
};

function usePermission(type: PermissionType) {
  useEffect(() => {
    (async () => {
      const permissionKey = iosPermissions[type];
      const status = await check(permissionKey);

      const showPermissionAlert = () => {
        Alert.alert(
          alerts[`${type}_PERMISSION`].TITLE,
          alerts[`${type}_PERMISSION`].DESCRIPTION,
          [
            {
              text: '설정하기',
              onPress: () => Linking.openSettings(),
            },
            {
              text: '취소',
              style: 'cancel',
            },
          ],
        );
      };

      switch (status) {
        case RESULTS.DENIED:
          // 아직 한 번도 요청하지 않았거나, “다시 묻기” 상태
          const newStatus = await request(permissionKey);
          if (newStatus === RESULTS.BLOCKED || newStatus === RESULTS.LIMITED) {
            showPermissionAlert();
          }
          break;

        case RESULTS.BLOCKED:
        case RESULTS.LIMITED:
          // 완전 거부된 상태
          showPermissionAlert();
          break;

        default:
          // GRANTED, UNAVAILABLE 등 나머지 상태는 아무 동작도 필요 없음
          break;
      }
    })();
  }, [type]);
}

export default usePermission;

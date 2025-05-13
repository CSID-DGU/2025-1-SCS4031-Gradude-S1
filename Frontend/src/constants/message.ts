// const errorMessages = {
//   CANNOT_GET_ADDRESS: '주소를 알 수 없습니다.',
//   UNEXPECT_ERROR: '알 수 없는 에러가 발생했습니다.',
// } as const;

const alerts = {
  LOCATION_PERMISSION: {
    TITLE: '위치 권한 허용이 필요합니다.',
    DESCRIPTION: '설정 화면에서 위치 권한을 허용해주세요.',
  },
  PHOTO_PERMISSION: {
    TITLE: '사진 접근 권한이 필요합니다.',
    DESCRIPTION: '설정 화면에서 사진 권한을 허용해주세요.',
  },
  // 녹음도 넣어야 함
} as const;

export {alerts};

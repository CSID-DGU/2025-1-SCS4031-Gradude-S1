const authNavigations = {
  AUTH_HOME: 'AuthHome',
  KAKAO_LOGIN: 'KakaoLogin',
  SIGNUP: 'SignUp',
} as const;
const homeNavigations = {
  MAIN_HOME: 'MainHome', // 탭에서 쓰는 이름
  DIAGNOSE_HOME: 'DiagnoseHome', // 스택에서 쓰는 이름 , 위 아래 같은 페이지
  FACE_SMILE: 'FaceSmile',
} as const;

export {authNavigations, homeNavigations};

const authNavigations = {
  AUTH_HOME: 'AuthHome',
  KAKAO_LOGIN: 'KakaoLogin',
  SIGNUP: 'SignUp',
} as const;
const homeNavigations = {
  MAIN_HOME: 'MainHome', // 탭에서 쓰는 이름
  // DIAGNOSE_HOME: 'DiagnoseHome', // 스택에서 쓰는 이름 , 위 아래 같은 페이지
  FACE_SMILE: 'FaceSmile',
  FACE_WINK: 'FaceWink',
  RECORD: 'Record',
  LOADING: 'Loading',
  MID_RESULT: 'MidResult',
  SELF_DGS: 'SelfDgs',
  FINAL_RESULT: 'FinalReusult',
  EXERCISE_LIST: 'ExerciseList',
  VIDEO_PLAYER: 'VideoPlayer',
} as const;

const mapNavigations = {
  MAP_HOME: 'MapHome', // 탭에서 쓰는 이름
  // HOSPITAL_MAP_HOME: 'HospitalMapHome',
} as const;

const healthNavigations = {
  HEALTH_HOME: 'HealthHome', // 탭에서 쓰는 이름
  // HEALTH_DAILY_HOME: 'HealthDailyHome',
} as const;

export {authNavigations, homeNavigations, mapNavigations, healthNavigations};

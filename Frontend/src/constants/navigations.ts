const authNavigations = {
  AUTH_HOME: 'AuthHome',
  KAKAO_LOGIN: 'KakaoLogin',
  SIGNUP: 'SignUp',
} as const;
const homeNavigations = {
  MAIN_HOME: 'MainHome',
  FACE_SMILE: 'FaceSmile',
  CAMERA: 'Camera',
  RECORD: 'Record',
  LOADING: 'Loading',
  MID_RESULT: 'MidResult',
  SELF_DGS: 'SelfDgs',
  FINAL_RESULT: 'FinalResult',
  EXERCISE_LIST: 'ExerciseList',
  VIDEO_PLAYER: 'VideoPlayer',
} as const;

const mapNavigations = {
  MAP_HOME: 'MapHome',
} as const;

const healthNavigations = {
  HEALTH_HOME: 'HealthHome',
  HEALTH_RESULT: 'HealthResult',
  CALENDAR: 'Calendar',
  HEALTH_DAIRY: 'HealthDiary',
  STROKE_DETAIL: 'StrokeDetail',
  FINAL_RESULT_LIST: 'FinalResultList',
} as const;

const profileNavigations = {
  PROFILE_HOME: 'ProfileHome',
  INFO: 'Info',
} as const;

export {
  authNavigations,
  homeNavigations,
  mapNavigations,
  healthNavigations,
  profileNavigations,
};

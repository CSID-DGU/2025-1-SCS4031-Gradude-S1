import type {Profile} from '@/types/profile';

export function validateSignup(values: Profile): Record<keyof Profile, string> {
  // 프로필 전체 키에 대해 빈 문자열로 초기화
  const errors: Record<keyof Profile, string> = {
    kakaoId: '',
    nickname: '',
    profileImageUrl: '',
    gender: '',
    birth: '',
    faceRecognitionAgreed: '',
  };

  // 성별
  if (!['MALE', 'FEMALE'].includes(values.gender)) {
    errors.gender = '성별을 선택해주세요.';
  }

  // 생년월일 YYYY-MM-DD 형식
  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.birth)) {
    errors.birth = 'YYYY-MM-DD 형식으로 입력해주세요.';
  }

  // 안면 인식 동의
  if (!values.faceRecognitionAgreed) {
    errors.faceRecognitionAgreed = '안면인식 동의가 필요합니다.';
  }

  // nickname/profileImageUrl/kakaoId는 수정 불필요하니 빈 문자열 유지
  return errors;
}

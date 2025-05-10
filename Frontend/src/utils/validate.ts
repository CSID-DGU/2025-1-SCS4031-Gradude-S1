export function isBlank(value: string) {
  return value.trim() === '';
}

export interface SignupValues {
  gender: 'MALE' | 'FEMALE';
  birth: string;
  isFaceRecognitionAgreed: boolean;
}

export function validateSignup(
  values: SignupValues,
): Record<keyof SignupValues, string> {
  const errors: Record<keyof SignupValues, string> = {
    gender: '',
    birth: '',
    isFaceRecognitionAgreed: '',
  };

  // 성별
  if (!['MALE', 'FEMALE'].includes(values.gender)) {
    errors.gender = '성별을 선택해주세요.';
  }

  // 생년월일 검증: YYYY-MM-DD 형식
  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.birth)) {
    errors.birth = 'YYYY-MM-DD 형식으로 입력해주세요.';
  }

  // 동의 여부 검증
  if (!values.isFaceRecognitionAgreed) {
    errors.isFaceRecognitionAgreed = '안면인식 동의가 필요합니다.';
  }

  return errors;
}

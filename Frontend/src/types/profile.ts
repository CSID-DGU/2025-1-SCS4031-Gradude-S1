// 카카오 로그인 직후, 회원가입 페이지에 보일 타입
interface KakaoProfile {
  nickname: string;
  profileImageUrl: string;
}

// 회원가입 시 서버에 보낼 전체 타입
interface Profile {
  kakaoId?: number;
  name?: string;
  nickname: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  birth: string;
  isFaceRecognitionAgreed: boolean;
  profileImageUrl: string;
}

export type {KakaoProfile, Profile};

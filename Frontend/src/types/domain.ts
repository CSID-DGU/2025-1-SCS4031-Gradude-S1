interface Profile {
  kakaoId: number;
  name: string;
  nickname: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  birth: string;
  isFaceRecognitionAgreed: boolean;
  profileImageUrl: string;
}
interface SignupResponse {
  isSuccess: boolean;
  message: string;
}
export type {Profile, SignupResponse};

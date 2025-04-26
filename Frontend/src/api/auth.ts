import {getEncryptStorage} from '../utils';
import axiosInstance from 'axios';
import {Profile, SignupResponse} from '../types/domain';

const kakaoLogin = async (token: string): Promise<ResponseToken> => {
  const {data} = await axiosInstance.post(
    '/api/auth/login?code={카카오 인가 코드}',
    {token},
  );

  return data;
};
type SignupRequest = Pick<
  Profile,
  'gender' | 'birth' | 'isFaceRecognitionAgreed'
>;

const patchSignup = async (payload: SignupRequest): Promise<SignupResponse> => {
  const {data} = await axiosInstance.post<SignupResponse>(
    '/api/auth/signup',
    payload,
  );
  return data;
};
type ResponseToken = {
  accessToken: string;
  refreshToken: string;
};

// const postLogin = async ({
//   email,
//   password,
// }: RequestUser): Promise<ResponseToken> => {
//   const {data} = await axiosInstance.post('/auth/signin', {
//     email,
//     password,
//   });

//   return data;
// };

type ResponseProfile = Profile;

// 프로필 가져오기
// const getProfile = async (): Promise<ResponseProfile> => {
//   const {data} = await axiosInstance.get('/api/auth/me');

//   return data;
// };

const getAccessToken = async (): Promise<ResponseToken> => {
  const refreshToken = await getEncryptStorage('refreshToken');

  const {data} = await axiosInstance.get('/api/auth/reissue', {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  return data;
};

const logout = async () => {
  await axiosInstance.post('/api/auth/logout');
};

export {patchSignup, getAccessToken, logout, kakaoLogin};
export type {SignupRequest, ResponseToken, ResponseProfile};

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create({
  baseURL: 'https://43.201.159.48.nip.io:443',
  // withCredentials: true,
});

// Request Interceptor: 매 요청마다 토큰을 자동으로 헤더에 추가
axiosInstance.interceptors.request.use(
  async config => {
    try {
      // AsyncStorage에서 토큰을 가져와서 헤더에 설정
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
        console.log(
          '🔑 Request Interceptor - Authorization 헤더 설정:',
          `Bearer ${accessToken}`,
        );
      }
    } catch (error) {
      // console.error('❌ Request Interceptor - 토큰 가져오기 실패:', error);
    }

    console.log('📤 Request Config:', {
      method: config.method,
      url: config.url,
      headers: config.headers,
    });

    return config;
  },
  error => {
    // console.error('❌ Request Interceptor Error:', error);
    return Promise.reject(error);
  },
);

// Response Interceptor: 응답 처리 및 토큰 만료 등 처리
axiosInstance.interceptors.response.use(
  response => {
    console.log('📥 Response:', {
      status: response.status,
      url: response.config.url,
    });
    return response;
  },

  // 이거 데모시 오류 날 수 있으니, 주석
  // error => {
  //   console.error('❌ Response Error:', {
  //     status: error.response?.status,
  //     message: error.response?.data?.message,
  //     url: error.config?.url,
  //   });

  //   // 401 에러 시 토큰 만료로 간주하고 AsyncStorage에서 제거
  //   if (error.response?.status === 401) {
  //     AsyncStorage.removeItem('accessToken');
  //     AsyncStorage.removeItem('refreshToken');
  //     console.log('🔐 토큰 만료로 인한 로그아웃 처리');
  //   }

  //   return Promise.reject(error);
  // },
  // 여까지
);

export default axiosInstance;

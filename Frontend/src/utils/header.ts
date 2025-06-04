import axiosInstance from '../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function setHeader(key: string, value: string) {
  try {
    // 1. axios 기본 헤더 설정
    axiosInstance.defaults.headers.common[key] = value;

    // 2. Authorization 헤더인 경우 AsyncStorage에도 저장
    if (key === 'Authorization' && value.startsWith('Bearer ')) {
      const token = value.replace('Bearer ', '');
      await AsyncStorage.setItem('accessToken', token);
      console.log('💾 AccessToken AsyncStorage 저장 완료:', token);
    }

    console.log('📨 setHeader 요청 헤더 설정 완료:', {
      key,
      value,
      currentHeaders: axiosInstance.defaults.headers.common,
    });
  } catch (error) {
    // console.error('❌ setHeader 실패:', error);
  }
}

async function removeHeader(key: string) {
  try {
    console.log(
      '📨 removeHeader 현재 헤더:',
      axiosInstance.defaults.headers.common,
    );

    if (!axiosInstance.defaults.headers.common[key]) {
      console.log(`⚠️ 헤더 '${key}'가 존재하지 않습니다.`);
      return;
    }

    // 1. axios 기본 헤더에서 제거
    delete axiosInstance.defaults.headers.common[key];

    // 2. Authorization 헤더인 경우 AsyncStorage에서도 제거
    if (key === 'Authorization') {
      await AsyncStorage.removeItem('accessToken');
      console.log('🗑️ AccessToken AsyncStorage 삭제 완료');
    }

    console.log(`🧹 removeHeader '${key}' 제거 완료`);
  } catch (error) {
    // console.error('❌ removeHeader 실패:', error);
  }
}

export {setHeader, removeHeader};

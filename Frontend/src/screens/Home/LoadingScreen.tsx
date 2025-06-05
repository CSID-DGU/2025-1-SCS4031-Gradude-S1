// src/screens/home/LoadingScreen.tsx

import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, View, Text, SafeAreaView, Alert} from 'react-native';
import {TIPS} from '@/constants/tips';
import {colors, homeNavigations} from '@/constants';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import {StackScreenProps} from '@react-navigation/stack';
import type {SurveyRequest} from '@/types/diagnosis';
import {postSurvey, uploadDiagnosis} from '@/api/diagnosis';
import {AxiosError} from 'axios';
import {HomeStackParamList} from '@/navigations/stack/HomeStackNavigator';

type Props = StackScreenProps<
  HomeStackParamList,
  typeof homeNavigations.LOADING
>;

export default function LoadingScreen({navigation, route}: Props) {
  // route.params가 { CameraUri, AudioUri } 또는 { surveyPayload } 두 가지 중 하나
  const hasVoiceParams =
    'CameraUri' in route.params && 'AudioUri' in route.params;
  const hasSurveyParams = 'surveyPayload' in route.params;

  const CameraUri = hasVoiceParams ? route.params.CameraUri : undefined;
  const AudioUri = hasVoiceParams ? route.params.AudioUri : undefined;
  const surveyPayload = hasSurveyParams
    ? (route.params.surveyPayload as SurveyRequest)
    : undefined;

  const [tipIndex, setTipIndex] = useState(0);
  const intervalMs = 4000;
  const random = false;
  const progress = useSharedValue(0);
  const animationRef = useRef<LottieView>(null);

  // Tip 텍스트와 애니메이션 상태 업데이트
  useEffect(() => {
    progress.value = withTiming(1, {duration: intervalMs});

    const tipTimer = setInterval(() => {
      setTipIndex(prev =>
        random
          ? Math.floor(Math.random() * TIPS.length)
          : (prev + 1) % TIPS.length,
      );
      progress.value = 0;
      progress.value = withTiming(1, {duration: intervalMs});
    }, intervalMs);

    return () => clearInterval(tipTimer);
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{scale: progress.value * 0.05 + 0.95}],
  }));

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        // ─── 얼굴+음성 업로드(Prediction) 부분: 더미 30초 뒤 MID_RESULT ───
        if (hasVoiceParams && CameraUri && AudioUri) {
          setTimeout(() => {
            if (!isMounted) return;
            navigation.replace(homeNavigations.MID_RESULT, {
              // dummy 값: 둘 다 false면 NormalCard
              facePrediction: false,
              speechPrediction: false,
            });
          }, 30000);

          return;
        }

        // ─── 설문 제출(Survey) 부분: 실제 API postSurvey 호출 ───
        if (hasSurveyParams && surveyPayload) {
          try {
            // 실제 postSurvey API 호출
            const surveyResult = await postSurvey(surveyPayload);

            if (!isMounted) return;
            // /HomeStackParamList에서 FINAL_RESULT: { surveyResult: SurveyResultDto }
            navigation.replace(homeNavigations.FINAL_RESULT, {
              surveyResult,
            });
          } catch (err: any) {
            // postSurvey 호출 중 에러 처리
            console.error('▶ postSurvey 에러:', err);
            let userMsg = '설문 전송 중 오류가 발생했습니다.';
            if (err.isAxiosError) {
              const axiosErr = err as AxiosError<{message: string}>;
              userMsg =
                axiosErr.response?.data?.message || axiosErr.message || userMsg;
            } else if (err instanceof Error) {
              userMsg = err.message;
            }
            Alert.alert('설문 오류', userMsg);
            navigation.goBack();
          }

          return;
        }

        // 둘 다 해당하지 않는 경우: 잘못된 경로
        Alert.alert('오류', '잘못된 경로로 접근하였습니다.');
        navigation.goBack();
      } catch (error: any) {
        // 예외 처리 (원래 코드 유지)
        console.error('============================');
        console.error('▶ LoadingScreen 에러 발생:', error);

        if (error.isAxiosError) {
          const axiosErr = error as AxiosError;
          console.error('--- [Axios Config] ---');
          console.error(axiosErr.config);

          if (axiosErr.response) {
            console.error('--- [Axios Response] ---');
            console.error('Status:', axiosErr.response.status);
            console.error('Headers:', axiosErr.response.headers);
            console.error('Data:', axiosErr.response.data);
          } else if (axiosErr.request) {
            console.error('--- [Axios Request] ---');
            console.error(axiosErr.request);
          }

          console.error('--- [Axios Error Message] ---');
          console.error(axiosErr.message);
        } else {
          console.error('--- [Non-Axios Error] ---');
          console.error(error.message);
          console.error(error.stack);
        }

        let userMsg = '알 수 없는 오류가 발생했습니다.';
        if (error.isAxiosError) {
          const axiosErr = error as AxiosError<{message: string}>;
          userMsg =
            axiosErr.response?.data?.message || axiosErr.message || userMsg;
        } else if (error instanceof Error) {
          userMsg = error.message;
        }
        Alert.alert('로딩 중 오류', userMsg);
        navigation.goBack();
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [
    CameraUri,
    AudioUri,
    surveyPayload,
    navigation,
    hasVoiceParams,
    hasSurveyParams,
  ]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.tipWrapper}>
          <Text style={styles.tipLabel}>Tip💡</Text>
          <Text style={styles.tipText}>{TIPS[tipIndex]}</Text>
        </View>

        <LottieView
          ref={animationRef}
          source={require('@/assets/animations/LoadingAnimation.json')}
          autoPlay
          loop
          style={styles.lottie}
          resizeMode="contain"
          speed={1}
        />
        <Text style={styles.loadingText}>분석 중입니다...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  tipWrapper: {
    alignItems: 'center',
    marginBottom: 90,
  },
  tipLabel: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 20,
    color: colors.BLACK,
    textAlign: 'center',
    lineHeight: 28,
  },
  lottie: {
    width: 100,
    height: 100,
    backgroundColor: 'transparent',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: colors.GRAY,
  },
});

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
        // 얼굴+음성 업로드 및 예측 호출
        if (hasVoiceParams && CameraUri && AudioUri) {
          try {
            const result = await uploadDiagnosis(CameraUri, AudioUri);
            if (!isMounted) return;
            navigation.replace(homeNavigations.MID_RESULT, {
              facePrediction: result.facePrediction,
              speechPrediction: result.speechPrediction,
            });
          } catch (err: any) {
            console.error('▶ uploadDiagnosis 에러:', err);
            let userMsg = '음성/영상 분석 중 오류가 발생했습니다.';
            if (err.isAxiosError) {
              const axiosErr = err as AxiosError<{message: string}>;
              userMsg =
                axiosErr.response?.data.message || axiosErr.message || userMsg;
            } else if (err instanceof Error) {
              userMsg = err.message;
            }
            Alert.alert('분석 오류', userMsg);
            navigation.goBack();
          }
          return;
        }

        // 설문 제출
        if (hasSurveyParams && surveyPayload) {
          try {
            const surveyResult = await postSurvey(surveyPayload);
            if (!isMounted) return;
            navigation.replace(homeNavigations.FINAL_RESULT, {surveyResult});
          } catch (err: any) {
            console.error('▶ postSurvey 에러:', err);
            let userMsg = '설문 전송 중 오류가 발생했습니다.';
            if (err.isAxiosError) {
              const axiosErr = err as AxiosError<{message: string}>;
              userMsg =
                axiosErr.response?.data.message || axiosErr.message || userMsg;
            } else if (err instanceof Error) {
              userMsg = err.message;
            }
            Alert.alert('설문 오류', userMsg);
            navigation.goBack();
          }
          return;
        }

        // 잘못된 접근 처리
        Alert.alert('오류', '잘못된 경로로 접근하였습니다.');
        navigation.goBack();
      } catch (error: any) {
        console.error('▶ LoadingScreen 예외 발생:', error);
        let userMsg = '알 수 없는 오류가 발생했습니다.';
        if (error.isAxiosError) {
          const axiosErr = error as AxiosError<{message: string}>;
          userMsg =
            axiosErr.response?.data.message || axiosErr.message || userMsg;
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
  safeArea: {flex: 1, backgroundColor: colors.WHITE},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  tipWrapper: {alignItems: 'center', marginBottom: 90},
  tipLabel: {fontSize: 25, fontWeight: 'bold', marginBottom: 8},
  tipText: {
    fontSize: 20,
    color: colors.BLACK,
    textAlign: 'center',
    lineHeight: 28,
  },
  lottie: {width: 100, height: 100, backgroundColor: 'transparent'},
  loadingText: {marginTop: 20, fontSize: 18, color: colors.GRAY},
});

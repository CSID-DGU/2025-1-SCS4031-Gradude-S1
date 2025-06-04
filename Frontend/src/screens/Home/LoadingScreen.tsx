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
import {HomeStackParamList} from '@/navigations/stack/HomeStackNavigator';
import {uploadDiagnosis, postSurvey} from '@/api/diagnosis';
import type {SurveyRequest} from '@/types/diagnosis';

type Props = StackScreenProps<
  HomeStackParamList,
  typeof homeNavigations.LOADING
>;

/**
 * LoadingScreen은 두 가지 케이스를 처리합니다:
 * 1) 얼굴+음성 업로드 → uploadDiagnosis 호출
 * 2) 자가진단 설문 전송 → postSurvey 호출
 *
 * route.params가 { CameraUri, AudioUri } 형태라면 ①을,
 * { surveyPayload } 형태라면 ②를 처리합니다.
 */
export default function LoadingScreen({navigation, route}: Props) {
  // route.params는 union 타입이므로, 두 케이스 중 어느 형태인지 확인
  const hasVoiceParams =
    'CameraUri' in route.params && 'AudioUri' in route.params;
  const hasSurveyParams = 'surveyPayload' in route.params;

  const CameraUri = hasVoiceParams ? route.params.CameraUri : undefined;
  const AudioUri = hasVoiceParams ? route.params.AudioUri : undefined;
  const surveyPayload = hasSurveyParams
    ? (route.params.surveyPayload as SurveyRequest)
    : undefined;

  // ── 팁 로테이션용 상태 ──
  const [tipIndex, setTipIndex] = useState(0);
  const intervalMs = 4000;
  const random = false;
  const progress = useSharedValue(0);
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    // 첫 진입 시 애니메이션 시작
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

  // ── 마운트 시점에 API 호출 ──
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        // ① 얼굴+음성 업로드
        if (hasVoiceParams && CameraUri && AudioUri) {
          const result = await uploadDiagnosis(CameraUri, AudioUri);
          if (!isMounted) return;

          const {facePrediction, speechPrediction} = result;
          navigation.replace(homeNavigations.MID_RESULT, {
            facePrediction,
            speechPrediction,
          });
          return;
        }

        // ② 자가진단 설문 전송
        if (hasSurveyParams && surveyPayload) {
          const surveyResult = await postSurvey(surveyPayload);
          if (!isMounted) return;

          // 결과가 오면 FinalResultScreen으로 이동
          navigation.replace(homeNavigations.FINAL_RESULT, {
            surveyResult,
          });
          return;
        }

        // 둘 다 해당하지 않으면, 잘못된 진입. 뒤로 보내기
        Alert.alert('오류', '잘못된 경로로 접근하였습니다.');
        navigation.goBack();
      } catch (error: any) {
        Alert.alert(
          '로딩 중 오류',
          error instanceof Error
            ? error.message
            : '알 수 없는 오류가 발생했습니다.',
        );
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

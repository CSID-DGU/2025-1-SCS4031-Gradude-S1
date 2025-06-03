// src/screens/home/LoadingScreen.tsx
import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  SafeAreaView,
  Alert,
} from 'react-native';
import {SafeAreaView as RNSafeAreaView} from 'react-native-safe-area-context';
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
import {uploadDiagnosis} from '@/api/diagnosis';

/**
 * LoadingScreenProps:
 * - route.params.CameraUri: 카메라에서 촬영한 이미지 URI
 * - route.params.AudioUri: 녹음한 오디오 파일 URI
 */
type Props = StackScreenProps<
  HomeStackParamList,
  typeof homeNavigations.LOADING
>;

export default function LoadingScreen({navigation, route}: Props) {
  const {CameraUri, AudioUri} = route.params;

  // Tip 인덱스 관리
  const [tipIndex, setTipIndex] = useState(0);
  const intervalMs = 4000;
  const random = false;

  // 애니메이션 진행을 제어하는 shared value (tip 변경 타이밍 맞추기용)
  const progress = useSharedValue(0);
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    // 1) Tip 텍스트를 일정 간격마다 업데이트
    const tipTimer = setInterval(() => {
      setTipIndex(prev =>
        random
          ? Math.floor(Math.random() * TIPS.length)
          : (prev + 1) % TIPS.length,
      );
      progress.value = 0;
      progress.value = withTiming(1, {duration: intervalMs});
    }, intervalMs);

    // 초기 애니메이션 진행
    progress.value = withTiming(1, {duration: intervalMs});

    return () => clearInterval(tipTimer);
  }, [random, intervalMs, progress]);

  // 2) 컴포넌트가 마운트되면 곧바로 진단 API 호출
  useEffect(() => {
    (async () => {
      try {
        const result = await uploadDiagnosis(CameraUri, AudioUri);
        const {facePrediction, speechPrediction} = result;
        // 결과가 오면 MidResultScreen 으로 교체(navigate) → 뒤로 가기 불가
        navigation.replace(homeNavigations.MID_RESULT, {
          facePrediction,
          speechPrediction,
        });
      } catch (error) {
        Alert.alert(
          '진단 실패',
          error instanceof Error
            ? error.message
            : '알 수 없는 오류가 발생했습니다.',
        );
        // 실패 시 이전 화면으로 돌아가거나, 원하는 위치로 라우팅
        navigation.goBack();
      }
    })();
  }, [CameraUri, AudioUri, navigation]);

  // 애니메이션 스타일(필요시 사용)
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{scale: progress.value * 0.05 + 0.95}],
  }));

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
        <Text style={styles.loadingText}>검사 결과 분석중...</Text>
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

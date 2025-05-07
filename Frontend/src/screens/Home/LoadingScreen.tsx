import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, Dimensions, SafeAreaView} from 'react-native';
import {SafeAreaView as RNSafeAreaView} from 'react-native-safe-area-context';
import {TIPS} from '@/constants/tips';
import {colors} from '@/constants';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';

interface LoadingScreenProps {
  random?: boolean;
  intervalMs?: number;
}

function LoadingScreen({
  random = false,
  intervalMs = 4000,
}: LoadingScreenProps) {
  const [tipIndex, setTipIndex] = useState(0);
  const progress = useSharedValue(0);
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    const tipTimer = setInterval(() => {
      setTipIndex(prev =>
        random
          ? Math.floor(Math.random() * TIPS.length)
          : (prev + 1) % TIPS.length,
      );

      progress.value = 0;
      progress.value = withTiming(1, {duration: intervalMs});
    }, intervalMs);

    progress.value = withTiming(1, {duration: intervalMs});

    return () => clearInterval(tipTimer);
  }, [random, intervalMs]);

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
          style={{
            width: 100,
            height: 100,
            backgroundColor: 'transparent',
          }}
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
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: colors.GRAY,
  },
});

export default LoadingScreen;

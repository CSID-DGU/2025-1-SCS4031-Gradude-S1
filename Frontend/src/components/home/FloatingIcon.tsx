import React, {ReactNode, useEffect} from 'react';
import {StyleSheet, StyleProp, ViewStyle} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface FloatingIconProps {
  /** 떠다니는 아이콘 요소 */
  children: ReactNode;
  /** 애니메이션 시작 전 지연 시간(ms) */
  delay?: number;
  /** 위치·크기 등 추가 뷰 스타일 지정 */
  style?: StyleProp<ViewStyle>;
}

export default function FloatingIcon({
  children,
  delay = 0,
  style,
}: FloatingIconProps) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue('0deg');

  useEffect(() => {
    // Y축 왕복 애니메이션
    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(-10, {duration: 3000, easing: Easing.inOut(Easing.sin)}),
        -1,
        true,
      ),
    );
    // X축 왕복 애니메이션
    translateX.value = withDelay(
      delay + 500,
      withRepeat(
        withTiming(7, {duration: 2500, easing: Easing.inOut(Easing.sin)}),
        -1,
        true,
      ),
    );
    // 회전 애니메이션
    rotate.value = withDelay(
      delay + 300,
      withRepeat(
        withTiming('3deg', {duration: 4000, easing: Easing.inOut(Easing.sin)}),
        -1,
        true,
      ),
    );
  }, [delay, translateY, translateX, rotate]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {translateY: translateY.value},
      {translateX: translateX.value},
      {rotate: rotate.value},
    ],
  }));

  return (
    <Animated.View style={[styles.wrapper, style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
});

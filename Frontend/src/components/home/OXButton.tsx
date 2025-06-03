import React, {useEffect} from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import {colors} from '@/constants';

type OXValue = 'O' | 'X';

interface OXButtonProps {
  value: OXValue;
  selected: boolean;
  onPress: () => void;
}

const BUTTON_SIZE = 150;
const OXTEXT_SIZE = 90;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function OXButton({value, selected, onPress}: OXButtonProps) {
  const scale = useSharedValue(1);
  const borderSize = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(selected ? 0.9 : 1, {
      damping: 12,
      stiffness: 150,
      mass: 1,
      overshootClamping: true,
    });

    const targetBorder = selected ? ((1 - 0.9) * BUTTON_SIZE) / 2 : 0;
    borderSize.value = withTiming(targetBorder, {
      duration: 200,
      easing: Easing.out(Easing.exp),
    });
  }, [selected, scale, borderSize]);

  const animatedInner = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));
  const animatedOuter = useAnimatedStyle(() => ({
    borderWidth: borderSize.value,
  }));

  const bgColor = value === 'O' ? colors.OBTN : colors.XBTN;
  const textColor = value === 'O' ? colors.MAINBLUE : colors.RED;

  return (
    <AnimatedPressable
      onPress={onPress}
      style={[
        styles.outer,
        {backgroundColor: bgColor, borderColor: textColor},
        animatedOuter,
      ]}>
      <Animated.View
        style={[styles.button, animatedInner, {backgroundColor: bgColor}]}>
        <Text style={[styles.text, {color: textColor}]}>{value}</Text>
      </Animated.View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderColor: 'transparent',
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: OXTEXT_SIZE,
    fontWeight: 'bold',
  },
});

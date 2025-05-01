import React, {useEffect} from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import {colors} from '@/constants';

interface GenderButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

function RadioButton({label, selected, onPress}: GenderButtonProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(selected ? 1 : 0, {duration: 300});
  }, [selected]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [colors.GRAY, colors.MAINBLUE],
    );

    return {backgroundColor};
  });

  return (
    <Animated.View style={[styles.button, animatedStyle]}>
      <TouchableOpacity onPress={onPress} style={styles.touchable}>
        <Text style={styles.text}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    overflow: 'hidden',
    margin: 5,
  },
  touchable: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  text: {
    color: colors.WHITE,
    fontWeight: 'bold',
  },
});

export default RadioButton;

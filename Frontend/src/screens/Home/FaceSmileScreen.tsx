import React, {useEffect} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import SmileEmoji from '@/assets/Home/SmileEmoji.svg';
import StraightEmoji from '@/assets/Home/StraightEmoji.svg';
import CustomButton from '@/components/commons/CustomButton';
import {colors} from '@/constants';

const {width: SCREEN_W, height: SCREEN_H} = Dimensions.get('window');
const CARD_PADDING = 5;
const EMOJI_SIZE = SCREEN_W * 0.4;
const CARD_WIDTH = SCREEN_W * 0.85;
const CARD_HEIGHT = SCREEN_H * 0.7;

export default function FaceSmileScreen() {
  const cardOpacity = useSharedValue(0);
  const emojiProgress = useSharedValue(0);
  const btnScale = useSharedValue(1);

  useEffect(() => {
    cardOpacity.value = withTiming(1, {duration: 500});
    emojiProgress.value = withDelay(
      1500,
      withRepeat(withTiming(1, {duration: 1500}), -1, true),
    );
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{scale: cardOpacity.value * 0.05 + 0.95}],
  }));
  const straightStyle = useAnimatedStyle(() => ({
    opacity: 1 - emojiProgress.value,
  }));
  const smileStyle = useAnimatedStyle(() => ({
    opacity: emojiProgress.value,
  }));
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{scale: btnScale.value}],
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.card, cardStyle]}>
        <Text style={styles.title}>
          정면을 바라본 채 무표정으로{'\n'}
          1초간 유지한 뒤,{'\n'}
          마지막 2초 동안 “이~” 소리를 내며{'\n'}
          천천히 미소 지어주세요
        </Text>

        <Text style={styles.subtitle}>
          아래 그림대로 준비가 완료되면{'\n'}
          '촬영 시작' 버튼을 눌러주세요
        </Text>

        <View style={styles.imageRow}>
          {/* 왼쪽: 무표정 이모지 */}
          <Animated.View style={[styles.emojiContainer, straightStyle]}>
            <StraightEmoji width={EMOJI_SIZE} height={EMOJI_SIZE} />
          </Animated.View>

          {/* 오른쪽: 웃는 이모지 */}
          <Animated.View style={[styles.emojiContainer, smileStyle]}>
            <SmileEmoji width={EMOJI_SIZE} height={EMOJI_SIZE} />
          </Animated.View>
        </View>

        <Animated.View style={buttonStyle}>
          <CustomButton
            label="촬영 시작"
            size="large"
            variant="filled"
            style={styles.button}
            textStyle={styles.buttonText}
            onPressIn={() => {
              btnScale.value = withTiming(0.95, {duration: 100});
            }}
            onPressOut={() => {
              btnScale.value = withTiming(1, {duration: 100});
              // navigation.navigate('CameraScreen');
            }}
          />
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.BACKGRAY,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
  },

  card: {
    backgroundColor: colors.WHITE,
    borderRadius: 16,
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    justifyContent: 'space-evenly',
    padding: CARD_PADDING,
    alignItems: 'center',
    shadowColor: colors.BLACK,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.MAINBLUE,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: colors.BLACK,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 15,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: EMOJI_SIZE,
    marginBottom: 32,
  },
  emojiContainer: {
    width: EMOJI_SIZE,
    height: EMOJI_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '80%',
    backgroundColor: colors.WHITE,
    shadowColor: '#8BC4F0',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  buttonText: {
    color: colors.MAINBLUE,
    fontSize: 20,
  },
});

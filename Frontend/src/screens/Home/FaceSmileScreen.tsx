import React, {useEffect} from 'react';
import {Dimensions, StyleSheet, Text, View, SafeAreaView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import SmileEmoji from '@/assets/Home/SmileEmoji.svg';
import StraightEmoji from '@/assets/Home/StraightEmoji.svg';
import CloseEyeEmoji from '@/assets/Home/CloseEyeEmoji.svg';
import CustomButton from '@/components/commons/CustomButton';
import {colors, homeNavigations} from '@/constants';
import {HomeStackParamList} from '@/navigations/stack/HomeStackNavigator';
import {StackScreenProps} from '@react-navigation/stack';

const {width: SCREEN_W, height: SCREEN_H} = Dimensions.get('window');
const CARD_WIDTH = SCREEN_W * 0.85;
const CARD_HEIGHT = SCREEN_H * 0.55;
const EMOJI_SIZE = SCREEN_W * 0.4;

type FaceSmileScreenProps = StackScreenProps<
  HomeStackParamList,
  typeof homeNavigations.FACE_SMILE
>;

function FaceSmileScreen({navigation}: FaceSmileScreenProps) {
  const insets = useSafeAreaInsets();

  const cardOpacity = useSharedValue(0);
  const emojiProgress = useSharedValue(0);
  const btnScale = useSharedValue(1);

  const SEGMENT_DURATION = 800;

  useEffect(() => {
    // 카드 페이드인
    cardOpacity.value = withTiming(1, {duration: 500});

    // 이모지 애니메이션: 0→1(정색1초)→2(윙크0.5초)→3(정색1초)→4(스마일2초) 반복
    emojiProgress.value = withDelay(
      SEGMENT_DURATION,
      withRepeat(
        withSequence(
          withTiming(1, {duration: SEGMENT_DURATION}), // 0→1: 첫번째 정색 (1초)
          withTiming(2, {duration: SEGMENT_DURATION}), // 1→2: 윙크 (0.5초)
          withTiming(3, {duration: SEGMENT_DURATION}), // 2→3: 두번째 정색 (1초)
          withTiming(4, {duration: SEGMENT_DURATION}), // 3→4: 스마일 (2초)
        ),
        -1,
        false,
      ),
    );
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{scale: cardOpacity.value * 0.05 + 0.95}],
  }));
  const straight1Style = useAnimatedStyle(() => ({
    opacity: emojiProgress.value >= 0 && emojiProgress.value < 1 ? 1 : 0,
  }));

  // 1→2 구간에서는 윙크
  const CloseEyeStyle = useAnimatedStyle(() => ({
    opacity: emojiProgress.value >= 1 && emojiProgress.value < 2 ? 1 : 0,
  }));

  // 2→3 구간에서는 다시 정색
  const straight2Style = useAnimatedStyle(() => ({
    opacity: emojiProgress.value >= 2 && emojiProgress.value < 3 ? 1 : 0,
  }));

  // 3→4 구간에서는 스마일
  const smileStyle = useAnimatedStyle(() => ({
    opacity: emojiProgress.value >= 3 && emojiProgress.value <= 4 ? 1 : 0,
  }));
  const buttonAnimStyle = useAnimatedStyle(() => ({
    transform: [{scale: btnScale.value}],
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.card, cardStyle]}>
        <Text style={styles.title}>
          3초 동안 정면을 바라본 채 {`\n`}
          무표정으로 눈을 감았다 뜨고{`\n`}
          천천히 미소를 지어주세요
        </Text>
        <Text style={styles.subtitle}>
          아래 그림대로 준비가 완료되면{'\n'}
          '촬영 시작' 버튼을 눌러주세요
        </Text>
        <View style={styles.imageRow}>
          <Animated.View style={[styles.emojiContainer, straight1Style]}>
            <StraightEmoji width={EMOJI_SIZE} height={EMOJI_SIZE} />
          </Animated.View>
          <Animated.View style={[styles.emojiContainer, CloseEyeStyle]}>
            <CloseEyeEmoji width={EMOJI_SIZE} height={EMOJI_SIZE} />
          </Animated.View>
          <Animated.View style={[styles.emojiContainer, straight2Style]}>
            <StraightEmoji width={EMOJI_SIZE} height={EMOJI_SIZE} />
          </Animated.View>
          <Animated.View style={[styles.emojiContainer, smileStyle]}>
            <SmileEmoji width={EMOJI_SIZE} height={EMOJI_SIZE} />
          </Animated.View>
        </View>
      </Animated.View>

      <View style={[styles.buttonCardWrapper, {bottom: insets.bottom + 10}]}>
        <Animated.View style={buttonAnimStyle}>
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
              navigation.navigate(homeNavigations.CAMERA);
            }}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.BACKGRAY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: colors.WHITE,
    borderRadius: 16,
    padding: 8,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    shadowColor: colors.BLACK,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 80,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.MAINBLUE,
    textAlign: 'center',
    lineHeight: 26,
  },
  subtitle: {
    fontSize: 18,
    color: colors.BLACK,
    textAlign: 'center',
    lineHeight: 26,
  },
  imageRow: {
    width: EMOJI_SIZE,
    height: EMOJI_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  emojiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: EMOJI_SIZE,
    height: EMOJI_SIZE,
  },
  buttonCardWrapper: {
    position: 'absolute',
    width: CARD_WIDTH,
    alignSelf: 'center',
    padding: 12,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: colors.MAINBLUE,
    shadowColor: '#8BC4F0',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: colors.WHITE,
    fontSize: 20,
  },
});

export default FaceSmileScreen;

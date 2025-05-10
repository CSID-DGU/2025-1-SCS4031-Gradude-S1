import React, {useEffect} from 'react';
import {Dimensions, StyleSheet, Text, View, SafeAreaView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
} from 'react-native-reanimated';
import SmileEmoji from '@/assets/Home/SmileEmoji.svg';
import StraightEmoji from '@/assets/Home/StraightEmoji.svg';
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

  useEffect(() => {
    cardOpacity.value = withTiming(1, {duration: 500});
    emojiProgress.value = withDelay(
      1100,
      withRepeat(withTiming(1, {duration: 1100}), -1, true),
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
  const buttonAnimStyle = useAnimatedStyle(() => ({
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
          <Animated.View style={[styles.emojiContainer, straightStyle]}>
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
              navigation.navigate(homeNavigations.FACE_WINK);
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

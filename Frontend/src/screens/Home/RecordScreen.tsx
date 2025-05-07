import React, {useEffect} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {colors, homeNavigations} from '@/constants';
import {HomeStackParamList} from '@/navigations/stack/HomeStackNavigator';
import {StackScreenProps} from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CautionResultScreen from './CautionResultScreen';
type RecordScreenProps = StackScreenProps<
  HomeStackParamList,
  typeof homeNavigations.RECORD
>;
const {width: SCREEN_W, height: SCREEN_H} = Dimensions.get('window');
const CARD_WIDTH = SCREEN_W * 0.85;
const CARD_HEIGHT = SCREEN_H * 0.4;
const EMOJI_SIZE = SCREEN_W * 0.4;

function RecordScreen({navigation}: RecordScreenProps) {
  const insets = useSafeAreaInsets();

  const cardOpacity = useSharedValue(0);
  const btnScale = useSharedValue(1);

  useEffect(() => {
    cardOpacity.value = withTiming(1, {duration: 500});
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{scale: cardOpacity.value * 0.05 + 0.95}],
  }));

  const buttonAnimStyle = useAnimatedStyle(() => ({
    transform: [{scale: btnScale.value}],
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Main Content Card */}
      <Animated.View style={[styles.card, cardStyle]}>
        <Text style={styles.subtitle}>
          녹음 버튼을 누른 후{'\n'}
          아래 문장을 또박또박 읽어주세요
        </Text>
        <Text style={styles.title}>
          "나는 바지를 입고 단추를 채웁니다."{'\n'}
          라고 말해보세요
        </Text>

        <Text style={styles.cautiontext}>
          ※ 정확한 인식을 위해 주변 소음을 최소화하고 ※ {'\n'}
          마이크에 가까이 말해주시기 바랍니다.
        </Text>
      </Animated.View>

      <View style={[styles.buttonCardWrapper, {bottom: insets.bottom + 10}]}>
        <Animated.View style={buttonAnimStyle}>
          <Pressable
            onPressIn={() => {
              btnScale.value = withTiming(0.9, {duration: 100});
            }}
            onPressOut={() => {
              btnScale.value = withTiming(1, {duration: 100});
              //   handleRecordPress();
              navigation.navigate(homeNavigations.NORMAL);
            }}
            style={styles.recordButton}>
            <Ionicons name="mic-outline" size={50} color={colors.WHITE} />
          </Pressable>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: colors.BLACK,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 80,
  },
  subtitle: {
    marginTop: 15,
    fontSize: 18,
    color: colors.BLACK,
    textAlign: 'center',
    lineHeight: 26,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.MAINBLUE,
    textAlign: 'center',
    lineHeight: 30,
  },
  cautiontext: {
    fontSize: 15,
    color: colors.GRAY,
    textAlign: 'center',
  },
  /* 버튼 카드 */
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
  recordButton: {
    width: 90,
    height: 90,
    backgroundColor: colors.RED,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RecordScreen;

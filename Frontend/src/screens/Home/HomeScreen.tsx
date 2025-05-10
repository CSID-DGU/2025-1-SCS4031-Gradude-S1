import React from 'react';
import {View, SafeAreaView, StyleSheet, Dimensions, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FloatingIcon from '@/components/home/FloatingIcon';
import CustomButton from '@/components/commons/CustomButton';
import Chart from '@/assets/Home/Chart.svg';
import Defibrillator from '@/assets/Home/Defibrillator.svg';
import FirstAid from '@/assets/Home/FirstAid.svg';
import {colors, homeNavigations} from '@/constants';
import {HomeStackParamList} from '@/navigations/stack/HomeStackNavigator';
import {StackScreenProps} from '@react-navigation/stack';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type HomeScreenProps = StackScreenProps<
  HomeStackParamList,
  typeof homeNavigations.DIAGNOSE_HOME
>;

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const ICON_SIZE = 170;
const CIRCLE_DIAMETER = SCREEN_WIDTH * 2;
const R = CIRCLE_DIAMETER / 2;

function HomeScreen({navigation}: HomeScreenProps) {
  const insets = useSafeAreaInsets();
  const btnScale = useSharedValue(1);
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{scale: btnScale.value}],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundLayer} />

      <LinearGradient
        colors={['rgba(190,159,255,0.4)', colors.BLUE]}
        start={{x: 0.5, y: 0}}
        end={{x: 0.5, y: 1}}
        style={styles.halfCircle}
      />

      <View style={styles.iconsContainer} pointerEvents="none">
        <FloatingIcon delay={0} style={styles.icon1}>
          <Chart
            width={ICON_SIZE}
            height={ICON_SIZE}
            preserveAspectRatio="xMidYMid meet"
          />
        </FloatingIcon>

        <FloatingIcon delay={800} style={styles.icon2}>
          <Defibrillator
            width={ICON_SIZE}
            height={ICON_SIZE}
            preserveAspectRatio="xMidYMid meet"
          />
        </FloatingIcon>

        <FloatingIcon delay={1200} style={styles.icon3}>
          <FirstAid
            width={ICON_SIZE}
            height={ICON_SIZE}
            preserveAspectRatio="xMidYMid meet"
          />
        </FloatingIcon>
      </View>

      <View
        style={[styles.cardWrapper, {bottom: insets.bottom + 5}]}
        pointerEvents="box-none">
        <LinearGradient
          colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.4)']}
          start={{x: 0.5, y: 0}}
          end={{x: 0.5, y: 1}}
          style={styles.card}>
          <Text style={styles.title}>하루 한 번, 자가 진단</Text>
          <Text style={styles.subtitle}>
            오늘 자가진단을 통해{'\n'}내 뇌졸중 위험도를 확인하고,{'\n'}
            미리 예방해요
          </Text>
          <Animated.View style={buttonStyle}>
            <CustomButton
              label="진단하기"
              size="large"
              variant="filled"
              style={styles.cardButton}
              textStyle={styles.cardButtonText}
              onPressIn={() => {
                btnScale.value = withTiming(0.95, {duration: 100});
              }}
              onPressOut={() => {
                btnScale.value = withTiming(1, {duration: 100});
                navigation.navigate(homeNavigations.FACE_SMILE);
              }}
            />
          </Animated.View>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.BLUE,
  },
  halfCircle: {
    position: 'absolute',
    top: 90,
    left: -SCREEN_WIDTH / 2,
    width: CIRCLE_DIAMETER,
    height: CIRCLE_DIAMETER,
    borderRadius: R,
    overflow: 'hidden',
  },
  iconsContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'visible',
  },
  icon1: {
    position: 'absolute',
    top: 80,
    left: -5,
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  icon2: {
    position: 'absolute',
    top: 90,
    right: -30,
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  icon3: {
    position: 'absolute',
    top: 300,
    right: 80,
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  cardWrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 20,
    elevation: 20,
  },
  card: {
    height: 350,
    justifyContent: 'space-between',
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    color: colors.MAINBLUE,
    marginTop: 20,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: colors.BLACK,
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 24,
  },
  cardButton: {
    width: '80%',
    backgroundColor: colors.WHITE,
    shadowColor: '#8BC4F0',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  cardButtonText: {
    color: colors.MAINBLUE,
    fontSize: 20,
  },
});
export default HomeScreen;

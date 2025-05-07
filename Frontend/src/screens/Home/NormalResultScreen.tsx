import React, {useEffect} from 'react';
import {Dimensions, StyleSheet, Text, View, SafeAreaView} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import CustomButton from '@/components/commons/CustomButton';
import {colors} from '@/constants';

const {width: SCREEN_W, height: SCREEN_H} = Dimensions.get('window');
const CARD_WIDTH = SCREEN_W * 0.85;
const CARD_HEIGHT = SCREEN_H * 0.65;

function NormalResultScreen({}) {
  const rotateY = useSharedValue(90);

  useEffect(() => {
    rotateY.value = withTiming(0, {duration: 600});
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{perspective: 1000}, {rotateY: `${rotateY.value}deg`}],
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.card, cardStyle]}>
        <Text style={styles.title}>정상 범위 입니다</Text>
        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            현재로서는 큰 이상은 없어보입니다 {'\n'}
            하지만 더 정확한 진단을 위해서는
          </Text>
          <Text style={styles.hospitalmessage}>자가 진단이 필요합니다</Text>
          <Text style={styles.detailmessage}>
            더 자세한 진단을 원한다면,{'\n'}
            자가 진단 하기 버튼을 눌러주세요{'\n'}
          </Text>
        </View>

        <View style={styles.ButtonBox}>
          <CustomButton
            label="자가 진단하기"
            size="large"
            variant="filled"
            style={styles.selfButton}
            textStyle={styles.selfButtonText}
            //   onPress={() => navigation.navigate('SelfDiagnosis')}
          />
        </View>
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
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: colors.WHITE,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: colors.BLACK,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.MAINBLUE,
    marginBottom: 20,
    marginTop: 16,
    textAlign: 'center',
  },
  messageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  message: {
    fontSize: 16,
    color: colors.BLACK,
    textAlign: 'center',
    lineHeight: 24,
  },
  hospitalmessage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.BLACK,
    textAlign: 'center',
    lineHeight: 24,
  },
  detailmessage: {
    fontSize: 16,
    color: colors.GRAY,
    textAlign: 'center',
    lineHeight: 20,
  },
  messageBold: {
    fontWeight: '900',
    marginTop: 8,
  },
  ButtonBox: {width: '90%', marginBottom: 16},
  callButton: {
    width: '100%',
    backgroundColor: colors.RED,
    marginBottom: 12,
  },
  callButtonText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  selfButton: {
    width: '100%',
    backgroundColor: colors.MAINBLUE,
  },
  selfButtonText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
});
export default NormalResultScreen;

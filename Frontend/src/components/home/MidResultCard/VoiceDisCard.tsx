import React, {useEffect} from 'react';
import {StyleSheet, Text, View, Dimensions, Linking} from 'react-native';
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

interface VoiceDisCardProps {
  onCallPress: () => void;
  onSelfPress: () => void;
}

function VoiceDisCard({onCallPress, onSelfPress}: VoiceDisCardProps) {
  // 애니메이션 상태
  const rotateY = useSharedValue(90);

  // 마운트 시 회전 애니메이션 실행
  useEffect(() => {
    rotateY.value = withTiming(0, {duration: 600});
  }, [rotateY]);

  // 스타일에 적용
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{perspective: 1000}, {rotateY: `${rotateY.value}deg`}],
  }));

  return (
    <Animated.View style={[styles.card, cardStyle]}>
      <Text style={styles.title}>주의가 필요합니다</Text>

      <View style={styles.messageContainer}>
        <Text style={styles.mainmessage}>
          발화에는 드러나지 않지만 얼굴 표정에 어색함이 있어 {'\n'}
          각별한 주의가 필요합니다
        </Text>
        <Text style={styles.message}>
          이러한 증상은 뇌졸중과 관련이 있을 수 있어요{'\n'}
          갑작스럽게 증상 발생하였다면{'\n'}
          최대한 빠른 시간 안에
        </Text>
        <Text style={styles.hospitalmessage}>
          가까운 병원으로 즉시 내원해 주세요{'\n'}
          가장 가까운 의료 기관은{'\n'}‘병원 찾기’를 통해 확인할 수 있습니다.
        </Text>
        <Text style={styles.detailmessage}>
          더 자세한 진단을 원한다면,{'\n'}
          자가 진단 하기 버튼을 눌러주세요{'\n'}
        </Text>
      </View>

      <View style={styles.buttonBox}>
        <CustomButton
          label="119 전화하기"
          size="large"
          variant="filled"
          style={styles.callButton}
          textStyle={styles.callButtonText}
          onPress={onCallPress}
        />
        <CustomButton
          label="자가 진단하기"
          size="large"
          variant="filled"
          style={styles.selfButton}
          textStyle={styles.selfButtonText}
          onPress={onSelfPress}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
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
    color: colors.RED,
    textAlign: 'center',
    marginVertical: 16,
  },
  messageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainmessage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.RED,
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
  buttonBox: {
    width: '90%',
    marginBottom: 16,
  },
  callButton: {
    width: '100%',
    backgroundColor: colors.RED,
    marginBottom: 12,
  },
  callButtonText: {
    color: colors.WHITE,
    fontSize: 20,
  },
  selfButton: {
    width: '100%',
    backgroundColor: colors.MAINBLUE,
  },
  selfButtonText: {
    color: colors.WHITE,
    fontSize: 20,
  },
});

export default VoiceDisCard;

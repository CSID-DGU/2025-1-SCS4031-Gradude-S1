// RecordScreen.tsx
import React, {useEffect, useRef, useState} from 'react';
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
} from 'react-native-audio-recorder-player';
import {colors, homeNavigations} from '@/constants';
import {HomeStackParamList} from '@/navigations/stack/HomeStackNavigator';
import {StackScreenProps} from '@react-navigation/stack';

type RecordScreenProps = StackScreenProps<
  HomeStackParamList,
  typeof homeNavigations.RECORD
>;

const {width: SCREEN_W, height: SCREEN_H} = Dimensions.get('window');
const CARD_WIDTH = SCREEN_W * 0.85;
const CARD_HEIGHT = SCREEN_H * 0.4;

export default function RecordScreen({navigation}: RecordScreenProps) {
  const insets = useSafeAreaInsets();
  const audioRecorder = useRef(new AudioRecorderPlayer()).current;

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

  // 녹음/재생 상태
  const [recordSecs, setRecordSecs] = useState(0);
  const [recordedPath, setRecordedPath] = useState<string>();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // 녹음 시작
  const onStartRecord = async () => {
    setIsRecording(true);
    const path = await audioRecorder.startRecorder(undefined, {
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 1,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    });
    audioRecorder.addRecordBackListener(e => {
      setRecordSecs(e.currentPosition);
      return;
    });
    console.log('녹음 경로:', path);
  };

  // 녹음 중지
  const onStopRecord = async () => {
    const result = await audioRecorder.stopRecorder();
    audioRecorder.removeRecordBackListener();
    setRecordedPath(result);
    setIsRecording(false);
    setRecordSecs(0);
  };

  // 재생
  const onTogglePlay = async () => {
    if (isPlaying) {
      await audioRecorder.pausePlayer();
      setIsPlaying(false);
    } else {
      await audioRecorder.startPlayer(recordedPath!);
      audioRecorder.addPlayBackListener(e => {
        if (e.currentPosition >= e.duration) {
          audioRecorder.stopPlayer();
          audioRecorder.removePlayBackListener();
          setIsPlaying(false);
        }
        return;
      });
      setIsPlaying(true);
    }
  };

  // 다음 이동
  const handleNext = () => {
    navigation.navigate(homeNavigations.MID_RESULT, {AudioUri: recordedPath!});
  };

  // 다시 녹음
  const handleReRecord = () => {
    setRecordedPath(undefined);
    setIsPlaying(false);
    setRecordSecs(0);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.card, cardStyle]}>
        <Text style={styles.subtitle}>
          녹음 버튼을 누른 후{`\n`}아래 문장을 또박또박 읽어주세요
        </Text>
        <Text style={styles.title}>
          "나는 바지를 입고 단추를 채웁니다."{`\n`}라고 말해보세요
        </Text>
        <Text style={styles.cautiontext}>
          ※ 주변 소음을 줄이고 마이크에 가까이 말해주세요 ※
        </Text>
      </Animated.View>

      {!recordedPath && (
        <View style={[styles.buttonCardWrapper, {bottom: insets.bottom + 10}]}>
          <Animated.View style={buttonAnimStyle}>
            <Pressable
              onPressIn={() => {
                btnScale.value = withTiming(0.9, {duration: 100});
                onStartRecord();
              }}
              onPressOut={() => {
                btnScale.value = withTiming(1, {duration: 100});
                onStopRecord();
              }}
              style={[
                styles.recordButton,
                isRecording && styles.recordButtonActive,
              ]}>
              <Ionicons
                name={isRecording ? 'mic-off' : 'mic'}
                size={40}
                color={colors.WHITE}
              />
            </Pressable>
          </Animated.View>
        </View>
      )}

      {recordedPath && (
        <Animated.View
          style={[
            styles.controlsContainer,
            buttonAnimStyle,
            {bottom: insets.bottom + 10},
          ]}>
          <Pressable onPress={handleReRecord} style={styles.controlButton}>
            <Ionicons name="refresh" size={35} color={colors.WHITE} />
            <Text style={styles.controlLabel}>다시하기</Text>
          </Pressable>
          <Pressable onPress={onTogglePlay} style={styles.controlButton}>
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={35}
              color={colors.WHITE}
            />
            <Text style={styles.controlLabel}>
              {isPlaying ? '일시정지' : '재생'}
            </Text>
          </Pressable>
          <Pressable onPress={handleNext} style={styles.controlButton}>
            <Ionicons name="chevron-forward" size={35} color={colors.WHITE} />
            <Text style={styles.controlLabel}>다음</Text>
          </Pressable>
        </Animated.View>
      )}
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
    padding: 16,
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
  buttonCardWrapper: {
    position: 'absolute',
    alignSelf: 'center',
    width: CARD_WIDTH,
    alignItems: 'center',
  },
  recordButton: {
    width: 80,
    height: 80,
    backgroundColor: colors.RED,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonActive: {
    backgroundColor: '#c0392b',
  },
  controlsContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'center',
    width: CARD_WIDTH,
    paddingVertical: 12,
    backgroundColor: colors.BLUE,
    borderRadius: 16,
  },
  controlButton: {
    alignItems: 'center',
  },
  controlLabel: {
    marginTop: 4,
    fontSize: 12,
    color: colors.WHITE,
  },
});

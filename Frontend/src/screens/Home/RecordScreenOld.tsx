// src/screens/home/RecordScreen.tsx
import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  Pressable,
  Alert,
  Platform,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import RNFS from 'react-native-fs';
import AudioRecorderPlayer, {
  AudioSet,
  AVEncodingOption,
  AVModeIOSOption,
  AVEncoderAudioQualityIOSType,
} from 'react-native-audio-recorder-player';
import usePermission from '@/hooks/usePermission';
import {prepareAudioSession, resetAudioSession} from '@/utils/audioSession';
import {colors, homeNavigations} from '@/constants';
import CustomButton from '@/components/commons/CustomButton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StackScreenProps} from '@react-navigation/stack';
import {HomeStackParamList} from '@/navigations/stack/HomeStackNavigator';

async function wait(ms: number) {
  return new Promise(resolve => setTimeout(() => resolve(undefined), ms));
}

export default function RecordScreen({
  navigation,
  route,
}: StackScreenProps<HomeStackParamList, typeof homeNavigations.RECORD>) {
  const {CameraUri} = route.params;

  // 마이크 권한 체크
  usePermission('MICROPHONE');

  const insets = useSafeAreaInsets();
  const recorder = useRef(new AudioRecorderPlayer()).current;

  const [uri, setUri] = useState<string>();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const cardOpacity = useSharedValue(0);
  const btnScale = useSharedValue(1);

  React.useEffect(() => {
    cardOpacity.value = withTiming(1, {duration: 500});
  }, []);
  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{scale: cardOpacity.value * 0.05 + 0.95}],
  }));
  const buttonAnim = useAnimatedStyle(() => ({
    transform: [{scale: btnScale.value}],
  }));

  // 녹음 파일 경로 생성
  const getFilePath = () => {
    const fileName = `record_${Date.now()}.wav`;
    return `${RNFS.CachesDirectoryPath}/${fileName}`;
  };

  const audioSet: AudioSet = {
    AVModeIOS: AVModeIOSOption.measurement,
    AVFormatIDKeyIOS: AVEncodingOption.wav,
    AVSampleRateKeyIOS: 44100,
    AVNumberOfChannelsKeyIOS: 1,
    AVLinearPCMBitDepthKeyIOS: 16,
    AVLinearPCMIsBigEndianKeyIOS: false,
    AVLinearPCMIsFloatKeyIOS: false,
    AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
  };

  const onRecordToggle = async () => {
    btnScale.value = withTiming(0.9, {duration: 100});

    try {
      if (isRecording) {
        // ── 녹음 중지 ──
        const result = await recorder.stopRecorder();
        recorder.removeRecordBackListener();
        console.log('▶ 녹음 중지, 파일 경로:', result);
        setUri(result);
        setIsRecording(false);

        // (iOS) AVAudioSession 비활성화
        if (Platform.OS === 'ios') {
          await resetAudioSession();
        }
        return;
      }

      // ── 녹음 시작 ──
      // (iOS) AVAudioSession 활성화
      if (Platform.OS === 'ios') {
        console.log('▶ prepareAudioSession 호출 전');
        await prepareAudioSession();
        console.log('▶ prepareAudioSession 완료, 200ms 대기');
        // 딜레이를 줘서 세션 활성화가 안정적으로 완료되도록 함
        await wait(200);
      }

      // 실제 녹음 시작
      const path = getFilePath();
      console.log('▶ 녹음 시작 경로:', path);

      const result = await recorder.startRecorder(path, audioSet);
      recorder.addRecordBackListener(e => {
        console.log('▶ 녹음 중(ms):', e.currentPosition);
      });
      setIsRecording(true);
    } catch (e) {
      console.warn('▶ onRecordToggle 에러:', e);
      Alert.alert(
        '녹음 오류',
        e instanceof Error ? e.message : '녹음 중 오류가 발생했습니다.',
      );

      // iOS에서 세션이 꼬였을 수 있으니, 에러 시 세션 리셋
      if (Platform.OS === 'ios') {
        try {
          await resetAudioSession();
        } catch (err) {
          console.warn('▶ resetAudioSession 중 추가 에러:', err);
        }
        setIsRecording(false);
      }
    } finally {
      setTimeout(() => (btnScale.value = withTiming(1, {duration: 100})), 100);
    }
  };

  const onPlayToggle = async () => {
    if (!uri) return;
    const playUri = uri.startsWith('file://') ? uri : `file://${uri}`;
    try {
      if (isPlaying) {
        await recorder.stopPlayer();
        recorder.removePlayBackListener();
        setIsPlaying(false);
      } else {
        await recorder.startPlayer(playUri);
        recorder.setVolume(1.0);
        recorder.addPlayBackListener(e => {
          if (e.currentPosition === e.duration) {
            recorder.stopPlayer();
            recorder.removePlayBackListener();
            setIsPlaying(false);
          }
        });
        setIsPlaying(true);
      }
    } catch (e) {
      Alert.alert('재생 오류', e instanceof Error ? e.message : String(e));
    }
  };

  const onReRecord = () => {
    setUri(undefined);
    setIsPlaying(false);
  };

  const goNext = () => {
    if (uri) {
      navigation.navigate(homeNavigations.LOADING, {
        CameraUri,
        AudioUri: uri,
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.card, cardStyle]}>
        <Text style={styles.subtitle}>
          녹음 버튼을 누른 후,{'\n'}문장을 또박 또박 읽어주세요
        </Text>
        <Text style={styles.title}>"나는 바지를 입고 단추를 채웁니다."</Text>
        <Text style={styles.cautiontext}>
          ※ 주변 소음 줄이고 마이크 가까이 ※ {'\n'}
          녹음이 끝나면 완료 버튼을 눌러주세요
        </Text>
      </Animated.View>

      {!uri ? (
        <View style={[styles.buttonWrapper, {bottom: insets.bottom + 10}]}>
          <Animated.View style={buttonAnim}>
            <Pressable
              onPress={onRecordToggle}
              style={[styles.recordBtn, isRecording && styles.recordActive]}>
              <MaterialIcons
                name={isRecording ? 'mic-off' : 'mic'}
                size={50}
                color={colors.WHITE}
              />
            </Pressable>
          </Animated.View>
        </View>
      ) : (
        <View style={[styles.controls, {bottom: insets.bottom + 10}]}>
          <Pressable onPress={onPlayToggle} style={styles.controlBtn}>
            <MaterialIcons
              name={isPlaying ? 'pause-circle' : 'play-circle'}
              size={62}
              color={colors.BLUE}
            />
          </Pressable>
          <CustomButton
            label="다시 녹음"
            variant="filled"
            onPress={onReRecord}
            style={styles.actionButton}
            textStyle={styles.ButtonText}
          />
          <CustomButton
            label="완료"
            variant="filled"
            onPress={goNext}
            style={[styles.actionButton, styles.confirmButton]}
            textStyle={styles.ButtonText}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const {width: SCREEN_W, height: SCREEN_H} = Dimensions.get('window');
const CARD_WIDTH = SCREEN_W * 0.85;
const CARD_HEIGHT = SCREEN_H * 0.4;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.BACKGRAY,
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: colors.WHITE,
    borderRadius: 16,
    padding: 16,
    marginTop: 90,
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
    fontSize: 18,
    color: colors.BLACK,
    textAlign: 'center',
    lineHeight: 26,
  },
  title: {
    fontSize: 22,
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
  buttonWrapper: {
    position: 'absolute',
    alignSelf: 'center',
    width: CARD_WIDTH,
    alignItems: 'center',
  },
  recordBtn: {
    width: 80,
    height: 80,
    backgroundColor: colors.RED,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordActive: {
    backgroundColor: '#c0392b',
  },
  controls: {
    position: 'absolute',
    flexDirection: 'column',
    alignItems: 'center',
    width: CARD_WIDTH,
  },
  controlBtn: {
    marginBottom: 12,
  },
  actionButton: {
    width: '100%',
    fontSize: 20,
    marginBottom: 12,
    backgroundColor: colors.RED,
  },
  ButtonText: {
    fontSize: 18,
    color: colors.WHITE,
  },
  confirmButton: {
    backgroundColor: colors.MAINBLUE,
    marginBottom: 0,
  },
});

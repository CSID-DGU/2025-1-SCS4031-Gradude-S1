import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  Platform,
  Alert,
  Button,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RNFS from 'react-native-fs';
import AudioRecorderPlayer, {
  AudioSet,
  AVEncodingOption,
  AVModeIOSOption,
  AVEncoderAudioQualityIOSType,
} from 'react-native-audio-recorder-player';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {colors, homeNavigations} from '@/constants';
import CustomButton from '@/components/commons/CustomButton';
import {StackScreenProps} from '@react-navigation/stack';
import {HomeStackParamList} from '@/navigations/stack/HomeStackNavigator';

async function ensureMicPermission() {
  if (Platform.OS === 'ios') {
    const status = await check(PERMISSIONS.IOS.MICROPHONE);
    if (status !== RESULTS.GRANTED) {
      const result = await request(PERMISSIONS.IOS.MICROPHONE);
      if (result !== RESULTS.GRANTED) {
        throw new Error('마이크 권한이 필요합니다.');
      }
    }
  }
}

const {width: SCREEN_W, height: SCREEN_H} = Dimensions.get('window');
const CARD_WIDTH = SCREEN_W * 0.85;
const CARD_HEIGHT = SCREEN_H * 0.4;

type Props = StackScreenProps<
  HomeStackParamList,
  typeof homeNavigations.RECORD
>;

export default function RecordScreen({navigation}: Props) {
  const insets = useSafeAreaInsets();
  const recorder = useRef(new AudioRecorderPlayer()).current;

  const [uri, setUri] = useState<string>();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const cardOpacity = useSharedValue(0);
  const btnScale = useSharedValue(1);
  useEffect(() => {
    cardOpacity.value = withTiming(1, {duration: 500});
  }, []);
  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{scale: cardOpacity.value * 0.05 + 0.95}],
  }));
  const buttonAnim = useAnimatedStyle(() => ({
    transform: [{scale: btnScale.value}],
  }));
  // WAV 전용 경로 (iOS file:// prefix 필수)
  const wavPath = Platform.select({
    ios: `file://${RNFS.CachesDirectoryPath}/record_${Date.now()}.wav`,
    android: `${RNFS.CachesDirectoryPath}/record_${Date.now()}.wav`,
  })!;
  // 녹음 설정 (WAV, 44.1kHz, 16bit, mono)
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
      await ensureMicPermission();
      if (isRecording) {
        const result = await recorder.stopRecorder();
        recorder.removeRecordBackListener();
        setUri(result);
        setIsRecording(false);
      } else {
        setUri(undefined);
        const result = await recorder.startRecorder(wavPath, audioSet);
        recorder.addRecordBackListener(e =>
          console.log('pos', e.currentPosition),
        );
        setIsRecording(true);
      }
    } catch (e) {
      Alert.alert('녹음 오류', e instanceof Error ? e.message : String(e));
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
  const goNext = () =>
    uri && navigation.navigate(homeNavigations.LOADING, {AudioUri: uri});

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.card, cardStyle]}>
        <Text style={styles.subtitle}>
          녹음 버튼을 누른 후,{`\n`}문장을 또박 또박 읽어주세요
        </Text>
        <Text style={styles.title}>"나는 바지를 입고 단추를 채웁니다."</Text>
        <Text style={styles.cautiontext}>
          ※ 주변 소음 줄이고 마이크 가까이 ※ {`\n`}
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
  cautiontext: {fontSize: 15, color: colors.GRAY, textAlign: 'center'},
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
  recordActive: {backgroundColor: '#c0392b'},
  controls: {
    position: 'absolute',
    flexDirection: 'column',
    alignItems: 'center',
    width: CARD_WIDTH,
  },
  controlBtn: {marginBottom: 12},
  actionButton: {
    width: '100%',
    fontSize: 20,
    marginBottom: 12,
    backgroundColor: colors.RED,
  },
  ButtonText: {fontSize: 18, color: colors.WHITE},
  confirmButton: {backgroundColor: colors.MAINBLUE, marginBottom: 0},
});

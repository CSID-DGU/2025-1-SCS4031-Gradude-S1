import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Pressable,
  Alert,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {
  useAudioRecorder,
  useAudioPlayer,
  useAudioPlayerStatus,
  AudioModule,
  IOSOutputFormat,
  AudioQuality,
} from 'expo-audio';
import type {AndroidOutputFormat, AndroidAudioEncoder} from 'expo-audio';
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

export default function RecordScreen({
  navigation,
  route,
}: StackScreenProps<HomeStackParamList, typeof homeNavigations.RECORD>) {
  const {CameraUri} = route.params;

  // WAV 파일을 위한 커스텀 녹음 옵션
  const wavRecordingOptions = {
    extension: '.wav',
    sampleRate: 44100,
    numberOfChannels: 1, // Mono
    bitRate: 128000,
    android: {
      outputFormat: 'default' as AndroidOutputFormat,
      audioEncoder: 'default' as AndroidAudioEncoder,
    },
    ios: {
      outputFormat: IOSOutputFormat.LINEARPCM,
      audioQuality: AudioQuality.HIGH,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
    web: {
      mimeType: 'audio/wav',
      bitsPerSecond: 128000,
    },
  };

  const insets = useSafeAreaInsets();
  const audioRecorder = useAudioRecorder(wavRecordingOptions);
  const audioPlayer = useAudioPlayer();
  const audioPlayerStatus = useAudioPlayerStatus(audioPlayer);

  const [recordingUri, setRecordingUri] = useState<string>();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const cardOpacity = useSharedValue(0);
  const btnScale = useSharedValue(1);

  useEffect(() => {
    cardOpacity.value = withTiming(1, {duration: 500});

    // 권한 요청
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert(
          '권한 필요',
          '마이크 권한이 필요합니다. 설정에서 권한을 허용해주세요.',
        );
      }
    })();

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (isRecording) {
        audioRecorder.stop();
      }
      if (isPlaying) {
        audioPlayer.pause();
      }
    };
  }, [cardOpacity, audioRecorder, audioPlayer, isRecording, isPlaying]);

  // 재생 완료 감지
  useEffect(() => {
    if (audioPlayerStatus?.didJustFinish && isPlaying) {
      console.log('▶ 재생 완료 감지');
      setIsPlaying(false);
    }
  }, [audioPlayerStatus?.didJustFinish, isPlaying]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{scale: cardOpacity.value * 0.05 + 0.95}],
  }));
  const buttonAnim = useAnimatedStyle(() => ({
    transform: [{scale: btnScale.value}],
  }));

  const onRecordToggle = async () => {
    btnScale.value = withTiming(0.9, {duration: 100});

    try {
      if (isRecording) {
        // ── 녹음 중지 ──
        await audioRecorder.stop();
        const uri = audioRecorder.uri;
        console.log('▶ 녹음 중지, 파일 경로:', uri);
        setRecordingUri(uri || undefined);
        setIsRecording(false);
        return;
      }

      // ── 녹음 시작 ──
      console.log('▶ 녹음 준비 중...');
      await audioRecorder.prepareToRecordAsync();
      console.log('▶ 녹음 시작');

      audioRecorder.record();
      setIsRecording(true);
    } catch (e) {
      console.error('▶ 녹음 오류:', {
        error: e,
        message: e instanceof Error ? e.message : String(e),
      });

      Alert.alert(
        '녹음 오류',
        '녹음을 시작할 수 없습니다. 마이크 권한을 확인하고 다시 시도해주세요.',
      );
      setIsRecording(false);
    } finally {
      setTimeout(() => (btnScale.value = withTiming(1, {duration: 100})), 100);
    }
  };

  const onPlayToggle = async () => {
    if (!recordingUri) return;

    try {
      if (isPlaying) {
        audioPlayer.pause();
        setIsPlaying(false);
      } else {
        // 새로운 오디오 소스 로드
        console.log('▶ 재생 준비 중...');
        audioPlayer.replace(recordingUri);
        console.log('▶ 재생 시작');
        audioPlayer.play();
        setIsPlaying(true);
      }
    } catch (e) {
      console.error('재생 에러:', e);
      Alert.alert('재생 오류', e instanceof Error ? e.message : String(e));
      setIsPlaying(false);
    }
  };

  const onReRecord = () => {
    setRecordingUri(undefined);
    setIsPlaying(false);
    if (isPlaying) {
      audioPlayer.pause();
    }
  };

  const goNext = () => {
    if (recordingUri) {
      navigation.navigate(homeNavigations.LOADING, {
        CameraUri,
        AudioUri: recordingUri,
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

      {!recordingUri ? (
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

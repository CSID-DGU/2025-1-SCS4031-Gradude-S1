import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Pressable,
  Alert,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {useAudioPlayer, useAudioPlayerStatus, AudioModule} from 'expo-audio';
import {Asset} from 'expo-asset';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '@/components/commons/CustomButton';
import {colors, homeNavigations} from '@/constants';
import type {StackScreenProps} from '@react-navigation/stack';
import type {HomeStackParamList} from '@/navigations/stack/HomeStackNavigator';

export default function RecordScreen({
  navigation,
  route,
}: StackScreenProps<HomeStackParamList, typeof homeNavigations.RECORD>) {
  const {CameraUri} = route.params;
  const insets = useSafeAreaInsets();

  const audioPlayer = useAudioPlayer();
  const audioPlayerStatus = useAudioPlayerStatus(audioPlayer);

  // (1) 번들된 로컬 오디오 파일 URI
  const [fileUri, setFileUri] = useState<string>();
  // (2) “녹음 중” 상태를 보여주기 위한 플래그
  const [isRecording, setIsRecording] = useState(false);
  // (3) “녹음” 완료 후 다음 화면으로 넘길 때 사용할 URI
  const [recordingUri, setRecordingUri] = useState<string>();
  // (4) 오디오 재생 상태
  const [isPlaying, setIsPlaying] = useState(false);
  // (5) asset 로딩 중 상태
  const [isLoadingAsset, setIsLoadingAsset] = useState(true);

  // 카드 등장 애니메이션
  const cardOpacity = useSharedValue(0);
  const btnScale = useSharedValue(1);

  useEffect(() => {
    // 카드 Fade-in 애니메이션
    cardOpacity.value = withTiming(1, {duration: 500});

    // (A) 마운트 시점에 오디오 권한 요청
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert(
          '권한 필요',
          '오디오 권한이 필요합니다. 설정에서 권한을 허용해주세요.',
        );
      }
    })();

    // (B) 번들된 sample.wav asset을 로드해서 실제 로컬 URI를 가져온다
    (async () => {
      try {
        // 경로는 프로젝트 구조에 맞게 바꿔주세요.
        const asset = Asset.fromModule(require('@/assets/audio/sample.wav'));
        await asset.downloadAsync();
        if (asset.localUri) {
          setFileUri(asset.localUri);
        } else {
          throw new Error('로컬 오디오 URI를 찾을 수 없습니다.');
        }
      } catch (err: any) {
        console.error('▶ asset 로드 오류:', err);
        Alert.alert(
          '파일 로드 오류',
          '오디오 파일을 불러올 수 없습니다. 다시 시도해주세요.',
        );
      } finally {
        setIsLoadingAsset(false);
      }
    })();

    // 언마운트 시 클린업
    return () => {
      if (isPlaying) {
        audioPlayer.pause();
      }
    };
  }, [audioPlayer, cardOpacity, isPlaying]);

  // 재생 완료 감지: 재생이 끝나면 isPlaying을 false로
  useEffect(() => {
    if (audioPlayerStatus?.didJustFinish && isPlaying) {
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

  /**
   * (C) “녹음” 버튼을 누르면:
   * - isRecording이 false(녹음 대기)면, 녹음 시작 모드로 전환
   * - isRecording이 true(녹음 중)면, 녹음 중지 및 recordingUri에 fileUri 세팅
   */
  const onRecordToggle = () => {
    if (isLoadingAsset || !fileUri) return;

    // 애니메이션
    btnScale.value = withTiming(0.9, {duration: 100});
    setTimeout(() => {
      btnScale.value = withTiming(1, {duration: 100});
    }, 100);

    if (!isRecording) {
      // 녹음 시작
      setIsRecording(true);
    } else {
      // 녹음 중이던 상태 → 중지 후 녹음 완료
      setIsRecording(false);
      setRecordingUri(fileUri);
    }
  };

  /**
   * (D) 재생 버튼을 토글하면:
   * - recordingUri를 audioPlayer에 로드 후 재생/일시정지
   */
  const onPlayToggle = async () => {
    if (!recordingUri) return;

    btnScale.value = withTiming(0.9, {duration: 100});
    setTimeout(() => {
      btnScale.value = withTiming(1, {duration: 100});
    }, 100);

    try {
      if (isPlaying) {
        await audioPlayer.pause();
        setIsPlaying(false);
      } else {
        await audioPlayer.replace(recordingUri);
        await audioPlayer.play();
        setIsPlaying(true);
      }
    } catch (e: any) {
      console.error('▶ 재생 에러:', e);
      Alert.alert('재생 오류', e instanceof Error ? e.message : String(e));
      setIsPlaying(false);
    }
  };

  // (E) 다시 녹음하기: 상태 초기화
  const onReRecord = () => {
    setRecordingUri(undefined);
    setIsPlaying(false);
    if (isPlaying) {
      audioPlayer.pause();
    }
  };

  /**
   * (F) “완료” 버튼: recordingUri가 있으면 다음 화면으로 네비게이션
   */
  const goNext = () => {
    if (recordingUri) {
      navigation.navigate(homeNavigations.LOADING, {
        CameraUri,
        AudioUri: recordingUri,
      });
    }
  };

  // ■ UI 렌더링 ■
  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.card, cardStyle]}>
        <Text style={styles.subtitle}>
          녹음 버튼을 누른 후,{'\n'}문장을 또박 또박 읽어주세요
        </Text>
        <Text style={styles.title}>"나는 바지를 입고 단추를 채웁니다."</Text>
        <Text style={styles.cautiontext}>
          ※ 주변 소음 줄이고 마이크 가까이 ※ {'\n'}
          녹음을 중지하려면 버튼을 다시 눌러주세요
        </Text>
      </Animated.View>

      {/* 1) 아직 녹음 완료 전: 녹음 시작/중지 버튼 (isRecording 토글) */}
      {!recordingUri && (
        <View style={[styles.buttonWrapper, {bottom: insets.bottom + 10}]}>
          {isLoadingAsset ? (
            <View style={styles.loadingWrapper}>
              <ActivityIndicator size="large" color={colors.MAINBLUE} />
              <Text style={{marginTop: 8, color: colors.GRAY}}>
                오디오 로딩 중...
              </Text>
            </View>
          ) : (
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
          )}
        </View>
      )}

      {/* 2) 녹음 완료 후: 재생 버튼 + 다시 녹음 / 완료 버튼 */}
      {recordingUri && (
        <View style={[styles.controls, {bottom: insets.bottom + 10}]}>
          <Animated.View style={buttonAnim}>
            {/* <Pressable onPress={onPlayToggle} style={styles.playBtn}>
              <MaterialIcons
                name={isPlaying ? 'pause-circle' : 'play-circle'}
                size={62}
                color={colors.MAINBLUE}
              />
            </Pressable> */}
          </Animated.View>

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
  loadingWrapper: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    width: CARD_WIDTH,
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
  playBtn: {
    marginBottom: 20,
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

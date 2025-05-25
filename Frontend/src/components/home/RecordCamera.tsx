import {colors} from '@/constants';
import React, {useRef, useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Linking,
  SafeAreaView,
  TouchableOpacity,
  Button,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';

type Props = {
  label: string;
  onFinish: (uri: string) => void;
};

const ICON_BG_SIZE = 40;

export default function RecordCamera({label, onFinish}: Props) {
  const cameraRef = useRef<Camera>(null);
  const videoRef = useRef<Video>(null);
  const countdownInterval = useRef<number | null>(null);

  // 권한 요청 (이부분 유지)
  const {hasPermission, requestPermission} = useCameraPermission();
  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);

  // 전/후면 토글
  const [position, setPosition] = useState<'front' | 'back'>('front');
  const device = useCameraDevice(position);

  // 녹화 상태 & 카운트다운
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // 녹화 시작
  const startRecording = useCallback(async () => {
    if (!device || !cameraRef.current || isRecording) return;
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        Linking.openSettings();
        return;
      }
    }

    setIsRecording(true);
    setCountdown(3);
    countdownInterval.current = setInterval(() => {
      setCountdown(prev => {
        if (prev !== null && prev <= 1) {
          if (countdownInterval.current !== null) {
            clearInterval(countdownInterval.current);
            countdownInterval.current = null;
          }
          return null;
        }
        return (prev || 0) - 1;
      });
    }, 1000) as unknown as number;

    cameraRef.current.startRecording({
      onRecordingFinished: ({path}) => {
        setRecordedUri(path);
        setIsRecording(false);
        setIsPlaying(false);
      },
      onRecordingError: console.error,
    });

    // 3초 뒤 자동 정지로 설정
    setTimeout(() => cameraRef.current?.stopRecording(), 3000);
  }, [device, hasPermission, isRecording, requestPermission]);

  // 클린업
  useEffect(() => {
    return () => {
      if (countdownInterval.current !== null) {
        clearInterval(countdownInterval.current);
      }
    };
  }, []);

  // 렌더링 단계
  if (!device)
    return (
      <View style={styles.center}>
        <Text>카메라 준비 중…</Text>
      </View>
    );
  if (hasPermission === undefined)
    return (
      <View style={styles.center}>
        <Text>권한 확인 중…</Text>
      </View>
    );
  if (!hasPermission)
    return (
      <View style={styles.center}>
        <Text style={styles.text}>카메라 권한이 필요합니다.</Text>
        <Button title="권한 요청하기" onPress={requestPermission} />
      </View>
    );

  if (recordedUri) {
    return (
      <View style={styles.container}>
        <Video
          ref={videoRef}
          source={{uri: recordedUri}}
          style={StyleSheet.absoluteFill}
          controls={false}
          paused={!isPlaying}
          resizeMode="contain"
          onEnd={() => setIsPlaying(false)}
        />
        {!isPlaying && (
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => {
              videoRef.current?.seek(0);
              setIsPlaying(true);
            }}>
            <Ionicons name="play-circle" size={80} color={colors.WHITE} />
          </TouchableOpacity>
        )}
        <SafeAreaView style={styles.confirmContainer}>
          <TouchableOpacity
            style={[styles.confirmButton, {left: 40}]}
            onPress={() => {
              setIsPlaying(false);
              setRecordedUri(null);
            }}>
            <Text style={styles.confirmText}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.confirmButton, {right: 40}]}
            onPress={() => onFinish(recordedUri)}>
            <Text style={styles.confirmText}>확인</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive
        video
        audio={false}
      />

      {/* 카운트다운 오버레이 */}
      {countdown !== null && (
        <View style={styles.countdownContainer}>
          <View style={styles.redDot} />
          <Text style={styles.countdownText}>{countdown}</Text>
        </View>
      )}

      {/* 하단: 녹화 버튼 중앙, 전환 버튼 우측 */}
      <SafeAreaView style={styles.bottomControls}>
        <TouchableOpacity onPress={startRecording} style={styles.recordButton}>
          <View
            style={[
              styles.innerShape,
              isRecording && styles.innerShapeRecording,
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setPosition(p => (p === 'front' ? 'back' : 'front'))}
          style={styles.toggleButtonAbsolute}>
          <Ionicons
            name="camera-reverse"
            size={ICON_BG_SIZE}
            color={colors.WHITE}
          />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000'},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  text: {fontSize: 16, marginBottom: 12},
  confirmContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 40,
  },
  confirmButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.BLACK,
    borderRadius: 6,
  },
  confirmText: {color: colors.WHITE, fontSize: 20, fontWeight: 'bold'},
  countdownContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: '8%',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 20,
  },
  redDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.RED,
    marginRight: 8,
  },
  countdownText: {color: colors.WHITE, fontSize: 18, fontWeight: 'bold'},
  bottomControls: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButtonAbsolute: {
    position: 'absolute',
    right: 40,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: ICON_BG_SIZE / 2,
    padding: 8,
  },
  innerShape: {
    width: 55,
    height: 55,
    borderRadius: 35,
    backgroundColor: colors.RED,
  },
  innerShapeRecording: {
    width: 35,
    height: 35,
    borderRadius: 10,
    backgroundColor: colors.RED[400],
  },
  playButton: {
    position: 'absolute',
    top: '45%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
});

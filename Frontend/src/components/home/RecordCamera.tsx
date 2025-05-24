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

const ICON_BG_SIZE = 30;

export default function RecordCamera({label, onFinish}: Props) {
  const cameraRef = useRef<Camera>(null);

  // ▶ 권한 훅 (이대로 유지)
  const {hasPermission, requestPermission} = useCameraPermission();
  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);

  // ▶ 전/후면 토글을 위한 상태
  const [position, setPosition] = useState<'front' | 'back'>('front');
  const device = useCameraDevice(position);

  // ▶ 녹화 상태와 결과 URI
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);

  // ▶ 녹화 시작
  const startRecording = useCallback(async () => {
    if (!device || !cameraRef.current || isRecording) return;

    // 권한 재확인
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        Linking.openSettings();
        return;
      }
    }

    setIsRecording(true);
    cameraRef.current.startRecording({
      onRecordingFinished: ({path}) => {
        setRecordedUri(path);
        setIsRecording(false);
      },
      onRecordingError: console.error,
    });

    // 3초 뒤 자동 정지
    setTimeout(() => cameraRef.current?.stopRecording(), 3000);
  }, [device, hasPermission, isRecording, requestPermission]);

  // 1) 디바이스 준비 중
  if (!device) {
    return (
      <View style={styles.center}>
        <Text>카메라 준비 중…</Text>
      </View>
    );
  }
  // 2) 권한 요청 중
  if (hasPermission === undefined) {
    return (
      <View style={styles.center}>
        <Text>권한 확인 중…</Text>
      </View>
    );
  }
  // 3) 권한 거부됨
  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>카메라 권한이 필요합니다.</Text>
        <Button title="권한 요청하기" onPress={requestPermission} />
      </View>
    );
  }

  // 4) 녹화 후 재생 & 확인·취소 UI
  if (recordedUri) {
    return (
      <View style={styles.container}>
        <Video
          source={{uri: recordedUri}}
          style={StyleSheet.absoluteFill}
          controls
          resizeMode="contain"
        />
        <SafeAreaView style={styles.confirmContainer}>
          <TouchableOpacity
            style={[styles.confirmButton, {left: 40}]}
            onPress={() => setRecordedUri(null)} // 재촬영
          >
            <Text style={styles.confirmText}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.confirmButton, {right: 40}]}
            onPress={() => onFinish(recordedUri)} // 완료
          >
            <Text style={styles.confirmText}>확인</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  // 5) 권한 OK, 녹화 전 → 프리뷰 + 버튼
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

      {/* 상단 우측: 전/후면 전환 */}
      <SafeAreaView style={styles.topControls}>
        <TouchableOpacity
          onPress={() =>
            setPosition(pos => (pos === 'front' ? 'back' : 'front'))
          }>
          <Ionicons
            name="camera-reverse"
            size={ICON_BG_SIZE}
            color={colors.WHITE}
          />
        </TouchableOpacity>
      </SafeAreaView>

      {/* 하단 중앙: 녹화 버튼 */}
      <SafeAreaView style={styles.bottomControls}>
        <TouchableOpacity
          onPress={startRecording}
          style={styles.recordButton} // 흰색 테두리 스타일
        >
          <View
            style={[
              styles.innerShape, // 기본 빨간 원
              isRecording && styles.innerShapeRecording, // 녹화 중엔 작은 빨간 네모
            ]}
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
  confirmText: {color: colors.WHITE, fontSize: 16},

  // TODO: 여기 UI 수정
  topControls: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: ICON_BG_SIZE / 2,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },

  // ① 흰색 테두리 원
  recordButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ② 기본 내부 모양: 빨간 원
  innerShape: {
    width: 55,
    height: 55,
    borderRadius: 35,
    backgroundColor: colors.RED,
  },

  // ③ 녹화 중 내부 모양: 작은 빨간 네모
  innerShapeRecording: {
    width: 40,
    height: 40,
    borderRadius: 10, // 네모
    backgroundColor: colors.RED[400],
  },
});

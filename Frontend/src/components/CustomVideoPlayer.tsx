import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  ImageSourcePropType,
  ActivityIndicator,
} from 'react-native';
import VideoPlayer, {type VideoPlayerRef} from 'react-native-video-player';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors} from '@/constants';

const {width: SCREEN_W} = Dimensions.get('window');
const PLAYER_WIDTH = SCREEN_W * 0.9;
const PLAYER_HEIGHT = PLAYER_WIDTH * (9 / 16);

interface Props {
  uri: string;
  thumbnail: ImageSourcePropType;
  videoId: string;
  onBack?: () => void;
}

export default function CustomVideoPlayer({
  uri,
  thumbnail,
  videoId,
  onBack,
}: Props) {
  const playerRef = useRef<VideoPlayerRef>(null);
  const progress = useRef(0);
  const [paused, setPaused] = useState(true);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  // 복원
  useEffect(() => {
    AsyncStorage.getItem(`@videoPos_${videoId}`).then(saved => {
      if (saved && playerRef.current) {
        const pos = parseFloat(saved);
        setPosition(pos);
        playerRef.current.seek(pos);
      }
    });
  }, [videoId]);

  const onLoad = (data: {duration: number}) => setDuration(data.duration);
  const onProgress = (data: {currentTime: number}) => {
    const t = data.currentTime;
    setPosition(t);
    if (Math.floor(t) % 5 === 0) {
      AsyncStorage.setItem(`@videoPos_${videoId}`, t.toString());
    }
  };
  const skip = (sec: number) => {
    const next = Math.max(0, Math.min(position + sec, duration));
    playerRef.current?.seek(next);
    setPosition(next);
  };

  return (
    <View style={styles.container}>
      <VideoPlayer
        ref={(ref: VideoPlayerRef | null) => {
          playerRef.current = ref;
        }}
        endWithThumbnail
        thumbnail={thumbnail}
        source={{uri}}
        onError={(e: any) => console.log(e)}
        showDuration={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    alignSelf: 'center',
    marginVertical: 16,
  },
  skipRow: {
    position: 'absolute',
    top: PLAYER_HEIGHT * 0.45,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
  },
  skipBtn: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 8,
    padding: 6,
  },
  skipText: {
    color: colors.WHITE,
    fontSize: 12,
    marginTop: 2,
  },
});

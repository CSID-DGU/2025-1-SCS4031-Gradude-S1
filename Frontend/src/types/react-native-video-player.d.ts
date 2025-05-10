declare module 'react-native-video-player' {
  import {Component} from 'react';
  import {ImageSourcePropType, StyleProp, ViewStyle} from 'react-native';
  import Video, {OnLoadData, OnProgressData} from 'react-native-video';

  export interface VideoPlayerRef {
    seek(time: number): void;
  }

  export interface VideoPlayerProps {
    video: {uri: string};
    videoWidth?: number;
    videoHeight?: number;
    thumbnail?: ImageSourcePropType;
    endWithThumbnail?: boolean;
    pauseOnPress?: boolean;
    hideControlsOnStart?: boolean;
    resizeMode?: 'contain' | 'cover' | 'stretch';
    pause?: boolean;
    onPlayPress?: () => void;
    onEnd?: () => void;
    onBack?: () => void;
    onLoad?: (data: OnLoadData) => void;
    onProgress?: (data: OnProgressData) => void;
    customStyles?: Partial<
      Record<
        | 'wrapper'
        | 'video'
        | 'thumbnail'
        | 'controls'
        | 'playButton'
        | 'seekBarTrack'
        | 'seekBarProgress'
        | 'seekBarKnob'
        | 'topControls'
        | 'backButton'
        | 'backArrow'
        | 'volumeControl'
        | 'volumeIcon'
        | 'volumeSlider'
        | 'timer'
        | 'nextIcon'
        | 'prevIcon'
        | 'playIcon'
        | 'resizeIcon'
        | 'fullscreenIcon',
        StyleProp<ViewStyle>
      >
    >;
    style?: StyleProp<ViewStyle>;
  }

  export default class VideoPlayer extends Component<
    VideoPlayerProps & React.RefAttributes<VideoPlayerRef>
  > {
    seek(time: number): void;
  }
}

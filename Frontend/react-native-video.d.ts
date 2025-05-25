declare module 'react-native-video' {
  import {Component} from 'react';
  import {StyleProp, ViewStyle} from 'react-native';

  export interface VideoProperties {
    source: {uri: string};
    style?: StyleProp<ViewStyle>;
    controls?: boolean;
    paused?: boolean;
    onEnd?: () => void;
    resizeMode?: 'contain' | 'cover' | 'stretch';
  }

  export default class Video extends React.Component<VideoProperties> {
    /** 특정 시점으로 이동 */
    seek(time: number): void;
  }
}

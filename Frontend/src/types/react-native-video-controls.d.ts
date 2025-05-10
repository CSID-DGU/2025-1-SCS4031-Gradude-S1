declare module 'react-native-video' {
  import {Component} from 'react';
  export interface OnLoadData {
    duration: number;
  }
  export interface OnProgressData {
    currentTime: number;
  }
  export interface VideoProperties {}
  export default class Video extends Component<VideoProperties> {
    seek(time: number): void;
  }
}

declare module 'react-native-video-controls';

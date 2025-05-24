declare module 'react-native-video' {
  import {Component} from 'react';
  import {StyleProp, ViewStyle} from 'react-native';

  export interface VideoProperties {
    source: {uri: string};
    style?: StyleProp<ViewStyle>;
    controls?: boolean;
    resizeMode?: 'contain' | 'cover' | 'stretch';
  }

  export default class Video extends Component<VideoProperties> {}
}

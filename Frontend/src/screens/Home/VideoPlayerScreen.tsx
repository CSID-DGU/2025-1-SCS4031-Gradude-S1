import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import CustomVideoPlayer from '@/components/CustomVideoPlayer';
import type {StackScreenProps} from '@react-navigation/stack';
import {HomeStackParamList} from '@/navigations/stack/HomeStackNavigator';
import {colors} from '@/constants';

type Props = StackScreenProps<HomeStackParamList, 'VideoPlayer'>;

function VideoPlayerScreen({route, navigation}: Props) {
  const {uri, videoId, thumbnail} = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomVideoPlayer
        uri={String(uri)}
        videoId={videoId}
        onBack={() => navigation.goBack()}
        thumbnail={thumbnail}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.BLACK,
  },
});

export default VideoPlayerScreen;

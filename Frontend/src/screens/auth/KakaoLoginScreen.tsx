import React, {useState} from 'react';
import {ActivityIndicator, SafeAreaView, StyleSheet, View} from 'react-native';
import {WebView} from 'react-native-webview';
import Config from 'react-native-config';
import useAuth from '@/hooks/queries/useAuth';
import {authNavigations, colors, homeNavigations} from '@/constants';
import type {StackScreenProps} from '@react-navigation/stack';
import type {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';

type Props = StackScreenProps<
  AuthStackParamList,
  typeof authNavigations.KAKAO_LOGIN
>;

export default function KakaoLoginScreen({navigation}: Props) {
  const CLIENT_ID = Config.KAKAO_CLIENT_ID!;
  const REDIRECT_URI = Config.KAKAO_REDIRECT_URI!;

  const {kakaoLoginMutation} = useAuth();
  const [loading, setLoading] = useState(false);
  const [handled, setHandled] = useState(false);

  // 콜백 URL 접두사
  const callbackPrefix = `${REDIRECT_URI}?code=`;

  // URL이 콜백 패턴에 맞으면 한 번만 처리
  const handleCode = (url: string) => {
    if (handled || !url.startsWith(callbackPrefix)) return;

    setHandled(true);
    const code = url.substring(callbackPrefix.length).split('&')[0];
    setLoading(true);

    kakaoLoginMutation.mutate(code, {
      onSuccess: res => {
        if (res.result.firstLogin) {
          navigation.replace(authNavigations.SIGNUP, {authCode: code});
        } else {
          navigation.getParent()?.reset({
            index: 0,
            routes: [{name: homeNavigations.MAIN_HOME}],
          });
        }
      },
      onSettled: () => setLoading(false),
    });
  };

  // 1) 로그인 처리 중
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.MAINBLUE} />
      </View>
    );
  }

  // 2) 콜백 처리 후에는 WebView 언마운트
  if (handled) {
    return null;
  }

  // 3) 카카오 인증 WebView
  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{
          uri:
            `https://kauth.kakao.com/oauth/authorize` +
            `?response_type=code` +
            `&client_id=${CLIENT_ID}` +
            `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`,
        }}
        // reCAPTCHA가 mixed content 로 로드될 경우
        mixedContentMode="always"
        userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1"
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        originWhitelist={['*']}
        onShouldStartLoadWithRequest={({url}) => {
          handleCode(url);
          // 콜백 처리 전까지만 로드 허용
          return !handled;
        }}
        onNavigationStateChange={({url}) => {
          handleCode(url);
        }}
        style={{flex: 1}}
        onMessage={evt => {
          // 사이트에서 postMessage 해 주는 reCAPTCHA 토큰 받기
          console.log('reCAPTCHA token:', evt.nativeEvent.data);
        }}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={colors.MAINBLUE} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  loader: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});

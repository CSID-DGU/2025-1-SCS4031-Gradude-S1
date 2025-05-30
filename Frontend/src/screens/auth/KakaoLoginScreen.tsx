import React, {useState, useRef} from 'react';
import {ActivityIndicator, SafeAreaView, StyleSheet, View} from 'react-native';
import {WebView, WebViewNavigation} from 'react-native-webview';
import type {StackScreenProps} from '@react-navigation/stack';
import {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';
import {authNavigations, colors} from '@/constants';
import useAuth from '@/hooks/queries/useAuth';
import Config from 'react-native-config';

type Props = StackScreenProps<
  AuthStackParamList,
  typeof authNavigations.KAKAO_LOGIN
>;

export default function KakaoLoginScreen({navigation}: Props) {
  const {kakaoLoginMutation} = useAuth();
  const [loading, setLoading] = useState(false);
  const handledRef = useRef(false);

  const handleShouldStartLoad = (request: {url: string}) => {
    const {url} = request;
    console.log('⏳ shouldStartLoad:', url);

    if (
      !handledRef.current &&
      url.startsWith(`${Config.KAKAO_REDIRECT_URI}?code=`)
    ) {
      handledRef.current = true;
      const code = url.split('code=')[1]!;
      console.log('✅ [WebView] intercept code:', code);

      setLoading(true);

      console.log(
        '➡️ [Mutate] calling kakaoLoginMutation.mutate with code:',
        code,
      );
      kakaoLoginMutation.mutate(code, {
        onSuccess: res => {
          console.log('✅ [API] kakaoLogin SUCCESS, response:', res);
          navigation.replace(authNavigations.SIGNUP, {authCode: code} as any);
        },
        onError: err => {
          console.error('❌ [API] kakaoLogin ERROR:', err);
          setLoading(false);
          handledRef.current = false;
        },
      });

      return false;
    }

    return true; // 그 외의 URL은 정상 로드
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.BLACK} />
        </View>
      )}

      <WebView
        style={styles.container}
        source={{
          uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${Config.KAKAO_CLIENT_ID}&redirect_uri=${Config.KAKAO_REDIRECT_URI}`,
        }}
        onShouldStartLoadWithRequest={handleShouldStartLoad}
        javaScriptEnabled
        domStorageEnabled
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// KakaoLoginScreen.tsx
import React, {useState, useRef} from 'react';
import {SafeAreaView, View, ActivityIndicator, StyleSheet} from 'react-native';
import {WebView, WebViewNavigation} from 'react-native-webview';
import {CommonActions} from '@react-navigation/native';
import type {StackScreenProps} from '@react-navigation/stack';
import {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';
import {authNavigations, homeNavigations} from '@/constants';
import useAuth from '@/hooks/queries/useAuth';
import Config from 'react-native-config';

type Props = StackScreenProps<
  AuthStackParamList,
  typeof authNavigations.KAKAO_LOGIN
>;

function KakaoLoginScreen({navigation}: Props) {
  const {kakaoLoginMutation} = useAuth();
  const [loading, setLoading] = useState(false);
  const handledRef = useRef(false);
  const CLIENT_ID = Config.KAKAO_CLIENT_ID as string;
  const REDIRECT_URI = Config.KAKAO_REDIRECT_URI as string;
  console.log('CLIENT_ID:', CLIENT_ID);
  console.log('REDIRECT_URI:', REDIRECT_URI);

  // 공통으로 URL을 검사하는 함수
  const processUrl = (url: string) => {
    if (!handledRef.current && url.startsWith(`${REDIRECT_URI}?code=`)) {
      handledRef.current = true;
      const code = url.split('code=')[1]!;

      setLoading(true);
      kakaoLoginMutation.mutate(code, {
        onSuccess: res => {
          const {firstLogin} = res.result;
          if (firstLogin) {
            navigation.replace(authNavigations.SIGNUP, {authCode: code});
            return;
          }
          const rootNav = navigation.getParent();
          if (!rootNav) {
            console.warn('⚠️ RootNavigator를 찾을 수 없습니다.');
            return;
          }
          rootNav.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: 'TabNavigator',
                  state: {
                    index: 0,
                    routes: [{name: homeNavigations.MAIN_HOME}],
                  },
                },
              ],
            }),
          );
        },
        onError: err => {
          console.error('❌ [API] kakaoLogin ERROR:', err);
          setLoading(false);
          handledRef.current = false;
        },
      });
      return false; // 이 URL 로딩을 막음
    }
    return true;
  };

  // iOS WebView용
  const handleShouldStartLoadWithRequest = ({url}: {url: string}) => {
    console.log('🔎 가로챈 URL:', url);
    return processUrl(url);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <WebView
        originWhitelist={['*']}
        style={styles.container}
        source={{
          uri:
            `https://kauth.kakao.com/oauth/authorize` +
            `?response_type=code` +
            `&client_id=${CLIENT_ID}` +
            `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`,
        }}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest} // iOS
        javaScriptEnabled
        domStorageEnabled
        onLoadStart={() => console.log('🔄 WebView started loading')}
        onLoadEnd={() => console.log('✅ WebView loaded')}
        onError={e => console.error('❌ WebView error:', e.nativeEvent)}
        userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1"
      />
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default KakaoLoginScreen;

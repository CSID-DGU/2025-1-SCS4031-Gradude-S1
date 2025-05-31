// KakaoLoginScreen.tsx
import React, {useState, useRef} from 'react';
import {SafeAreaView, View, ActivityIndicator, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import {CommonActions} from '@react-navigation/native'; // ← 추가
import type {StackScreenProps} from '@react-navigation/stack';
import {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';
import {authNavigations, homeNavigations} from '@/constants';
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

    if (
      !handledRef.current &&
      url.startsWith(`${Config.KAKAO_REDIRECT_URI}?code=`)
    ) {
      handledRef.current = true;
      const code = url.split('code=')[1]!;

      setLoading(true);
      kakaoLoginMutation.mutate(code, {
        onSuccess: res => {
          const {firstLogin} = res.result;

          if (firstLogin) {
            // 첫 로그인이라면 회원가입 화면으로 이동
            navigation.replace(authNavigations.SIGNUP, {authCode: code});
            return;
          }

          // RootNavigator를 타고 TabNavigator → HomeStack → MAIN_HOME 으로 진입

          // AuthStackNavigator의 부모인 RootNavigator 객체를 가져옴.
          const rootNav = navigation.getParent();
          if (!rootNav) {
            console.warn('⚠️ RootNavigator를 찾을 수 없습니다.');
            return;
          }

          // CommonActions.reset으로 최상위 상태를 한 번에 재설정
          rootNav.dispatch(
            CommonActions.reset({
              index: 0, // RootNavigator에서 첫 번째(route)로 TabNavigator를 선택
              routes: [
                {
                  name: 'TapNavigator',
                  state: {
                    index: 0,
                    routes: [
                      {
                        name: homeNavigations.MAIN_HOME,
                        // ← HomeStackNavigator에 등록된 MAIN_HOME 스크린 이름
                        // 필요하다면 params: { … } 도 여기에 추가 가능.
                      },
                    ],
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

      return false;
    }
    return true;
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="black" />
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
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

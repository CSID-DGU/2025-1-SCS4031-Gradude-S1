import React, {useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import {WebView, WebViewNavigation} from 'react-native-webview';
import Config from 'react-native-config';
import useAuth from '@/hooks/queries/useAuth';
import {authNavigations, colors} from '@/constants';
import {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';
import {StackScreenProps} from '@react-navigation/stack';

const CLIENT_ID = Config.KAKAO_CLIENT_ID as string;
const REDIRECT_URI = Config.KAKAO_REDIRECT_URI as string;
type KakaoLoginScreenProps = StackScreenProps<
  AuthStackParamList,
  typeof authNavigations.KAKAO_LOGIN
>;
export default function KakaoLoginScreen({navigation}: KakaoLoginScreenProps) {
  const {kakaoLoginMutation} = useAuth();
  const [loading, setLoading] = useState(false);

  const handleNavChange = (event: WebViewNavigation) => {
    const {url, loading: navLoading} = event;
    console.log('URLsfdfsfs:', event.url);

    if (!navLoading && url.startsWith(`${REDIRECT_URI}?code=`)) {
      const code = url.split('?code=')[1];
      setLoading(true);

      kakaoLoginMutation.mutate(code, {
        onSuccess: () => {
          navigation.replace(authNavigations.SIGNUP, {authCode: code});
        },
        onSettled: () => setLoading(false),
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.BLACK} />
      </View>
    );
  }

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
        onNavigationStateChange={handleNavChange}
        startInLoadingState
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  loader: {
    flex: 1,
    backgroundColor: colors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
KakaoLoginScreen;

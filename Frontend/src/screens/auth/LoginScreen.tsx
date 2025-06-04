// src/screens/Auth/LoginScreen.tsx

import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {StackScreenProps} from '@react-navigation/stack';
import {
  loginWithKakaoAccount,
  getProfile,
  KakaoOAuthToken,
  KakaoProfile as KakaoSdkProfile,
} from '@react-native-seoul/kakao-login';

import useAuth from '@/hooks/queries/useAuth';
import {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';
import {authNavigations, colors} from '@/constants';
import CustomButton from '@/components/commons/CustomButton';
import MainIconBlue from '@/assets/icons/MainIconBlue.svg';

type Props = StackScreenProps<
  AuthStackParamList,
  typeof authNavigations.AUTH_HOME
>;

export default function LoginScreen({navigation}: Props) {
  const {kakaoLoginMutation} = useAuth();

  const onPressKakao = async () => {
    try {
      // 1) 카카오 계정으로 로그인 → tokens 반환
      const tokens: KakaoOAuthToken = await loginWithKakaoAccount();
      Alert.alert('카카오 토큰 정보', `accessToken:\n${tokens.accessToken}`);

      // 2) 프로필 정보 가져오기
      const profile: KakaoSdkProfile = await getProfile();

      // 3) 서버에 보낼 payload 준비 (number 타입 그대로)
      const payload = {
        accessToken: tokens.accessToken,
        kakaoId: profile.id,
        nickname: profile.nickname,
        profileImage: profile.thumbnailImageUrl,
      };

      // 4) 서버로 요청
      kakaoLoginMutation.mutate(payload, {
        onSuccess: ({result}) => {
          if (result.firstLogin) {
            // 가입이 필요하면 회원가입 화면으로 이동하며 프로필 전달
            navigation.replace(authNavigations.SIGNUP, {
              kakaoProfile: {
                kakaoId: profile.id,
                nickname: profile.nickname,
                profileImageUrl: profile.thumbnailImageUrl,
              },
            });
          } else {
            // 이미 가입된 유저라면 뒤로 돌아가거나 홈으로
            navigation.goBack();
          }
        },
        onError: error => {
          console.error(error);
          Alert.alert(
            '로그인 실패',
            '카카오 로그인에 실패했습니다. 다시 시도해 주세요.',
          );
        },
      });
    } catch {
      Alert.alert('카카오 로그인 취소', '다시 시도해 주세요.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* --- 로고 & 카피 --- */}
      <View style={styles.imageContainer}>
        <MainIconBlue width={styles.image.width} height={styles.image.height} />
        <Text style={styles.logoText}>다시 봄</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>뇌졸중, 빠르게 진단하고 예방하세요</Text>
        <Text style={styles.subtitle}>
          하루 한 번, 내 건강을 확인하는{'\n'}습관부터 시작해보세요.{'\n'}
          로그인하고 간편한 건강 기능들을 만나보세요!
        </Text>
      </View>

      {/* --- 카카오 버튼 --- */}
      <View style={styles.buttonContainer}>
        <CustomButton
          label="카카오 로그인하기"
          variant="filled"
          size="large"
          onPress={onPressKakao}
          style={styles.kakaoBtn}
          textStyle={styles.kakaoTxt}
          icon={<Ionicons name="chatbubble-sharp" size={16} color="#181600" />}
        />
        {kakaoLoginMutation.isPending && (
          <ActivityIndicator style={{marginTop: 8}} color={colors.MAINBLUE} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 30,
    marginVertical: 30,
  },
  imageContainer: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('screen').width / 2,
  },
  image: {width: '80%', height: '80%'},
  logoText: {
    position: 'absolute',
    bottom: 0,
    fontSize: 35,
    fontWeight: 'bold',
    color: colors.MAINBLUE,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.BLACK,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    color: colors.GRAY,
    textAlign: 'center',
    lineHeight: 25,
    marginBottom: 24,
  },
  buttonContainer: {flex: 1, alignItems: 'center', gap: 10},
  kakaoBtn: {backgroundColor: colors.YELLOW, height: 60, borderRadius: 10},
  kakaoTxt: {color: colors.KAKAOBLACK, fontSize: 18},
});

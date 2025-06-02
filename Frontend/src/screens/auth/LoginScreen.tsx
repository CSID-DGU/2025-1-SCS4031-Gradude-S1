import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';
import CustomButton from '@/components/commons/CustomButton';
import {authNavigations, colors} from '@/constants';
import MainIconBlue from '@/assets/icons/MainIconBlue.svg';
import Ionicons from 'react-native-vector-icons/Ionicons';

type LoginScreenProps = StackScreenProps<
  AuthStackParamList,
  typeof authNavigations.AUTH_HOME
>;

function LoginScreen({navigation}: LoginScreenProps) {
  const onPressKakao = () => {
    console.log('▶️ 카카오 로그인 버튼 pressed →', authNavigations.KAKAO_LOGIN);
    navigation.navigate(authNavigations.KAKAO_LOGIN);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <MainIconBlue
          width={styles.image.width}
          height={styles.image.height}
          style={styles.image}
        />
        <Text style={styles.logoText}>다시 봄</Text>
      </View>
      <View style={styles.TextContainer}>
        <Text style={styles.title}>뇌졸중, 빠르게 진단하고 예방하세요</Text>
        <Text style={styles.subtitle}>
          하루 한 번, 내 건강을 확인하는 {'\n'}
          습관부터 시작해보세요.{'\n'}
          로그인하고 간편한 건강 기능들을 만나보세요!
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          label="카카오 로그인하기"
          variant="filled"
          size="large"
          onPress={onPressKakao}
          style={styles.kakaoButtonContainer}
          textStyle={styles.kakaoButtonText}
          icon={
            <Ionicons name={'chatbubble-sharp'} color={'#181600'} size={16} />
          }
        />
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
    position: 'relative',
  },
  image: {
    width: '80%',
    height: '80%',
  },
  logoText: {
    marginTop: 2,
    marginBottom: 10,
    position: 'absolute',
    bottom: 0,
    fontSize: 35,
    fontWeight: 'bold',
    color: colors.MAINBLUE,
    textAlign: 'center',
  },
  TextContainer: {
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
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 10,
  },
  kakaoButtonContainer: {
    backgroundColor: colors.YELLOW,
    height: 60,
    borderRadius: 10,
  },
  kakaoButtonText: {
    color: colors.KAKAOBLACK,
    fontSize: 18,
  },
});

export default LoginScreen;

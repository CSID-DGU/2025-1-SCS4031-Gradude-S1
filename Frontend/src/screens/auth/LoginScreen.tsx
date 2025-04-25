import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

function LoginScreen({navigation}) {
  return (
    <SafeAreaView>
      <View>
        <Button
          title="로그인하기"
          onPress={() => navigation.navigate('KakaoLogin')}
        />
        <Text>로그인 화면</Text>
      </View>
    </SafeAreaView>
  );
}

// const styles = StyleSheet.create({});

export default LoginScreen;

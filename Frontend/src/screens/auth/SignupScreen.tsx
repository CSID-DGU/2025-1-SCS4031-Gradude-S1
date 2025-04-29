import React from 'react';
import {Button, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

function SignupScreen() {
  return (
    <SafeAreaView>
      <View>
        <Button title="회원가입" />
      </View>
    </SafeAreaView>
  );
}

// const styles = StyleSheet.create({});

export default SignupScreen;

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const KakaoLoginScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Kakao Login Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default KakaoLoginScreen;

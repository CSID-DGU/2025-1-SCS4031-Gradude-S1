import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';

interface HealthResultProps {}

function HealthResult({}: HealthResultProps) {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View>
        <Text>자가 진단 결과</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});

export default HealthResult;

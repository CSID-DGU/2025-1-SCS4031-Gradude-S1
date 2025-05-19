import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

interface FinalResultListScreenProps {}

function FinalResultListScreen({}: FinalResultListScreenProps) {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View>
        <Text>진단 결과 리스트 </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});

export default FinalResultListScreen;

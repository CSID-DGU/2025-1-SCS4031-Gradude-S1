// components/GenderToggle.tsx
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {colors} from '@/constants';

type Gender = 'MALE' | 'FEMALE';

interface Props {
  value: Gender;
  onChange: (g: Gender) => void;
}

export default function GenderToggle({value, onChange}: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          value === 'MALE' ? styles.selected : styles.unselected,
        ]}
        activeOpacity={0.8}
        onPress={() => onChange('MALE')}>
        <Text
          style={[
            styles.text,
            value === 'MALE' ? styles.selectedText : styles.unselectedText,
          ]}>
          남성
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          value === 'FEMALE' ? styles.selected : styles.unselected,
        ]}
        activeOpacity={0.8}
        onPress={() => onChange('FEMALE')}>
        <Text
          style={[
            styles.text,
            value === 'FEMALE' ? styles.selectedText : styles.unselectedText,
          ]}>
          여성
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  button: {
    flex: 1,
    height: 48,
    marginHorizontal: 4,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    backgroundColor: colors.MAINBLUE,
  },
  unselected: {
    backgroundColor: colors.LIGHTGRAY,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  selectedText: {
    color: colors.WHITE,
  },
  unselectedText: {
    color: colors.GRAY,
  },
});

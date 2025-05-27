import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {colors} from '@/constants';
import type {Question} from '@/data/selfDgsQuestion';

const {width} = Dimensions.get('window');

type Props = {
  question: Question & {answer?: number};
  onSelect: (value: number) => void;
  step: number;
  total: number;
};

export default function QuestionCard({question, onSelect, step, total}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.progressRatio}>{`${step}/${total}`}</Text>
        <AnimatedCircularProgress
          size={60}
          width={6}
          fill={(step / total) * 100}
          tintColor={colors.MAINBLUE}
          rotation={0}
          backgroundColor={colors.OBTN}>
          {() => <Text style={styles.progressText}>{step}</Text>}
        </AnimatedCircularProgress>
      </View>
      <View style={styles.card}>
        <Text style={styles.questionText}>{question.text}</Text>
      </View>
      <View style={styles.answerContainer}>
        {question.options.map(opt => {
          const selected = opt.value === question.answer;
          return (
            <TouchableOpacity
              key={opt.id}
              style={[styles.option, selected && styles.optionSelected]}
              onPress={() => onSelect(opt.value)}>
              <Text
                style={[
                  styles.optionLabel,
                  selected && styles.optionLabelSelected,
                ]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    backgroundColor: colors.BACKGRAY,
  },
  progressContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: -30,
    zIndex: 2,
  },
  progressRatio: {fontSize: 14, fontWeight: 'bold', marginBottom: 4},
  progressText: {fontSize: 26, fontWeight: 'bold', color: colors.BLACK},
  card: {
    width: width - 48,
    backgroundColor: colors.WHITE,
    borderRadius: 12,
    padding: 16,
    paddingTop: 40,
    shadowColor: colors.GRAY,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 3},
    elevation: 4,
    zIndex: 1,
  },
  questionText: {
    fontSize: 22,
    paddingTop: 6,
    fontWeight: 'bold',
    color: colors.BLACK,
    textAlign: 'center',
    marginBottom: 24,
  },
  answerContainer: {
    width: width - 48,
    backgroundColor: colors.WHITE,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    shadowColor: colors.GRAY,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 3},
    elevation: 4,
  },
  option: {
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 30,
    marginBottom: 12,
    backgroundColor: '#EEEEEE',
  },
  optionSelected: {
    backgroundColor: colors.MAINBLUE,
    borderColor: colors.MAINBLUE,
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.BLACK,
  },
  optionLabelSelected: {
    color: colors.WHITE,
    fontWeight: '600',
  },
});

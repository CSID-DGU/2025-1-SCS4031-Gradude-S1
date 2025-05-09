import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import OXButton from './OXButton';
import {colors} from '@/constants';
import CustomButton from '../commons/CustomButton';

interface QuizOXProps {
  step: number;
  totalSteps: number;
  question: string;
  selectedAnswer: 'O' | 'X' | null;
  onSelect: (value: 'O' | 'X') => void;
  onNext: () => void;
}

function SelfDgsQuiz({
  step,
  totalSteps,
  question,
  selectedAnswer,
  onSelect,
  onNext,
}: QuizOXProps) {
  return (
    <View style={styles.container}>
      <View style={styles.QuestionWrapper}>
        <View style={styles.progressWrapper}>
          <Text style={styles.progressRatio}>
            {step}/{totalSteps}
          </Text>
          <AnimatedCircularProgress
            size={80}
            width={8}
            fill={(step / totalSteps) * 100}
            tintColor={colors.MAINBLUE}
            rotation={0}
            backgroundColor={colors.OBTN}>
            {() => <Text style={styles.progressText}>{step}</Text>}
          </AnimatedCircularProgress>
        </View>
        <View style={styles.card}>
          <Text style={styles.questionText}>{question}</Text>
        </View>
      </View>

      <View style={styles.choices}>
        <OXButton
          value="O"
          selected={selectedAnswer === 'O'}
          onPress={() => onSelect('O')}
        />
        <OXButton
          value="X"
          selected={selectedAnswer === 'X'}
          onPress={() => onSelect('X')}
        />
      </View>

      <CustomButton
        label="다음"
        size="large"
        variant="filled"
        style={[
          styles.nextButton,
          !selectedAnswer && styles.nextButtonDisabled,
        ]}
        textStyle={styles.nextButtonText}
        disabled={!selectedAnswer}
        onPress={onNext}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  QuestionWrapper: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressRatio: {fontSize: 16, fontWeight: 'bold', marginBottom: 4},
  progressWrapper: {
    alignItems: 'center',
    paddingBottom: 12,
    zIndex: 2,
  },
  progressText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  card: {
    backgroundColor: colors.WHITE,
    borderRadius: 12,
    padding: 8,
    marginTop: -40,
    justifyContent: 'center',
    shadowColor: colors.GRAY,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 1,
    height: 230,
    width: '100%',
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.BLACK,
    textAlign: 'center',
  },
  choices: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nextButton: {
    alignItems: 'center',
    width: '100%',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 3},
    backgroundColor: colors.MAINBLUE,
  },
  nextButtonDisabled: {
    backgroundColor: '#A0C4FF',
  },
  nextButtonText: {
    color: colors.WHITE,
    fontSize: 20,
  },
});
export default SelfDgsQuiz;

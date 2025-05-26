import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import CustomButton from '@/components/commons/CustomButton';
import {colors, healthNavigations} from '@/constants';
import type {Option, Question} from '@/data/healthDiaryQuestions';
import {HEALTHDAIRYQUESTIONS as questions} from '@/data/healthDiaryQuestions';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

type AnswerMap = Record<string, number>;

export default function HealthDairyScreen() {
  const navigation = useNavigation<any>();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});

  const current: Question = questions[index];
  const step = index + 1;
  const total = questions.length;

  const handleSelect = (val: number) => {
    setAnswers(prev => ({...prev, [current.key]: val}));
  };

  const handleNext = () => {
    if (answers[current.key] == null) return;
    if (index + 1 < total) {
      setIndex(index + 1);
    } else {
      navigation.navigate(healthNavigations.HEALTH_RESULT, {answers});
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
        <Text style={styles.questionText}>{current.text}</Text>
      </View>

      <View style={styles.answerContainer}>
        {current.options.map((opt: Option) => {
          const selected = answers[current.key] === opt.value;
          return (
            <TouchableOpacity
              key={opt.id}
              style={[styles.option, selected && styles.optionSelected]}
              onPress={() => handleSelect(opt.value)}>
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

      <View style={styles.nextWrapper}>
        <CustomButton
          label={step < total ? '다음' : '완료'}
          size="large"
          variant="filled"
          style={[
            styles.nextBtn,
            answers[current.key] == null && styles.nextBtnDisabled,
          ]}
          textStyle={styles.nextLabel}
          onPress={handleNext}
          disabled={answers[current.key] == null}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGRAY,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  progressContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: -30,
    zIndex: 2,
  },
  progressRatio: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: colors.BLACK,
  },
  progressText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  card: {
    width: SCREEN_WIDTH - 48,
    height: 200,
    backgroundColor: colors.WHITE,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 6,
    shadowColor: colors.GRAY,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 3},
    elevation: 4,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.BLACK,
    textAlign: 'center',
    marginBottom: 16,
  },
  answerContainer: {
    marginTop: 10,
    width: SCREEN_WIDTH - 48,
  },
  option: {
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 30,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: colors.GRAY,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 3},
    backgroundColor: colors.WHITE,
  },
  optionSelected: {
    backgroundColor: colors.MAINBLUE,
  },
  optionLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.BLACK,
  },
  optionLabelSelected: {
    color: colors.WHITE,
  },
  nextWrapper: {
    padding: 28,
  },
  nextBtn: {
    width: SCREEN_WIDTH - 48,
    paddingVertical: 4,
    backgroundColor: colors.MAINBLUE,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  nextBtnDisabled: {
    backgroundColor: colors.DISBLUE,
  },
  nextLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.WHITE,
  },
});

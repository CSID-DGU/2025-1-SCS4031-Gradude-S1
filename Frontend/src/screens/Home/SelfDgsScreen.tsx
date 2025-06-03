import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

import {colors, homeNavigations} from '@/constants';
import {HomeStackParamList} from '@/navigations/stack/HomeStackNavigator';
import SELFDGSQUESTIONS, {Question} from '@/data/selfDgsQuestion';
import QuestionCard from '@/components/home/QuestionCard';
import CustomButton from '@/components/commons/CustomButton';
import {postSurvey} from '@/api/diagnosis';

type Props = StackScreenProps<
  HomeStackParamList,
  typeof homeNavigations.SELF_DGS
>;

export default function SelfDgsScreen({navigation}: Props) {
  const [questions, setQuestions] = useState<Question[]>(
    SELFDGSQUESTIONS.map(q => ({...q, answer: undefined})),
  );
  const [step, setStep] = useState<number>(1);
  const total = questions.length;
  const current = questions[step - 1];

  const selectOption = (value: number | string) => {
    setQuestions(prev =>
      prev.map((q, i) => (i === step - 1 ? {...q, answer: value} : q)),
    );
  };

  const handleNext = async () => {
    if (current.answer === undefined || current.answer === '') {
      Alert.alert('알림', '답변을 입력하거나 선택해주세요.');
      return;
    }

    if (current.type === 'input') {
      const num = parseInt(String(current.answer), 10);
      if (isNaN(num) || num < 0) {
        Alert.alert('알림', '정확한 숫자를 입력해주세요.');
        return;
      }
    }

    if (step < total) {
      setStep(prev => prev + 1);
      return;
    }

    try {
      const orientationMonthAnswer = questions.find(
        q => q.id === 'orientationMonth',
      )!.answer;
      const orientationAgeAnswer = questions.find(
        q => q.id === 'orientationAge',
      )!.answer;
      const gazeAnswer = questions.find(q => q.id === 'gaze')!.answer;
      const armAnswer = questions.find(q => q.id === 'arm')!.answer;

      const orientationMonthNum = parseInt(String(orientationMonthAnswer), 10);
      const orientationAgeNum = parseInt(String(orientationAgeAnswer), 10);
      const gazeValue: 0 | 1 = gazeAnswer === 0 ? 1 : 0;
      const armValue: 0 | 1 = armAnswer === 0 ? 1 : 0;

      const payload = {
        orientationMonth: orientationMonthNum,
        orientationAge: orientationAgeNum,
        gaze: gazeValue,
        arm: armValue,
      };

      const surveyResponse = await postSurvey(payload);
      console.log('▶ SurveyResponse:', surveyResponse);

      navigation.replace(homeNavigations.FINAL_RESULT);
    } catch (err) {
      Alert.alert('설문 전송 실패', (err as Error).message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.progressContainer}>
          <AnimatedCircularProgress
            size={60}
            width={6}
            fill={(step / total) * 100}
            tintColor={colors.MAINBLUE}
            rotation={0}
            backgroundColor={colors.OBTN}>
            {() => (
              <Text style={styles.progressRatio}>{`${step}/${total}`}</Text>
            )}
          </AnimatedCircularProgress>
        </View>

        <View style={styles.cardWrapper}>
          <QuestionCard
            question={current}
            onSelect={value => selectOption(value)}
            step={step}
            total={total}
          />
        </View>

        <View style={styles.nextWrapper}>
          <CustomButton
            label={step < total ? '다음' : '완료'}
            size="large"
            variant="filled"
            onPress={handleNext}
            disabled={current.answer === undefined || current.answer === ''}
            style={[
              styles.nextBtn,
              (current.answer === undefined || current.answer === '') &&
                styles.nextBtnDisabled,
            ]}
            textStyle={styles.nextLabel}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  safeArea: {
    flex: 1,
    backgroundColor: colors.BACKGRAY,
  },
  progressContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  progressRatio: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.BLACK,
  },
  cardWrapper: {
    flex: 1,
    marginHorizontal: 24,
    marginTop: 12,
  },
  nextWrapper: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: colors.BACKGRAY,
  },
  nextBtn: {
    backgroundColor: colors.MAINBLUE,
    alignItems: 'center',
  },
  nextBtnDisabled: {
    backgroundColor: colors.DISBLUE,
  },
  nextLabel: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '600',
  },
});

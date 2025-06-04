// src/screens/home/SelfDgsScreen.tsx

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

    // ─── 모든 문항에 답변 완료 → 설문 페이로드 생성 ───
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
      // gaze, arm 은 0 또는 1 로 들어오는데, 서버 로직에 맞추려면
      // (예시에서는 반대로 변환하는 코드가 있었으므로 그대로 두겠습니다)
      const gazeValue: 0 | 1 = gazeAnswer === 0 ? 1 : 0;
      const armValue: 0 | 1 = armAnswer === 0 ? 1 : 0;

      const surveyPayload = {
        orientationMonth: orientationMonthNum,
        orientationAge: orientationAgeNum,
        gaze: gazeValue,
        arm: armValue,
      };

      // ─── 직접 postSurvey 호출 대신, LoadingScreen 으로 이동 ───
      navigation.replace(homeNavigations.LOADING, {surveyPayload});
    } catch (err: any) {
      Alert.alert('설문 전송 실패', err.message);
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

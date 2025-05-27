import React, {useState} from 'react';
import {Pressable, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {colors, homeNavigations} from '@/constants';
import {StackScreenProps} from '@react-navigation/stack';
import {HomeStackParamList} from '@/navigations/stack/HomeStackNavigator';
import QuestionCard from '@/components/home/QuestionCard';
import SELFDGSQUESTIONS, {Question} from '@/data/selfDgsQuestion';
import CustomButton from '@/components/commons/CustomButton';

type Props = StackScreenProps<
  HomeStackParamList,
  typeof homeNavigations.SELF_DGS
>;

export default function SelfDgsScreen({navigation}: Props) {
  const [questions, setQuestions] = useState<Question[]>(
    SELFDGSQUESTIONS.map(q => ({...q, answer: undefined})),
  );
  const [step, setStep] = useState(1);
  const total = questions.length;

  const current = questions[step - 1];
  //TODO: 선택된 질문을 request에 담아 서버로 전송
  const selectOption = (value: number) => {
    setQuestions(qs =>
      qs.map(q => (q.id === current.id ? {...q, answer: value} : q)),
    );
  };
  const handleNext = () => {
    if (current.answer === undefined) return;
    if (step < total) {
      setStep(s => s + 1);
    } else {
      navigation.navigate(homeNavigations.FINAL_RESULT);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <QuestionCard
        question={current}
        onSelect={selectOption}
        step={step}
        total={total}
      />
      <View style={styles.nextWrapper}>
        <CustomButton
          label={step < total ? '다음' : '완료'}
          size="large"
          variant="filled"
          style={[
            styles.nextBtn,
            current.answer === undefined && styles.nextBtnDisabled,
          ]}
          textStyle={styles.nextLabel}
          onPress={handleNext}
          disabled={current.answer === undefined}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.BACKGRAY,
  },
  nextWrapper: {
    padding: 28,
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
    fontSize: 20,
    fontWeight: '600',
  },
});

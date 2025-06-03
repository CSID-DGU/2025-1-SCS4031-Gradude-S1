import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import CustomButton from '@/components/commons/CustomButton';
import {colors, healthNavigations} from '@/constants';
import type {Option, Question} from '@/data/healthDiaryQuestions';
import {HEALTHDAIRYQUESTIONS as questions} from '@/data/healthDiaryQuestions';
import {useCreateHealthDiary} from '@/hooks/queries/useHealthDiary';
import type {HealthDiaryRequest} from '@/types/healthDiary';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
type AnswerMap = Record<string, number>;

export default function HealthDairyScreen() {
  const navigation = useNavigation<any>();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});

  // React Query mutation 훅
  const createDiary = useCreateHealthDiary();

  const current: Question = questions[index];
  const step = index + 1;
  const total = questions.length;

  const handleSelect = (val: number) => {
    setAnswers(prev => ({...prev, [current.key]: val}));
  };

  const handleNext = () => {
    // 1) 아직 응답이 없는 항목이면 아무 동작 안 함
    if (answers[current.key] == null) return;

    // 2) 다음 질문이 있으면 인덱스 증가
    if (index + 1 < total) {
      setIndex(index + 1);
      return;
    }

    // 3) 마지막 질문까지 답했으면, createHealthDiary API 호출
    //    answers 객체의 키들이 백엔드가 기대하는 필드명(drinking, smoking, exercise, diet, sleep)이라고 가정
    const payload: HealthDiaryRequest = {
      drinking: answers.drinking ?? 0,
      smoking: answers.smoking ?? 0,
      exercise: answers.exercise ?? 0,
      diet: answers.diet ?? 0,
      sleep: answers.sleep ?? 0,
    };

    createDiary.mutate(payload, {
      onSuccess: createdResult => {
        // 생성 성공: 생성된 diaryId 등은 createdResult에 담겨 있다
        navigation.navigate(healthNavigations.HEALTH_RESULT, {
          diaryId: createdResult.diaryId,
          healthScore: createdResult.healthScore,
        });
      },
      onError: err => {
        Alert.alert('오류', '하루 기록 생성 중 문제가 발생했습니다.');
        console.error(err);
      },
    });
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
          label={
            step < total ? '다음' : createDiary.isPending ? '생성 중…' : '완료'
          }
          size="large"
          variant="filled"
          style={[
            styles.nextBtn,
            answers[current.key] == null && styles.nextBtnDisabled,
          ]}
          textStyle={styles.nextLabel}
          onPress={handleNext}
          disabled={answers[current.key] == null || createDiary.isPending}
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
    paddingVertical: 16,
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
    height: 130,
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

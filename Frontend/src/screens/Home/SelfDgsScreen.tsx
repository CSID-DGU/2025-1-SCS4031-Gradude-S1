import React, {useState} from 'react';
import {SafeAreaView} from 'react-native';
import SelfDgsQuiz from '@/components/home/SelfDgsQuiz';
import {colors, homeNavigations} from '@/constants';
import {StackScreenProps} from '@react-navigation/stack';
import {HomeStackParamList} from '@/navigations/stack/HomeStackNavigator';

type SelfDgsScreenProps = StackScreenProps<
  HomeStackParamList,
  typeof homeNavigations.SELF_DGS
>;

function SelfDgsScreen({navigation}: SelfDgsScreenProps) {
  // dummy
  const questions = [
    '시야가 흐려지거나\n물체가 두 개로 보인 적이 있나요?',
    '어지럼증이\n있었나요?',
    '발음이 부정확하게\n들린 적이 있나요?',
    '얼굴에 힘이 빠지거나\n마비된 느낌이 있나요?',
    '갑자기 한쪽 팔다리에\n힘이 약해진 적이 있나요?',
    '언어가 어눌하거나\n이해하기 어려웠던 적이 있나요?',
    '걸을 때 균형을 잃거나\n현저히 흔들린 적이 있나요?',
  ];

  const [step, setStep] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<'O' | 'X' | null>(null);
  const handleSelect = (value: 'O' | 'X') => {
    setSelectedAnswer(prev => (prev === value ? null : value));
  };
  const handleNext = () => {
    if (!selectedAnswer) return;
    // TODO: 답안 저장 로직
    if (step < questions.length) {
      setSelectedAnswer(null);
      setStep(s => s + 1);
    } else {
      navigation.navigate(homeNavigations.FINAL_RESULT);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.BACKGRAY}}>
      <SelfDgsQuiz
        step={step}
        totalSteps={questions.length}
        question={questions[step - 1]}
        selectedAnswer={selectedAnswer}
        onSelect={handleSelect}
        onNext={handleNext}
      />
    </SafeAreaView>
  );
}

export default SelfDgsScreen;

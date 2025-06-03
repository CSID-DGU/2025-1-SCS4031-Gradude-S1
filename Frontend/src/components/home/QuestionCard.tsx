import React from 'react';
import {View, Text, StyleSheet, Dimensions, TextInput} from 'react-native';
import {colors} from '@/constants';
import type {Question} from '@/data/selfDgsQuestion';
import OXButton from './OXButton';

const {width} = Dimensions.get('window');

type Props = {
  question: Question & {answer?: number | string};
  onSelect: (value: number | string) => void;
  step: number;
  total: number;
};

export default function QuestionCard({question, onSelect}: Props) {
  // 숫자만 허용하는 필터 함수
  const handleNumericInput = (text: string) => {
    const filtered = text.replace(/[^0-9]/g, '');
    onSelect(filtered);
  };

  return (
    <View style={styles.container}>
      {/* ─── 카드: 오직 질문 텍스트만 ─── */}
      <View style={styles.card}>
        <Text style={styles.questionText}>{question.text}</Text>
      </View>

      {/* ─── 카드 바로 아래: 답변 입력/선택 영역 ─── */}
      <View style={styles.answerContainer}>
        {question.type === 'input' && (
          <TextInput
            style={styles.textInput}
            placeholder="숫자만 입력하세요"
            keyboardType="number-pad"
            value={String(question.answer ?? '')}
            onChangeText={handleNumericInput}
          />
        )}

        {question.type === 'ox' && (
          <View style={styles.oxContainer}>
            <OXButton
              value="O"
              selected={question.answer === 0}
              onPress={() => onSelect(0)}
            />
            <OXButton
              value="X"
              selected={question.answer === 1}
              onPress={() => onSelect(1)}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA', // 전체 배경을 연한 회색으로
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  card: {
    backgroundColor: colors.WHITE,
    borderRadius: 16,
    minHeight: 120,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 32,
    shadowColor: colors.GRAY,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.BLACK,
    textAlign: 'center',
    lineHeight: 32,
  },
  answerContainer: {
    alignItems: 'center',
  },
  textInput: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: colors.LIGHTGRAY,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: colors.WHITE,
    shadowColor: colors.GRAY,
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 3},
    elevation: 2,
  },
  oxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width - 80, // 좌우 여유를 주고
    marginTop: 20,
  },
});

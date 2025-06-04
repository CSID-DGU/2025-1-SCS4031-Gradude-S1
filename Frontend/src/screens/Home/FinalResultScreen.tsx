import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {colors, homeNavigations} from '@/constants';
import type {HospitalDetailDto} from '@/types/hospital';
import type {SurveyResultDto} from '@/types/diagnosis';
import {StackScreenProps} from '@react-navigation/stack';
import {HomeStackParamList} from '@/navigations/stack/HomeStackNavigator';
import HospitalCard from '@/components/hospital/HospitalCard';

type Props = StackScreenProps<
  HomeStackParamList,
  typeof homeNavigations.FINAL_RESULT
>;

export default function FinalResultScreen({route}: Props) {
  const {surveyResult} = route.params;
  const {
    face,
    speech,
    totalScore,
    totalScorePercentage,
    llmResult,
    hospitalList,
  } = surveyResult;

  // ── face / speech 조합에 따른 메시지 결정 ──
  let rawMessage = '';
  if (face && speech) {
    rawMessage =
      '발화와 얼굴 표정 모두에서 어색함이 느껴집니다.\n경각심을 갖고 주변 병원을 내원하는 것을 추천합니다.';
  } else if (face && !speech) {
    rawMessage =
      '얼굴 표정에서 어색함이 느껴집니다.\n경각심을 갖고 주변 병원을 내원하는 것을 추천합니다.';
  } else if (!face && speech) {
    rawMessage =
      '발화에서 어색함이 느껴집니다.\n경각심을 갖고 주변 병원을 내원하는 것을 추천합니다.';
  } else {
    rawMessage =
      '얼굴 표정과 발화가 모두 정상입니다.\n계속 건강을 관리해주세요.';
  }

  // '\n'로 두 줄을 분리
  const [firstLine, secondLine] = rawMessage.split('\n');

  // 화면 너비 기준으로 원형 프로그래스 크기 계산
  const screenWidth = Dimensions.get('window').width;
  const circleSize = screenWidth * 0.6; // 화면 너비의 60%

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        {/* ───── 1. 소제목: AI 진단 결과 ───── */}

        {/* ───── 3. “최종 뇌졸중 위험도” 헤더 & 원형 프로그래스 ───── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>최종 뇌졸중 위험도</Text>
          <View style={styles.progressWrapper}>
            <AnimatedCircularProgress
              size={circleSize}
              width={10}
              fill={totalScorePercentage} // 0~100
              tintColor={colors.MAINBLUE}
              backgroundColor={colors.LIGHTGRAY}
              rotation={0}
              lineCap="round">
              {() => (
                <View style={styles.innerCircle}>
                  <Text style={styles.scoreText}>{totalScore}</Text>
                  <Text style={styles.scoreLabel}>점</Text>
                </View>
              )}
            </AnimatedCircularProgress>
            <Text style={styles.percentageText}>
              {`${totalScorePercentage.toFixed(0)}%`}
            </Text>
          </View>
        </View>

        {/* ───── 4. 소제목: 최종 진단 결과 & LLM 텍스트 ───── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>최종 진단 결과</Text>
          <View style={styles.llmContainer}>
            <Text style={styles.llmText}>{llmResult}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>AI 진단 결과</Text>
        {/* ───── 2. AI 예측 메시지 (첫 줄: 붉은색, 둘째 줄: 검은색) ───── */}
        <View style={styles.topMessageContainer}>
          <Text style={styles.topMessageFirst}>{firstLine}</Text>
          <Text style={styles.topMessageSecond}>{secondLine}</Text>
        </View>
        {/* ───── 5. 소제목: 추천 병원 & 병원 카드 목록 ───── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>추천 병원</Text>
          {hospitalList.length === 0 ? (
            <Text style={styles.noHospitalText}>
              주변에 추천 병원이 없습니다.
            </Text>
          ) : (
            hospitalList.map((hospital: HospitalDetailDto) => (
              <HospitalCard key={hospital.hospitalId} data={hospital} />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const {width: SCREEN_W} = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.SEMIWHITE,
  },
  section: {
    width: SCREEN_W - 40,
    marginBottom: 32,
    alignItems: 'center', // 내부 아이템 정중앙 배치
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },

  // ─────────────── 소제목 ───────────────
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.BLACK,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },

  // ─────────────── 1. AI 예측 메시지 ───────────────
  topMessageContainer: {
    width: SCREEN_W - 40,
    backgroundColor: colors.WHITE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    // iOS 그림자
    shadowColor: colors.BLACK,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android
    elevation: 3,
  },
  topMessageFirst: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.RED, // 첫 번째 줄은 빨간색
    textAlign: 'center',
    fontWeight: '600',
  },
  topMessageSecond: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.BLACK, // 두 번째 줄은 검은색
    textAlign: 'center',
    marginTop: 4,
  },

  // ─────────────── 2. 원형 프로그래스 ───────────────
  progressWrapper: {
    alignItems: 'center',
    marginBottom: 32,
  },
  innerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.MAINBLUE,
  },
  scoreLabel: {
    fontSize: 18,
    color: colors.GRAY,
    marginTop: 4,
  },
  percentageText: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '600',
    color: colors.BLACK,
  },

  // ─────────────── 3. LLM 결과 ───────────────
  llmContainer: {
    width: '100%',
    backgroundColor: colors.WHITE,
    borderRadius: 12,
    padding: 16,
    // iOS 그림자
    shadowColor: colors.BLACK,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android
    elevation: 3,
  },
  llmText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.BLACK,
  },

  // ─────────────── 4. 추천 병원 ───────────────
  noHospitalText: {
    fontSize: 16,
    color: colors.GRAY,
    textAlign: 'center',
    paddingVertical: 20,
  },
});

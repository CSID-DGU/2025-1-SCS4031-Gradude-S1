// src/screens/Diagnosis/FinalResultScreen.tsx

import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import {useDiagnosisById} from '@/hooks/queries/useDiagnosis';
import {colors} from '@/constants';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import HospitalCard from '@/components/hospital/HospitalCard';
import type {HospitalDetailDto} from '@/types/hospital';
import type {SurveyResultDto} from '@/types/diagnosis';

/**
 * 두 가지 파라미터 타입 허용:
 * 1) { surveyResult: SurveyResultDto }
 * 2) { diagnosisId: number }
 */
type FinalResultRouteProp = RouteProp<
  {
    FINAL_RESULT: {surveyResult: SurveyResultDto} | {diagnosisId: number};
  },
  'FINAL_RESULT'
>;

export default function FinalResultScreen() {
  const route = useRoute<FinalResultRouteProp>();
  const params = route.params;

  // 1) 만약 surveyResult가 넘어왔다면 바로 사용하고,
  // 2) 아니라면 diagnosisId로 fetch를 수행
  const isDirectResult = 'surveyResult' in params;

  let surveyResult: SurveyResultDto | undefined;
  let isLoading = false;
  let isError = false;

  if (isDirectResult) {
    // LoadingScreen에서 넘긴 surveyResult 사용
    surveyResult = params.surveyResult;
  } else {
    // 달력에서 넘어온 diagnosisId로 서버 조회
    const {diagnosisId} = params as {diagnosisId: number};
    const {
      data,
      isLoading: loadingFromServer,
      isError: errorFromServer,
    } = useDiagnosisById(diagnosisId);

    surveyResult = data ?? undefined;
    isLoading = loadingFromServer;
    isError = errorFromServer;
  }

  // 로딩/에러 처리 (fetch 경로일 때만 적용)
  if (!isDirectResult && isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.MAINBLUE} />
      </SafeAreaView>
    );
  }
  if (!isDirectResult && (isError || !surveyResult)) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text>결과를 불러오는 중 오류가 발생했습니다.</Text>
      </SafeAreaView>
    );
  }

  // 이제 surveyResult 값이 항상 정의되어 있음
  const {
    face,
    speech,
    totalScore,
    totalScorePercentage,
    llmResult,
    hospitalList,
  } = surveyResult!;

  // AI 예측 메시지 분기
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
  const [firstLine, secondLine] = rawMessage.split('\n');

  const screenWidth = Dimensions.get('window').width;
  const circleSize = screenWidth * 0.5;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        {/* 1. 최종 뇌졸중 위험도 카드 + 원형 프로그래스 */}
        <View style={styles.cardContainer}>
          <Text style={styles.sectionTitle}>💡 최종 뇌졸중 위험도</Text>
          <View style={styles.progressWrapper}>
            <AnimatedCircularProgress
              size={circleSize}
              width={10}
              fill={totalScorePercentage}
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

        {/* 2. 최종 진단 결과 LLM 텍스트 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔎 최종 진단 결과</Text>
          <View style={styles.llmContainer}>
            <Text style={styles.llmText}>{llmResult}</Text>
          </View>
        </View>

        {/* 3. AI 분석 결과 메시지 */}
        <View style={styles.topMessageContainer}>
          <Text style={styles.sectionTitle}>📍 AI 분석 결과</Text>
          <Text style={styles.topMessageFirst}>{firstLine}</Text>
          <Text style={styles.topMessageSecond}>{secondLine}</Text>
        </View>

        {/* 4. 추천 병원 리스트 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏥 가장 가까운 병원</Text>
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
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  section: {
    width: SCREEN_W - 40,
    marginBottom: 32,
    alignItems: 'center',
  },
  cardContainer: {
    width: SCREEN_W - 40,
    backgroundColor: colors.WHITE,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 32,
    // iOS 그림자
    shadowColor: colors.BLACK,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android 그림자
    elevation: 3,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.BLACK,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  progressWrapper: {
    alignItems: 'center',
    marginTop: 8,
  },
  innerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.MAINBLUE,
  },
  scoreLabel: {
    fontSize: 16,
    color: colors.GRAY,
    marginTop: 4,
  },
  percentageText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: colors.BLACK,
  },
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
    // Android 그림자
    elevation: 3,
  },
  llmText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.BLACK,
  },
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
    // Android 그림자
    elevation: 3,
  },
  topMessageFirst: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.MAINBLUE,
    textAlign: 'center',
    fontWeight: '600',
  },
  topMessageSecond: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.BLACK,
    textAlign: 'center',
    marginTop: 4,
  },
  noHospitalText: {
    fontSize: 16,
    color: colors.GRAY,
    textAlign: 'center',
    paddingVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

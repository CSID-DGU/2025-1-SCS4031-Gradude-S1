import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {colors, healthNavigations} from '@/constants';
import type {HealthStackParamList} from '@/navigations/stack/HealthStackNavigator';
import {useGetHealthDiary} from '@/hooks/queries/useHealthDiary';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

type Route = RouteProp<
  HealthStackParamList,
  typeof healthNavigations.HEALTH_RESULT
>;

function mapStatus(score: number) {
  switch (score) {
    case 1:
    case 2:
      return {text: '정상', color: '#4CAF50'};
    case 3:
      return {text: '주의', color: '#FFEB3B'};
    case 4:
      return {text: '경고', color: '#FF9800'};
    case 5:
      return {text: '위험', color: '#F44336'};
    default:
      return {text: '-', color: '#CCC'};
  }
}

export default function HealthResultScreen() {
  const {
    params: {diaryId},
  } = useRoute<Route>();

  // ① useGetHealthDiary(diaryId) 로 실제 데이터를 가져온다
  const {data, isLoading, isError} = useGetHealthDiary(diaryId);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={colors.MAINBLUE} />
      </SafeAreaView>
    );
  }
  if (isError || !data) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>❗️ 데이터를 불러오는 중 오류가 발생했습니다.</Text>
      </SafeAreaView>
    );
  }

  // data: HealthDiaryResult 타입
  // { diaryId, date, healthScore, drinking, smoking, exercise, diet, sleep }
  const totalScore = data.healthScore; // 예: 70
  const CIRCLE_SIZE = SCREEN_WIDTH * 0.45;

  // 상단 요약: 카테고리별 점수 + 상태 매핑
  const CATEGORY_CONFIG = [
    {key: 'drinking', label: '음주'},
    {key: 'exercise', label: '운동'},
    {key: 'smoking', label: '흡연'},
    {key: 'diet', label: '식단'},
    {key: 'sleep', label: '숙면'},
  ] as const;

  const summaryData = CATEGORY_CONFIG.map(cat => {
    // @ts-ignore: data[cat.key] 타입이 number 으로 들어온다고 가정
    const score = data[cat.key] as number;
    const {text, color} = mapStatus(score);
    return {...cat, score, status: text, color};
  });

  // 하단 리스트
  const BOTTOM_CONFIG = [
    {key: 'drinking', label: '음주', icon: 'wine-outline'},
    {key: 'exercise', label: '운동', icon: 'walk-outline'},
    {key: 'smoking', label: '흡연', icon: 'logo-no-smoking'},
    {key: 'diet', label: '간식', icon: 'fast-food-outline'},
    {key: 'sleep', label: '숙면', icon: 'leaf-outline'}, //TODO 아이콘 바꾸기
  ] as const;

  return (
    <SafeAreaView style={styles.container}>
      {/* ─── 상단 요약 스크롤 ─── */}
      <View style={styles.summarySection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.summaryList}>
          {summaryData.map(item => (
            <View key={item.key} style={styles.summaryItem}>
              <Ionicons
                name="notifications-circle-outline"
                size={40}
                color={item.color}
              />
              <Text style={styles.summaryLabel}>{item.label}</Text>
              <Text style={[styles.summaryStatus, {color: item.color}]}>
                {item.status}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* ─── 원형 진행 바 (전체 건강 점수) ─── */}
      <View style={styles.circleSection}>
        <AnimatedCircularProgress
          size={CIRCLE_SIZE}
          width={12}
          fill={totalScore}
          tintColor={colors.MAINBLUE}
          backgroundColor={colors.OBTN}
          rotation={0}>
          {() => (
            <View style={styles.totalInner}>
              <Text style={styles.totalScoreText}>{totalScore}</Text>
              <Text style={styles.totalScoreLabel}>건강 점수</Text>
            </View>
          )}
        </AnimatedCircularProgress>
      </View>

      {/* ─── 하단 세부 리스트 ─── */}
      <View style={styles.lowerList}>
        {BOTTOM_CONFIG.map(item => {
          // @ts-ignore
          const score = data[item.key] as number;
          const isFull = score === 5;
          return (
            <View key={item.key} style={styles.row}>
              <Ionicons
                name={item.icon}
                size={24}
                color={colors.BLACK}
                style={styles.rowIcon}
              />
              <Text style={styles.rowLabel}>{item.label}</Text>
              <Text style={styles.rowCount}>{score} / 5</Text>
              <View
                style={[
                  styles.badge,
                  isFull ? styles.badgeGood : styles.badgeBad,
                ]}>
                <Text
                  style={[
                    styles.badgeText,
                    isFull ? styles.badgeTextGood : styles.badgeTextBad,
                  ]}>
                  {isFull ? '건강' : '노력!'}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: colors.BACKGRAY,
  },
  summarySection: {
    marginTop: 16,
    backgroundColor: colors.WHITE,
    marginHorizontal: 24,
    borderRadius: 12,
    paddingVertical: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryList: {
    paddingHorizontal: 8,
  },
  summaryItem: {
    width: 70,
    alignItems: 'center',
    marginRight: 12,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.BLACK,
    marginTop: 4,
  },
  summaryStatus: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },

  circleSection: {
    backgroundColor: colors.WHITE,
    marginTop: 16,
    marginBottom: 24,
    marginHorizontal: 24,
    borderRadius: 12,
    paddingVertical: 24,
    elevation: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  totalInner: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  totalScoreText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  totalScoreLabel: {
    fontSize: 14,
    color: colors.BLACK,
    marginTop: 4,
  },

  lowerList: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  rowIcon: {
    width: 32,
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.BLACK,
  },
  rowCount: {
    width: 60,
    textAlign: 'center',
    fontSize: 16,
    color: colors.BLACK,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeGood: {
    backgroundColor: '#E0F7FA',
  },
  badgeBad: {
    backgroundColor: '#FFEBEE',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeTextGood: {
    color: '#00796B',
  },
  badgeTextBad: {
    color: '#C62828',
  },
});

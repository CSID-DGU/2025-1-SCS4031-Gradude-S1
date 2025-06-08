// src/screens/Health/HealthResultScreen.tsx

import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

import {colors, healthNavigations} from '@/constants';
import type {HealthStackParamList} from '@/navigations/stack/HealthStackNavigator';
import {useGetHealthDiary} from '@/hooks/queries/useHealthDiary';
import {HEALTHDAIRYQUESTIONS, Question} from '@/data/healthDiaryQuestions';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

type Route = RouteProp<
  HealthStackParamList,
  typeof healthNavigations.HEALTH_RESULT
>;

// 점수와 옵션 개수에 따라 상태 텍스트와 색상 반환
function getCategoryStatus(score: number, max: number) {
  if (max >= 4) {
    if (score === 1) return {text: '정상', color: '#4CAF50'};
    if (score === 2) return {text: '주의', color: '#FFEB3B'};
    return {text: '경고', color: '#FF9800'};
  }
  if (max === 3) {
    if (score === 1) return {text: '정상', color: '#4CAF50'};
    if (score === 2) return {text: '주의', color: '#FFEB3B'};
    return {text: '경고', color: '#FF9800'};
  }
  if (max === 2) {
    if (score === 1) return {text: '정상', color: '#4CAF50'};
    return {text: '경고', color: '#FF9800'};
  }
  if (score <= max / 2) return {text: '정상', color: '#4CAF50'};
  return {text: '경고', color: '#FF9800'};
}

export default function HealthResultScreen() {
  const {
    params: {diaryId},
  } = useRoute<Route>();
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

  const totalScore = data.healthScore; // 0~100
  const CIRCLE_SIZE = SCREEN_WIDTH * 0.45;
  const CATEGORY_CONFIG = [
    {key: 'drinking', label: '음주'},
    {key: 'exercise', label: '운동'},
    {key: 'smoking', label: '흡연'},
    {key: 'diet', label: '식단'},
    {key: 'sleep', label: '숙면'},
  ] as const;

  const summaryData = CATEGORY_CONFIG.map(cat => {
    const score = data[cat.key] as number;
    const question = HEALTHDAIRYQUESTIONS.find(q => q.key === cat.key);
    const max = question?.options.length ?? 5;
    const {text, color} = getCategoryStatus(score, max);
    return {...cat, score, status: text, color};
  });

  const lowerConfig = summaryData.map(item => {
    const question = HEALTHDAIRYQUESTIONS.find(q => q.key === item.key)!;
    const max = question.options.length;
    // 정상인지 아닌지 기준: 상태(item.status)까지 "정상"인 경우만 정상, 나머지는 노력
    const isNormal = item.status === '정상';
    return {
      ...item,
      max,
      icon: {
        drinking: 'wine-outline',
        exercise: 'walk-outline',
        smoking: 'logo-no-smoking',
        diet: 'restaurant-outline',
        sleep: 'bed-outline',
      }[item.key],
      badgeText: isNormal ? '정상' : '노력',
      badgeStyle: isNormal ? styles.badgeGood : styles.badgeBad,
      badgeTextStyle: isNormal ? styles.badgeTextGood : styles.badgeTextBad,
    };
  });

  return (
    <SafeAreaView style={styles.container}>
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

      <View style={styles.circleSection}>
        <AnimatedCircularProgress
          size={CIRCLE_SIZE}
          width={12}
          fill={totalScore}
          tintColor={colors.MAINBLUE}
          backgroundColor={colors.OBTN}
          rotation={0}
          lineCap="round">
          {() => (
            <View style={styles.totalInner}>
              <Text style={styles.totalScoreText}>{totalScore}</Text>
              <Text style={styles.totalScoreLabel}>건강 점수</Text>
            </View>
          )}
        </AnimatedCircularProgress>
      </View>

      <View style={styles.lowerList}>
        {lowerConfig.map(item => (
          <View key={item.key} style={styles.row}>
            <Ionicons
              name={item.icon}
              size={24}
              color={colors.BLACK}
              style={styles.rowIcon}
            />
            <Text style={styles.rowLabel}>{item.label}</Text>
            <Text style={styles.rowCount}>
              {item.score} / {item.max}
            </Text>
            <View style={[styles.badge, item.badgeStyle]}>
              <Text style={[styles.badgeText, item.badgeTextStyle]}>
                {item.badgeText}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  container: {flex: 1, backgroundColor: colors.BACKGRAY},
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
  summaryList: {paddingHorizontal: 8},
  summaryItem: {width: 70, alignItems: 'center', marginRight: 12},
  summaryLabel: {fontSize: 12, color: colors.BLACK, marginTop: 4},
  summaryStatus: {fontSize: 10, fontWeight: 'bold', marginTop: 2},
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
  totalScoreText: {fontSize: 36, fontWeight: 'bold', color: colors.BLACK},
  totalScoreLabel: {fontSize: 14, color: colors.BLACK, marginTop: 4},
  lowerList: {flex: 1, paddingHorizontal: 24, paddingTop: 8},
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
  rowIcon: {width: 32},
  rowLabel: {flex: 1, fontSize: 16, fontWeight: '500', color: colors.BLACK},
  rowCount: {width: 60, textAlign: 'center', fontSize: 16, color: colors.BLACK},
  badge: {paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4},
  badgeGood: {backgroundColor: '#E0F7FA'},
  badgeBad: {backgroundColor: '#FFEBEE'},
  badgeText: {fontSize: 12, fontWeight: '600'},
  badgeTextGood: {color: '#00796B'},
  badgeTextBad: {color: '#C62828'},
});

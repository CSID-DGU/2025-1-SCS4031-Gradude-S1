// ResultScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {colors, healthNavigations} from '@/constants';
import type {HealthStackParamList} from '@/navigations/stack/HealthStackNavigator';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
type Route = RouteProp<
  HealthStackParamList,
  typeof healthNavigations.HEALTH_RESULT
>;

const CATEGORY_CONFIG = [
  {key: 'drinking', label: '음주'},
  {key: 'exercise', label: '운동'},
  {key: 'smoking', label: '흡연'},
  {key: 'snack', label: '간식'},
  {key: 'vegetable', label: '야채'},
];

const BOTTOM_CONFIG = [
  {key: 'drinking', label: '음주', icon: 'wine-outline'},
  {key: 'exercise', label: '운동', icon: 'walk-outline'},
  {key: 'smoking', label: '흡연', icon: 'logo-no-smoking'},
  {key: 'snack', label: '간식', icon: 'fast-food-outline'},
  {key: 'vegetable', label: '야채', icon: 'leaf-outline'},
];

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
  const {answers} = useRoute<Route>().params;

  // TODO: 실제 건강 점수로 교체해야 함
  // 건강 점수 (0~100)
  const totalScore = 70;
  const CIRCLE_SIZE = SCREEN_WIDTH * 0.45;

  // 상단 요약 데이터
  const summaryData = CATEGORY_CONFIG.map(cat => {
    const score = answers[cat.key] ?? 0;
    const {text, color} = mapStatus(score);
    return {...cat, score, status: text, color};
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* 스크롤 */}
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

      {/* 원형  */}
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

      {/* 하단 리스트 */}
      <View style={styles.lowerList}>
        {BOTTOM_CONFIG.map(item => {
          const score = answers[item.key] ?? 0;
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
  container: {
    flex: 1,
    backgroundColor: colors.BACKGRAY,
  },

  //요약 스크롤
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

  // 원형
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

  // 하단
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

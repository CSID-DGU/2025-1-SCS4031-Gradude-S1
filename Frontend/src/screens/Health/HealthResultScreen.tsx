import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors, healthNavigations} from '@/constants';
import type {RouteProp} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';
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

export default function ResultScreen() {
  const {answers} = useRoute<Route>().params;
  const summaryData = CATEGORY_CONFIG.map(cat => {
    const score = answers[cat.key] ?? 0;
    const {text, color} = mapStatus(score);
    return {...cat, score, status: text, color};
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.summaryList}>
        {summaryData.map(item => (
          <View key={item.key} style={styles.summaryItem}>
            <Ionicons
              name="notifications-circle-outline"
              size={48}
              color={item.color}
            />
            <Text style={styles.summaryLabel}>{item.label}</Text>
            <Text style={[styles.summaryStatus, {color: item.color}]}>
              {item.status}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.lowerList}>
        {BOTTOM_CONFIG.map(item => {
          const score = answers[item.key] ?? 0; // 1~5
          const isFull = score === 5;
          return (
            <View key={item.key} style={styles.row}>
              <Ionicons
                name={item.icon}
                size={24}
                color={colors.BLACK}
                style={{width: 32}}
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
    paddingTop: 16,
  },
  summaryList: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  summaryItem: {
    width: 80,
    alignItems: 'center',
    marginRight: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.BLACK,
    marginTop: 4,
  },
  summaryStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
  lowerList: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
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

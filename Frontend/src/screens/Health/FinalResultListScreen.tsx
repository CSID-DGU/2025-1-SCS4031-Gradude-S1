// src/screens/Health/FinalResultListScreen.tsx

import React, {useMemo, useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Calendar, DateData, LocaleConfig} from 'react-native-calendars';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';

import {colors, homeNavigations} from '@/constants';
import {mainTabNavigations} from '@/navigations/tab/TabNavigator';
import {useDiagnosisHistory} from '@/hooks/queries/useDiagnosis';

// 달력 한국어 설정 (생략 가능)
LocaleConfig.locales['kr'] = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
};
LocaleConfig.defaultLocale = 'kr';

export default function FinalResultListScreen() {
  const navigation = useNavigation<any>();

  // 1) 진단 기록 불러오기
  const {
    data: historyList = [],
    isLoading: loadingHistory,
    isError: historyError,
  } = useDiagnosisHistory();

  // 콘솔에서 historyList 전체 확인
  useEffect(() => {
    if (historyList.length > 0) {
      console.log('📋 historyList 상세:', JSON.stringify(historyList, null, 2));
    }
  }, [historyList]);

  // 2) markedDates 생성: CalendarScreen과 동일하게 처리
  const markedDates = useMemo(() => {
    const obj: Record<
      string,
      {
        marked: boolean;
        dotColor: string;
        selected?: boolean;
        selectedColor?: string;
      }
    > = {};
    historyList.forEach(item => {
      const dateOnly = item.date.includes('T')
        ? item.date.split('T')[0]
        : item.date;
      obj[dateOnly] = {marked: true, dotColor: colors.SKYBLUE};
    });
    return obj;
  }, [historyList]);

  // 3) 날짜 선택 핸들러: CalendarScreen과 동일하게 처리
  const onDayPress = (day: DateData) => {
    const {dateString} = day; // "YYYY-MM-DD"
    const found = historyList.find(item => {
      const dateOnly = item.date.includes('T')
        ? item.date.split('T')[0]
        : item.date;
      return dateOnly === dateString;
    });
    if (found) {
      navigation.navigate(mainTabNavigations.HOME, {
        screen: homeNavigations.FINAL_RESULT,
        params: {diagnosisId: found.diagnosisId},
      });
    } else {
      Alert.alert('안내', '해당 날짜에는 진단 기록이 없습니다.', [
        {text: '확인'},
      ]);
    }
  };

  // 4) 로딩/에러 처리
  if (loadingHistory) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.MAINBLUE} />
      </SafeAreaView>
    );
  }
  if (historyError) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text>진단 히스토리 불러오기에 실패했습니다.</Text>
      </SafeAreaView>
    );
  }

  // 5) 렌더링
  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>🧠 뇌졸중 자가진단 내역</Text>
      </View>

      {/* 달력 카드 */}
      <Animatable.View
        animation="fadeInUp"
        duration={600}
        useNativeDriver
        style={styles.calendarCard}>
        <Calendar
          monthFormat="yyyy년 M월"
          onDayPress={onDayPress}
          markingType="dot"
          markedDates={markedDates}
          theme={{
            backgroundColor: colors.WHITE,
            calendarBackground: colors.WHITE,
            textMonthFontSize: 18,
            textMonthFontWeight: 'bold',
            monthTextColor: colors.MAINBLUE,
            arrowColor: colors.MAINBLUE,
            textDayFontSize: 16,
            textDayFontWeight: '500',
            textDayHeaderFontSize: 14,
            textDayHeaderFontWeight: '500',
            textDisabledColor: colors.LIGHTGRAY,
            todayTextColor: colors.WHITE,
            todayBackgroundColor: colors.SKYBLUE,
            selectedDayBackgroundColor: colors.MAINBLUE,
            selectedDayTextColor: colors.WHITE,
          }}
          style={styles.calendar}
        />
      </Animatable.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.SEMIWHITE,
    paddingHorizontal: 24,
    paddingTop: 36,
  },
  header: {
    marginTop: 32,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  calendarCard: {
    backgroundColor: colors.WHITE,
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calendar: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

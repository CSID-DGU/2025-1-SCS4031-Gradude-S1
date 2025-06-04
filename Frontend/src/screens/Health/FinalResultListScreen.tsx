// src/screens/Diagnosis/FinalResultListScreen.tsx

import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Calendar, DateData, LocaleConfig} from 'react-native-calendars';
import {useNavigation} from '@react-navigation/native';

import {colors, homeNavigations} from '@/constants';
import {useDiagnosisHistory} from '@/hooks/queries/useDiagnosis';

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

  // useDiagnosisHistory 훅이 내부에서 자동으로 userId를 꺼내서 처리
  const {
    data: historyList = [],
    isLoading: loadingHistory,
    isError: historyError,
  } = useDiagnosisHistory({
    enabled: true, // 혹은 특별한 조건이 필요하면 설정
  });

  // ── B. 달력에 표시할 연·월 state
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  // ── D. historyList를 markedDates 형태로 가공
  const markedDates = useMemo(() => {
    const obj: Record<string, {marked: boolean; dotColor: string}> = {};
    historyList.forEach(item => {
      obj[item.date] = {
        marked: true,
        dotColor: colors.SKYBLUE,
      };
    });
    return obj;
  }, [historyList]);

  // ── E. 날짜 탭 핸들러
  const onDayPress = (day: DateData) => {
    const {dateString} = day; // "YYYY-MM-DD"
    const found = historyList.find(item => item.date === dateString);
    if (found) {
      navigation.navigate(homeNavigations.FINAL_RESULT, {
        diagnosisId: found.diagnosisId,
      });
    } else {
      Alert.alert('안내', '해당 날짜에는 진단 기록이 없습니다.', [
        {text: '확인'},
      ]);
    }
  };

  // ── F. 달·월 변경 시 state 업데이트 (필요 시 refetch 로직 추가)
  const onMonthChange = (date: {year: number; month: number}) => {
    setYear(date.year);
    setMonth(date.month);
    // TODO: 연·월을 서버에 전달해서 필터링된 history를 받고 싶으면 여기서 refetch 호출
    // 예: refetch({ year: date.year, month: date.month });
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>뇌졸중 자가진단 내역</Text>
      </View>

      <Calendar
        monthFormat={'yyyy년 M월'}
        onDayPress={onDayPress}
        onMonthChange={onMonthChange}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.SEMIWHITE,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  calendar: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

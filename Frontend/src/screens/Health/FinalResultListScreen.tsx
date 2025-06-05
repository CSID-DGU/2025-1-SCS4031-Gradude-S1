// src/screens/Health/FinalResultListScreen.tsx

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

  console.log('[DEBUG] raw historyList:', historyList);
  // 예: [{ date: '2025-06-05T00:00:00.000Z', diagnosisId: 14 }, ...]

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  // 2) markedDates를 “서버가 준 date에 하루를 더한 뒤 한국 시간 기준 YYYY-MM-DD”로 변환
  const markedDates = useMemo(() => {
    const obj: Record<string, {marked: boolean; dotColor: string}> = {};
    historyList.forEach(item => {
      const raw = item.date;
      let dt = new Date(raw);

      // **하루 보정**: 서버에서 내려준 날짜에 하루 더하기
      dt.setDate(dt.getDate() + 1);

      const y = dt.getFullYear();
      const m = dt.getMonth() + 1;
      const d = dt.getDate();

      // “YYYY-MM-DD” 형태로 포맷
      const dateKey = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(
        2,
        '0',
      )}`;
      obj[dateKey] = {
        marked: true,
        dotColor: colors.SKYBLUE,
      };
    });
    return obj;
  }, [historyList]);

  // 3) onDayPress에서 눌린 날짜(dateString)와 비교할 때도 “하루를 더한 날짜”로 검사
  const onDayPress = (day: DateData) => {
    const {dateString} = day; // ex) "2025-06-05"

    const found = historyList.find(item => {
      let dt = new Date(item.date);

      // **하루 보정**
      dt.setDate(dt.getDate() + 1);

      const y = dt.getFullYear();
      const m = dt.getMonth() + 1;
      const d = dt.getDate();
      const itemKey = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(
        2,
        '0',
      )}`;
      return itemKey === dateString;
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

  // 4) 월 변경 시 상태 업데이트 (필요 시 refetch 로직 추가)
  const onMonthChange = (date: {year: number; month: number}) => {
    setYear(date.year);
    setMonth(date.month);
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
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>🧠 뇌졸중 자가진단 내역</Text>
      </View>

      {/* 달력 카드를 Animatable.View로 감싸서 fadeInUp 애니메이션 적용 */}
      <Animatable.View
        animation="fadeInUp"
        duration={600}
        useNativeDriver
        style={styles.calendarCard}>
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
    // iOS 그림자
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android 그림자
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

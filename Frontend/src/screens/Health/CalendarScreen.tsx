// src/screens/Health/CalendarScreen.tsx

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
import {colors, healthNavigations} from '@/constants';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useGetHealthDiaryCalendar} from '@/hooks/queries/useHealthDiary';

// 1) 달력 한국어 설정 (생략 가능)
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

export default function CalendarScreen() {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();

  // 2) 오늘 날짜를 무조건 "YYYY-MM-DD" 형태로 고정
  const today = useMemo(() => {
    const d = new Date();
    const YYYY = d.getFullYear();
    const MM = (d.getMonth() + 1).toString().padStart(2, '0');
    const DD = d.getDate().toString().padStart(2, '0');
    return `${YYYY}-${MM}-${DD}`;
  }, []);

  // 현재 화면에 보여줄 연/월 상태 (초기값: 현재 날짜 기준)
  const now = new Date();
  const [year, setYear] = useState<number>(now.getFullYear());
  const [month, setMonth] = useState<number>(now.getMonth() + 1);

  // 3) 서버에 요청할 때 넘기는 query 파라미터가 (year, month)임을 확인
  //    → 훅 시그니처: useGetHealthDiaryCalendar(year: number, month: number)
  const {
    data: calendarList = [],
    isLoading: loadingCalendar,
    isError: calendarError,
    refetch: refetchCalendar,
  } = useGetHealthDiaryCalendar(year, month);

  // (디버깅용) 서버에서 내려오는 목록 찍어보기
  useEffect(() => {
    console.log(
      '📥 [Calendar] fetched calendarList:',
      year,
      month,
      calendarList,
    );
  }, [calendarList, year, month]);

  // 화면이 Focus될 때마다(탭 전환 등) 다시 불러오기
  useEffect(() => {
    if (isFocused) {
      refetchCalendar();
    }
  }, [isFocused, year, month]);

  // 4) markedDates 객체 만들기
  const markedDates = useMemo(() => {
    // 결과: { "2025-06-05": { marked: true, dotColor: SKYBLUE }, ... }
    const obj: Record<
      string,
      {
        marked: boolean;
        dotColor: string;
        selected?: boolean;
        selectedColor?: string;
      }
    > = {};

    calendarList.forEach(item => {
      // 서버에서 내려오는 item.date도 "YYYY-MM-DD" 형태이므로, 그대로 사용
      // (만약 ISO 문자열("2025-06-05T...")이 내려온다면 split('T')[0]으로 처리)
      const dateOnly = item.date.includes('T')
        ? item.date.split('T')[0]
        : item.date;

      obj[dateOnly] = {
        marked: true,
        dotColor: colors.SKYBLUE,
      };
    });

    // 오늘(today)은 항상 선택된(selected) 상태로 표시
    if (obj[today]) {
      obj[today].selected = true;
      obj[today].selectedColor = colors.SKYBLUE;
    } else {
      obj[today] = {
        marked: false,
        dotColor: colors.SKYBLUE,
        selected: true,
        selectedColor: colors.SKYBLUE,
      };
    }

    console.log('▶️ markedDates keys:', Object.keys(obj));
    return obj;
  }, [calendarList, today]);

  // 5) "날짜 터치" 처리
  const onDayPress = (day: DateData) => {
    console.log('▶️ onDayPress dateString:', day.dateString);

    // history와 동일한 방식으로 날짜 문자열끼리 똑같이 비교
    const found = calendarList.find(item => {
      const dateOnly = item.date.includes('T')
        ? item.date.split('T')[0]
        : item.date;
      console.log('  검사 중:', dateOnly, ' vs ', day.dateString);
      return dateOnly === day.dateString;
    });

    if (found) {
      // 5-1) 기록이 있는 과거 날짜를 누르면 결과 화면으로 이동
      console.log('✅ 기록 있음 → HEALTH_RESULT로 내비게이트:', found.diaryId);
      navigation.navigate(healthNavigations.HEALTH_RESULT, {
        diaryId: found.diaryId,
      });
      return;
    }

    if (day.dateString === today) {
      // 5-2) 오늘인데 기록이 없으면 새 기록 화면으로 이동
      console.log('✅ 오늘이므로 새 기록 화면(HEALTH_DAIRY)으로 이동');
      navigation.navigate(healthNavigations.HEALTH_DAIRY, {date: today});
      return;
    }

    // 5-3) 그 외 날짜 (기록도 없고, 오늘도 아님)
    Alert.alert('건강 수첩', '해당 날짜에는 기록이 없습니다.', [
      {text: '확인'},
    ]);
  };

  // 6) 달(month)이 바뀔 때
  const onMonthChange = (date: {year: number; month: number}) => {
    setYear(date.year);
    setMonth(date.month);
  };

  // 7) 로딩 / 에러 화면 처리
  if (loadingCalendar) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.MAINBLUE} />
      </SafeAreaView>
    );
  }
  if (calendarError) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text>건강 기록 불러오기에 실패했습니다.</Text>
      </SafeAreaView>
    );
  }

  // 8) 실제 렌더링
  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>건강 수첩</Text>
      </View>

      {/* 설명 영역 */}
      <View style={styles.row}>
        <MaterialCommunityIcons
          name="calendar-edit"
          size={25}
          color={colors.SKYBLUE}
        />
        <Text style={styles.sectionTitle}>하루 한 번, 건강 기록</Text>
      </View>

      {/* 달력 카드 */}
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
    paddingTop: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginTop: 24,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    marginLeft: 8,
    fontSize: 18,
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
});

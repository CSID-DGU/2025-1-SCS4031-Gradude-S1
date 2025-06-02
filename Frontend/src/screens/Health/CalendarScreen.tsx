import React, {useMemo, useState} from 'react';
import {View, Text, SafeAreaView, StyleSheet, Alert} from 'react-native';
import {Calendar, DateData, LocaleConfig} from 'react-native-calendars';
import * as Animatable from 'react-native-animatable';
import {colors, healthNavigations} from '@/constants';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useGetHealthDiaryCalendar} from '@/hooks/queries/useHealthDiary';

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

export default function HealthCalendarScreen() {
  const navigation = useNavigation<any>();

  // 오늘(YYYY-MM-DD) 구하기 (en-CA 포맷)
  const today = useMemo(() => new Date().toLocaleDateString('en-CA'), []);

  // ① 현재 보고 있는 달/연도 상태
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1); // 월은 1~12

  // ② 해당 연/월에 기록된 날짜 + diaryId 가져오기
  const {data: calendarList = [], isLoading: loadingCalendar} =
    useGetHealthDiaryCalendar(year, month);

  // ③ markedDates 형태로 가공
  // 예: { "2025-06-02": { marked: true, dotColor: '#3F51B5' }, ... }
  const markedDates = useMemo(() => {
    const obj: Record<
      string,
      {
        selectedColor: string;
        selected: boolean;
        marked: boolean;
        dotColor: string;
      }
    > = {};

    calendarList.forEach(item => {
      obj[item.date] = {
        marked: true,
        dotColor: colors.SKYBLUE,
        selected: false,
        selectedColor: colors.SKYBLUE,
      };
    });

    // 오늘 날짜도 항상 선택 상태로 표시 (예: 원형 테두리)
    if (obj[today]) {
      obj[today].selected = true;
      obj[today].selectedColor = colors.SKYBLUE;
    } else {
      obj[today] = {
        selected: true,
        selectedColor: colors.SKYBLUE,
        marked: false,
        dotColor: colors.SKYBLUE,
      };
    }

    return obj;
  }, [calendarList, today]);

  // ④ 날짜 눌렀을 때 처리
  const onDayPress = (day: DateData) => {
    const {dateString} = day; // YYYY-MM-DD

    // (1) 오늘 날짜일 때: “새로운 하루 기록 화면”으로 이동
    if (dateString === today) {
      navigation.navigate(healthNavigations.HEALTH_DAIRY, {date: today});
      return;
    }

    // (2) 오늘이 아닌 날짜인데 기록이 있는지 확인
    const found = calendarList.find(item => item.date === dateString);
    if (found) {
      // 기록이 있을 때 → 결과 화면으로 이동 (diaryId 전달)
      navigation.navigate(healthNavigations.HEALTH_RESULT, {
        diaryId: found.diaryId,
      });
    } else {
      // 기록이 없으면 팝업
      Alert.alert('건강 수첩', '해당 날짜에는 기록이 없습니다.', [
        {text: '확인'},
      ]);
    }
  };

  // ⑤ 달을 바꿀 때 (이전/다음 화살표 누를 때) 연/월 state 갱신
  const onMonthChange = (date: {year: number; month: number}) => {
    setYear(date.year);
    setMonth(date.month);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>건강 수첩</Text>
      </View>
      <View style={styles.row}>
        <MaterialCommunityIcons
          name="calendar-edit"
          size={25}
          color={colors.SKYBLUE}
        />
        <Text style={styles.sectionTitle}>하루 한 번, 건강 기록</Text>
      </View>

      <Animatable.View
        animation="fadeInUp"
        duration={600}
        useNativeDriver
        style={styles.calendarCard}>
        <Calendar
          monthFormat={'yyyy년 M월'}
          onDayPress={onDayPress}
          onMonthChange={onMonthChange}
          markingType="multi-dot"
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
  header: {marginTop: 24, marginBottom: 16},
  title: {fontSize: 20, fontWeight: 'bold', color: colors.BLACK},
  row: {flexDirection: 'row', alignItems: 'center', marginBottom: 16},
  sectionTitle: {marginLeft: 8, fontSize: 18, color: colors.BLACK},

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

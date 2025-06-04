import React, {useMemo, useState, useEffect} from 'react';
import {View, Text, SafeAreaView, StyleSheet, Alert} from 'react-native';
import {Calendar, DateData, LocaleConfig} from 'react-native-calendars';
import * as Animatable from 'react-native-animatable';
import {colors, healthNavigations} from '@/constants';
import {useNavigation, useIsFocused} from '@react-navigation/native';
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

export default function CalendarScreen() {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();

  // 오늘(YYYY-MM-DD) 구하기
  const today = useMemo(() => new Date().toLocaleDateString('en-CA'), []);

  // 현재 보고 있는 연/월 상태
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  // 해당 연/월에 기록된 날짜+diaryId 가져오기
  const {
    data: calendarList = [],
    isLoading: loadingCalendar,
    refetch: refetchCalendar,
  } = useGetHealthDiaryCalendar(year, month);

  // 🎯 캘린더 화면이 포커스될 때마다(refocus) 강제로 refetch
  useEffect(() => {
    if (isFocused) {
      refetchCalendar();
    }
  }, [isFocused, year, month]);

  // markedDates 형태로 가공
  const markedDates = useMemo(() => {
    const obj: Record<
      string,
      {
        selected?: boolean;
        selectedColor?: string;
        marked?: boolean;
        dotColor?: string;
      }
    > = {};

    // 1) 실제로 기록이 있는 날짜들에 dot 표시
    calendarList.forEach(item => {
      obj[item.date] = {
        marked: true,
        dotColor: colors.SKYBLUE,
      };
    });

    // 2) 오늘 날짜는 항상 selected 상태로 표시
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

  // 날짜 눌렀을 때 처리 (기록 우선)
  const onDayPress = (day: DateData) => {
    const {dateString} = day; // YYYY-MM-DD

    // 1) 기록이 있는 날짜라면 → 결과 화면으로 이동
    const found = calendarList.find(item => item.date === dateString);
    if (found) {
      navigation.navigate(healthNavigations.HEALTH_RESULT, {
        diaryId: found.diaryId,
      });
      return;
    }

    // 2) 기록이 없고, 오늘 날짜라면 → 새 기록 화면(퀴즈)으로 이동
    if (dateString === today) {
      navigation.navigate(healthNavigations.HEALTH_DAIRY, {date: today});
      return;
    }

    // 3) 그 외 날짜(기록도 없고 오늘도 아님) → 경고창
    Alert.alert('건강 수첩', '해당 날짜에는 기록이 없습니다.', [
      {text: '확인'},
    ]);
  };

  // 달 바뀔 때 연/월 state 갱신
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

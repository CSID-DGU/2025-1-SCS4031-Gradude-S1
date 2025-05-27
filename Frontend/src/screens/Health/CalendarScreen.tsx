import React, {useMemo} from 'react';
import {View, Text, SafeAreaView, StyleSheet, Alert} from 'react-native';
import {Calendar, DateData, LocaleConfig} from 'react-native-calendars';
import * as Animatable from 'react-native-animatable';
import {colors, healthNavigations} from '@/constants';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
  const today = useMemo(() => new Date().toLocaleDateString('en-CA'), []);

  const onDayPress = (day: DateData) => {
    if (day.dateString === today) {
      navigation.navigate(healthNavigations.HEALTH_DAIRY, {date: today});
    } else {
      Alert.alert('건강 수첩', '오늘 날짜만 건강 기록이 가능합니다.', [
        {text: '확인'},
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>홍길동님의 건강 수첩</Text>
      </View>
      <View style={styles.row}>
        <MaterialCommunityIcons
          name="calendar-edit"
          size={25}
          color={colors.SKYBLUE}
        />
        <Text style={styles.sectionTitle}>하루 한 번, 건강 기록</Text>
      </View>

      {/* ↓ 애니메이션 카드 컨테이너 ↓ */}
      <Animatable.View
        animation="fadeInUp"
        duration={600}
        useNativeDriver
        style={styles.calendarCard}>
        <Calendar
          monthFormat={'yyyy년 M월'}
          onDayPress={onDayPress}
          markingType="dot"
          markedDates={{
            [today]: {
              selected: true,
              selectedColor: colors.SKYBLUE,
              selectedTextColor: colors.WHITE,
            },
          }}
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

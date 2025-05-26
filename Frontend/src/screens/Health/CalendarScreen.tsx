import React, {useMemo} from 'react';
import {StyleSheet, View, Alert} from 'react-native';
import {Calendar, DateData, LocaleConfig} from 'react-native-calendars';
import {useNavigation} from '@react-navigation/native';
import {colors, healthNavigations} from '@/constants';

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

type RootStackParamList = {
  Calendar: undefined;
  Quiz: {date: string};
};

// TODO : 오늘 날짜 설정 오류 수정 필요
export default function CalendarScreen() {
  const navigation = useNavigation<any>();
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

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
    <View style={styles.container}>
      <Calendar
        onDayPress={onDayPress}
        markingType="dot"
        markedDates={{
          [today]: {
            selected: true,
            selectedColor: colors.MAINBLUE,
            selectedTextColor: colors.WHITE,
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
});

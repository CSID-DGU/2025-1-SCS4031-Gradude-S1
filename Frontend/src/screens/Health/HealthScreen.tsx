import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BlurView} from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors, healthNavigations} from '@/constants';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainTabParamList} from '@/navigations/tab/TabNavigator';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {HealthStackParamList} from '@/navigations/stack/HealthStackNavigator';

const {width} = Dimensions.get('window');
const BUTTON_MARGIN = 8;
const BUTTON_COUNT = 3;
const BUTTON_TOTAL_MARGIN = BUTTON_MARGIN * 2 * BUTTON_COUNT;
const BUTTON_SIZE = (width - 40 - BUTTON_TOTAL_MARGIN) / BUTTON_COUNT;

type Navigation = CompositeNavigationProp<
  StackNavigationProp<HealthStackParamList>,
  BottomTabNavigationProp<MainTabParamList>
>;

function HealthScreen() {
  const navigation = useNavigation<Navigation>();

  // 더미 예시 // TODO : 연동
  const responseFromBackend = [
    {date: '2025-05-15', healthScore: 128},
    {date: '2025-05-16', healthScore: 256},
    {date: '2025-05-17', healthScore: 512},
    {date: '2025-05-18', healthScore: 1024},
    {date: '2025-05-19', healthScore: 2048},
  ];

  // 데이터 표에 넣기 위해 계산하는 함수
  const chartData = {
    labels: responseFromBackend.map(
      item =>
        `${new Date(item.date).getMonth() + 1}.${new Date(
          item.date,
        ).getDate()}`,
    ),
    datasets: [
      {
        data: responseFromBackend.map(item => item.healthScore),
        strokeWidth: 2,
      },
    ],
  };

  const buttons = [
    {
      icon: 'calendar-clear-outline',
      label: '하루 기록',
      screen: healthNavigations.CALENDAR,
    },
    {
      icon: 'pie-chart-outline',
      label: '진단 결과',
      screen: healthNavigations.FINAL_RESULT_LIST,
    },
    {
      icon: 'information-circle-outline',
      label: '뇌졸중이란?',
      screen: healthNavigations.STROKE_DETAIL,
    },
  ] as const;

  return (
    <SafeAreaView style={styles.container}>
      {/* TODO : 이름 수정 해야 함 */}
      <View style={styles.header}>
        <Text style={styles.title}>홍길동님의 건강 수첩</Text>
        <View style={styles.row}>
          <Text style={styles.subtitle}>하루 한 번, 건강 확인 </Text>
          <Icon name="checkbox" size={25} color="#00C20B" />
        </View>
      </View>

      <View style={styles.actions}>
        {buttons.map(btn => (
          <TouchableOpacity
            key={btn.label}
            onPress={() => navigation.navigate(btn.screen)}
            style={[
              styles.actionBtn,
              {width: BUTTON_SIZE, height: BUTTON_SIZE},
            ]}>
            <LinearGradient
              colors={[colors.PURPLE, colors.MAINBLUE]}
              start={{x: 0.2, y: 0}}
              end={{x: 0, y: 1.4}}
              style={styles.gradient}>
              <Icon name={btn.icon} size={42} color={colors.WHITE} />
              <Text style={styles.actionLabel}>{btn.label}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

      {/* 차트 섹션 */}
      <Text style={styles.sectionTitle}>나의 건강 점수</Text>
      <View style={styles.card}>
        {/* <LineChart
          data={chartData}
          width={width - 40}
          height={200}
          chartConfig={chartConfig}
          style={styles.chart}
          withInnerLines={false}
          withOuterLines={false}
          withShadow={false}
          bezier
          yAxisSuffix="점"
        /> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGRAY,
    padding: 24,
  },
  header: {
    marginVertical: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  actionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: BUTTON_MARGIN,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    width: '100%',
    height: '100%',
  },
  actionLabel: {
    marginTop: 6,
    color: colors.WHITE,
    fontSize: 15,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 8,
    elevation: 3,
  },
  chart: {
    borderRadius: 16,
  },
});

export default HealthScreen;

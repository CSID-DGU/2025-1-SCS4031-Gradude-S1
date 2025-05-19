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
import {colors} from '@/constants';
import {CompositeNavigationProp} from '@react-navigation/native';
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
  const chartData = {
    labels: ['3.01', '3.02', '3.05', '3.11', '오늘'],
    datasets: [
      {
        data: [12, 28, 45, 33, 53],
        strokeWidth: 2,
      },
    ],
  };

  // const chartConfig = {
  //   backgroundGradientFrom: '#fff',
  //   backgroundGradientTo: '#fff',
  //   decimalPlaces: 0,
  //   color: () => '#3B82F6',
  //   labelColor: () => '#999',
  //   propsForDots: {r: '4', strokeWidth: '2', stroke: '#3B82F6'},
  // };

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

      {/* 버튼 그룹 */}
      <View style={styles.actions}>
        {[
          {icon: 'calendar-clear-outline', label: '하루 기록'},
          {icon: 'pie-chart-outline', label: '진단 결과'},
          {icon: 'information-circle-outline', label: '뇌졸중이란?'},
        ].map(btn => (
          <TouchableOpacity
            key={btn.label}
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
    justifyContent: 'space-between',
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

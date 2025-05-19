import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors, healthNavigations} from '@/constants';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainTabParamList} from '@/navigations/tab/TabNavigator';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {HealthStackParamList} from '@/navigations/stack/HealthStackNavigator';
import {LineChart} from 'react-native-chart-kit';
import {Text as SvgText} from 'react-native-svg';

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

  const responseFromBackend = [
    {date: '2025-05-15', healthScore: 94},
    {date: '2025-05-16', healthScore: 56},
    {date: '2025-05-17', healthScore: 76},
    {date: '2025-05-18', healthScore: 20},
    {date: '2025-05-19', healthScore: 80},
  ];

  const scores = responseFromBackend.map(item => item.healthScore);
  const [selectedIndex, setSelectedIndex] = useState<number>(scores.length - 1);

  const chartData = {
    labels: responseFromBackend.map(
      item =>
        `${new Date(item.date).getMonth() + 1}.${new Date(
          item.date,
        ).getDate()}`,
    ),
    datasets: [
      {
        data: scores,
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
      <View style={styles.header}>
        <Text style={styles.title}>홍길동님의 건강 수첩</Text>
      </View>

      <View style={styles.row}>
        <Icon name="checkbox" size={25} color="#00C20B" />
        <Text style={styles.subtitle}> 하루 한 번, 건강 확인 </Text>
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

      <View style={styles.row}>
        <Icon name="bar-chart" size={25} color={colors.SKYBLUE} />
        <Text style={styles.sectionTitle}> 나의 건강 점수</Text>
      </View>

      <View style={styles.card}>
        <LineChart
          data={chartData}
          width={width - 80}
          height={300}
          chartConfig={{
            backgroundGradientFrom: colors.WHITE,
            backgroundGradientTo: colors.WHITE,
            decimalPlaces: 0,
            color: () => colors.MAINBLUE,
            labelColor: () => colors.BLACK,
            propsForDots: {
              r: '5',
              strokeWidth: '2',
              stroke: colors.MAINBLUE,
            },
            propsForBackgroundLines: {
              stroke: '#e6e6e6',
              strokeDasharray: '4',
            },
          }}
          fromZero={false}
          withInnerLines
          withVerticalLines={false}
          withShadow={false}
          withDots
          bezier
          yAxisSuffix="점"
          yAxisLabel=""
          verticalLabelRotation={0}
          yLabelsOffset={8}
          yAxisInterval={1}
          segments={3}
          onDataPointClick={({index}) => setSelectedIndex(index)}
          decorator={() => {
            if (selectedIndex === null) return null;
            const step = (width - 80) / (chartData.labels.length - 1);
            const x = step * selectedIndex;
            return (
              <SvgText
                key={`label-${selectedIndex}`}
                x={x}
                y={40}
                fill="#000"
                fontSize="14"
                fontWeight="bold"
                textAnchor="middle">
                {scores[selectedIndex]}점
              </SvgText>
            );
          }}
          renderDotContent={({x, y, index}) =>
            index === selectedIndex ? (
              <View
                key={`dot-${index}`}
                style={{
                  position: 'absolute',
                  top: y - 8,
                  left: x - 8,
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: '#fff',
                  borderWidth: 3,
                  borderColor: colors.MAINBLUE,
                }}
              />
            ) : null
          }
        />
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
    marginBottom: 14,
  },
  actions: {
    flexDirection: 'row',
    marginBottom: 40,
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
  },
  card: {
    backgroundColor: colors.WHITE,
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
    elevation: 5,
  },
});

export default HealthScreen;

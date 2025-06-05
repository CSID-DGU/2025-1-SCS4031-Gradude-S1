// src/screens/Health/HealthScreen.tsx

import React, {useMemo, useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {LineChart} from 'react-native-chart-kit';
import {colors, healthNavigations} from '@/constants';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {MainTabParamList} from '@/navigations/tab/TabNavigator';
import {HealthStackParamList} from '@/navigations/stack/HealthStackNavigator';
import {useGetHealthDiaryGraph} from '@/hooks/queries/useHealthDiary';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const OUTER_PAD = 24;
const INNER_PAD = 16;
const CHART_HEIGHT = 300;
const CHART_WIDTH = SCREEN_WIDTH - OUTER_PAD * 2 - INNER_PAD * 1.5;

const BUTTON_MARGIN = 8;
const BUTTON_COUNT = 3;
const BUTTON_SIZE =
  (SCREEN_WIDTH - OUTER_PAD * 2 - BUTTON_MARGIN * 2 * BUTTON_COUNT) /
  BUTTON_COUNT;

const BOX_WIDTH = 110;
const BOX_MARGIN = 8;

export default function HealthScreen() {
  const navigation =
    useNavigation<
      CompositeNavigationProp<
        StackNavigationProp<HealthStackParamList>,
        BottomTabNavigationProp<MainTabParamList>
      >
    >();

  // 차트 데이터 가져오기
  const {data: response = [], isLoading, isError} = useGetHealthDiaryGraph();

  // 디버깅: 서버에서 내려오는 데이터 확인
  useEffect(() => {
    console.log('🔽[HealthChart] fetched response:', response);
  }, [response]);

  // response 타입: Array<{ date: string; healthScore: number }>
  const labels = useMemo(
    () =>
      response.map(r =>
        // "2025-06-01" → "06.01"
        r.date.slice(5).replace('-', '.'),
      ),
    [response],
  );
  const data = useMemo(() => response.map(r => r.healthScore), [response]);

  // 차트와 날짜 바의 인덱스를 맞추기 위해 뒤집은 배열 생성
  const reversed = useMemo(() => [...response].reverse(), [response]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // 데이터가 바뀌면 항상 맨 뒤(최신) 인덱스로 초기화
  useEffect(() => {
    if (data.length > 0) {
      setSelectedIndex(data.length - 1);
      // 맨 뒤 날짜 박스가 중앙에 보이도록 스크롤 (옵션)
      setTimeout(() => {
        const revIdx = 0; // 최신 날짜가 reversed[0]
        const offsetX =
          revIdx * (BOX_WIDTH + BOX_MARGIN * 2) -
          (SCREEN_WIDTH - BOX_WIDTH) / 2;
        scrollRef.current?.scrollTo({x: offsetX, animated: true});
      }, 100);
    }
  }, [data]);

  const scrollRef = useRef<ScrollView>(null);

  const onSelect = (origIdx: number) => {
    setSelectedIndex(origIdx);
    const revIdx = data.length - 1 - origIdx;
    const offsetX =
      revIdx * (BOX_WIDTH + BOX_MARGIN * 2) - (SCREEN_WIDTH - BOX_WIDTH) / 2;
    scrollRef.current?.scrollTo({x: offsetX, animated: true});
  };

  // 로딩/에러 상태 처리
  if (isLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={colors.MAINBLUE} />
      </SafeAreaView>
    );
  }
  if (isError) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>❗️ 건강 점수를 불러오는 중 오류가 발생했습니다.</Text>
      </SafeAreaView>
    );
  }
  if (response.length === 0) {
    // 기록이 하나도 없을 때 안내
    return (
      <SafeAreaView style={styles.center}>
        <Text>아직 건강 기록이 없습니다. 먼저 하루 기록을 눌러주세요.</Text>
      </SafeAreaView>
    );
  }

  // 버튼 목록
  const buttons = [
    {
      icon: 'calendar-check',
      label: '하루 기록',
      screen: healthNavigations.CALENDAR,
    },
    {
      icon: 'medical-bag',
      label: '진단 결과',
      screen: healthNavigations.FINAL_RESULT_LIST,
    },
    {
      icon: 'brain',
      label: '뇌졸중이란?',
      screen: healthNavigations.STROKE_DETAIL,
    },
  ] as const;

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>나의 건강 수첩</Text>
      </View>

      {/* 하루 확인 */}
      <View style={styles.row}>
        <MaterialCommunityIcons
          name="checkbox-marked-circle-outline"
          size={25}
          color={colors.BLUE}
        />
        <Text style={styles.sectionTitle}>하루 한 번, 건강 확인</Text>
      </View>

      {/* 버튼 액션 */}
      <View style={styles.actions}>
        {buttons.map(b => (
          <Pressable
            key={b.label}
            onPress={() => navigation.navigate(b.screen)}
            style={({pressed}) => [
              styles.actionBtn,
              {width: BUTTON_SIZE, height: BUTTON_SIZE},
              {transform: [{scale: pressed ? 0.96 : 1}]},
            ]}>
            <LinearGradient
              colors={[colors.PURPLE, colors.MAINBLUE]}
              start={{x: 0.2, y: 0}}
              end={{x: 0, y: 1.4}}
              style={styles.gradient}>
              <MaterialCommunityIcons
                name={b.icon}
                size={42}
                color={colors.WHITE}
              />
              <Text style={styles.actionLabel}>{b.label}</Text>
            </LinearGradient>
          </Pressable>
        ))}
      </View>

      {/* 차트 섹션 */}
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons
          name="chart-timeline-variant"
          size={25}
          color={colors.BLUE}
        />
        <Text style={styles.sectionTitle}>나의 건강 점수</Text>
      </View>

      <View style={styles.card}>
        <LineChart
          data={{labels, datasets: [{data}]}}
          width={CHART_WIDTH}
          height={CHART_HEIGHT}
          chartConfig={{
            backgroundGradientFrom: colors.WHITE,
            backgroundGradientTo: colors.WHITE,
            decimalPlaces: 0,
            color: () => colors.MAINBLUE,
            labelColor: () => colors.BLACK,
            propsForBackgroundLines: {
              stroke: colors.LIGHTGRAY,
              strokeDasharray: '4',
            },
            propsForDots: {r: '0'},
          }}
          style={{marginHorizontal: -INNER_PAD}}
          withShadow={false}
          withInnerLines
          withVerticalLines={false}
          yLabelsOffset={10}
          yAxisSuffix="점"
          fromZero
          segments={4}
          bezier
          onDataPointClick={({index}) => onSelect(index)}
          renderDotContent={({x, y, index}) => {
            const isSelected = index === selectedIndex;
            const size = 12;
            return (
              <View
                key={index}
                style={{
                  position: 'absolute',
                  left: x - size / 2,
                  top: y - size / 2,
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  backgroundColor: isSelected ? colors.MAINBLUE : colors.WHITE,
                  borderWidth: isSelected ? 0 : 2,
                  borderColor: isSelected ? 'transparent' : colors.MAINBLUE,
                }}
              />
            );
          }}
        />
      </View>

      {/* 날짜 리스트 바 */}
      <ScrollView
        horizontal
        ref={scrollRef}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.infoContainer}>
        {reversed.map((item, revIdx) => {
          const origIdx = data.length - 1 - revIdx;
          const active = origIdx === selectedIndex;
          const d = new Date(item.date);
          const dateLabel = `${d.getFullYear().toString().slice(-2)}.${(
            d.getMonth() + 1
          )
            .toString()
            .padStart(2, '0')}.${d.getDate().toString().padStart(2, '0')}`;
          return (
            <Pressable
              key={origIdx}
              onPress={() => onSelect(origIdx)}
              style={[
                styles.infoBox,
                {width: BOX_WIDTH, marginHorizontal: BOX_MARGIN},
                active && styles.infoBoxActive,
              ]}>
              <Text style={[styles.infoDate, active && styles.infoTextActive]}>
                {dateLabel}
              </Text>
              <Text style={[styles.infoScore, active && styles.infoTextActive]}>
                {item.healthScore}점
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: colors.SEMIWHITE,
    paddingHorizontal: OUTER_PAD,
    paddingTop: 24,
  },
  header: {marginBottom: 16},
  title: {fontSize: 20, fontWeight: 'bold'},
  row: {flexDirection: 'row', alignItems: 'center', marginBottom: 12},
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {marginLeft: 8, fontSize: 18},
  actions: {
    flexDirection: 'row',
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  actionBtn: {
    marginHorizontal: BUTTON_MARGIN,
    // iOS 그림자
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    // Android elevation
    elevation: 4,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  actionLabel: {
    marginTop: 4,
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: colors.WHITE,
    borderRadius: 16,
    padding: INNER_PAD,
    elevation: 5,
    marginBottom: 24,
  },
  infoContainer: {paddingVertical: 4, alignItems: 'center'},
  infoBox: {
    backgroundColor: colors.WHITE,
    borderColor: colors.LIGHTGRAY,
    borderRadius: 6,
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
  },
  infoBoxActive: {backgroundColor: colors.MAINBLUE},
  infoDate: {fontSize: 14, color: colors.GRAY},
  infoScore: {
    fontSize: 18,
    color: colors.MAINBLUE,
    marginTop: 4,
    fontWeight: '500',
  },
  infoTextActive: {color: '#fff'},
});

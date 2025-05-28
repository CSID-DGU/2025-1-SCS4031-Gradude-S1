import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import PagerView from 'react-native-pager-view';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {Text} from 'react-native-gesture-handler';
import {colors} from '@/constants';

interface StrokeScreenProps {}
const {width: SCREEN_W} = Dimensions.get('window');

function StrokeScreen({}: StrokeScreenProps) {
  const [page, setPage] = useState(0);
  const opacity = useSharedValue(0);
  useEffect(() => {
    opacity.value = withTiming(1, {duration: 500});
  }, []);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{scale: opacity.value * 0.05 + 0.95}],
  }));

  const symptoms = [
    '반신마비: 손상된 뇌의 반대쪽에 마비가 옵니다.',
    '반신 감각 장애: 손상된 뇌의 반대쪽 얼굴, 팔, 다리에 감각 장애가 생깁니다. 대개 반신마비와 함께 옵니다.',
    '언어 장애: 정신이 명료한데도 말을 잘하지 못하거나 남의 말을 이해하지 못합니다.',
    '발음 장애: 말을 하거나 알아들을 수는 있지만 혀, 목구멍, 입술 등의 근육이 마비되어 정확한 발음을 할 수 없습니다.',
    '운동 실조: 마비는 아니지만 손발이 마음대로 조절되지 않습니다.',
    '시야·시력 장애: 갑자기 한쪽 눈이 안 보이거나 시야의 한 귀퉁이가 어둡게 보입니다.',
    '복시: 한 물체가 명료하게 보이지 않고 두 개로 겹쳐 보입니다.',
    '연하 장애: 음식물을 잘 삼키지 못하고 사레가 들며, 침을 삼키지 못해 흘립니다.',
    '어지럼증: 뇌간 뇌졸중의 경우 발생합니다.  갑자기 세상이 빙빙 돌고 메스껍고 토할 것 같다가 곧 좋아지는 증상은 뇌졸중보다는 내이의 가벼운 질환일 가능성이 크지만 반복될 경우 세심한 진찰이 필요합니다.',
  ];

  return (
    <View style={styles.screen}>
      <PagerView
        style={styles.pager}
        initialPage={0}
        onPageSelected={e => setPage(e.nativeEvent.position)}
        offscreenPageLimit={3}
        orientation="horizontal">
        <View key="1" style={styles.page}>
          <Animated.View style={[styles.card, animatedStyle]}>
            <Text style={styles.header}>뇌졸중(Stroke)이란?</Text>
            <Text style={styles.paragraph}>
              뇌의 혈관이 막히거나 터져서 뇌 조직이 손상돼 발생하는 신경학적
              증상입니다. 흔히 '중풍'이라고도 부릅니다.
            </Text>
          </Animated.View>
        </View>

        <View key="2" style={styles.page}>
          <Animated.View style={[styles.card, animatedStyle]}>
            <Text style={styles.header}>뇌졸중의 종류</Text>
            <Text style={styles.bullet}>
              • 허혈성 뇌졸중 (뇌경색, Ischemic stroke)
            </Text>
            <Text style={styles.bullet}>
              • 출혈성 뇌졸중 (뇌출혈, Hemorrhagic stroke)
            </Text>
            <Text style={styles.note}>
              ※ 허혈성 뇌졸중이 약 85%를 차지합니다.
            </Text>
          </Animated.View>
        </View>

        <View key="3" style={styles.page}>
          <Animated.View style={[styles.card, animatedStyle]}>
            <Text style={styles.header}>주요 증상</Text>
            {symptoms.map((s, i) => (
              <Text key={i} style={styles.bullet}>
                {s}
              </Text>
            ))}
          </Animated.View>
        </View>
      </PagerView>

      <View style={styles.indicatorContainer}>
        {[0, 1, 2].map(idx => (
          <View
            key={idx}
            style={[
              styles.dot,
              {backgroundColor: page === idx ? colors.MAINBLUE : '#ccc'},
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.BACKGRAY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pager: {flex: 1, width: SCREEN_W},
  page: {justifyContent: 'center', alignItems: 'center', width: SCREEN_W},
  card: {
    width: SCREEN_W * 0.85,
    backgroundColor: colors.WHITE,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.BLACK,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.MAINBLUE,
    marginBottom: 12,
  },
  paragraph: {fontSize: 16, color: colors.BLACK, lineHeight: 24},
  bullet: {
    fontSize: 16,
    color: colors.BLACK,
    lineHeight: 22,
    marginVertical: 4,
  },
  note: {fontSize: 14, color: colors.GRAY, fontStyle: 'italic', marginTop: 8},
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
export default StrokeScreen;

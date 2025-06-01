import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Dimensions, ScrollView} from 'react-native';
import PagerView from 'react-native-pager-view';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {Text} from 'react-native';
import {colors, profileNavigations} from '@/constants';
import {ProfileStackParamList} from '@/navigations/stack/ProfileStackNavigator';
import {StackScreenProps} from '@react-navigation/stack';

const {width: SCREEN_W} = Dimensions.get('window');

type InfoScreenProps = StackScreenProps<
  ProfileStackParamList,
  typeof profileNavigations.INFO
>;
function InfoScreen({navigation}: InfoScreenProps) {
  const [page, setPage] = useState(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // 화면 진입 시 페이드인 애니메이션
    opacity.value = withTiming(1, {duration: 500});
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{scale: opacity.value * 0.05 + 0.95}],
  }));

  const pages = [
    {
      title: '총칙 · 수집 항목',
      content: (
        <>
          <Text style={styles.header}>1. 총칙</Text>
          <Text style={styles.paragraph}>
            본 개인정보처리방침(이하 “본 방침”)은 **[다시봄]**(이하 “본 앱”)이
            제공하는 서비스 이용과 관련하여, 사용자의 개인정보가 어떻게
            수집·이용·보관·파기되는지를 설명합니다. 본 앱은 사용자의 개인정보를
            보호하기 위해 관련 법률 및 규정을 준수하며, 본 방침을 통해
            사용자에게 개인정보 보호 관련 주요 사항을 안내합니다.
          </Text>

          <Text style={[styles.header, {marginTop: 20}]}>
            2. 수집하는 개인정보 항목
          </Text>
          <Text style={styles.subHeader}>1) 필수 수집 정보</Text>
          <Text style={styles.bullet}>
            • 이메일 (SNS 로그인 시 해당 플랫폼 제공 이메일)
          </Text>
          <Text style={styles.bullet}>
            • 성명 (SNS 로그인 시 해당 플랫폼 제공 이름)
          </Text>
          <Text style={styles.bullet}>• 닉네임</Text>
          <Text style={styles.bullet}>• 프로필 사진</Text>
          <Text style={styles.bullet}>• 사용자 연령대</Text>
          <Text style={styles.bullet}>• 사용자 성별</Text>

          <Text style={[styles.subHeader, {marginTop: 16}]}>
            2) 영상·음성 수집 정보
          </Text>
          <Text style={styles.bullet}>
            • 사용자가 생성하거나 업로드하는 동영상 데이터
          </Text>
          <Text style={styles.bullet}>
            • 녹음 또는 음성 입력을 통해 수집되는 음성 데이터 💡 본 앱은 수집한
            영상 및 음성 데이터를 앱 내 분석 목적 으로만 사용하며, 외부로 절대
            유출하지 않습니다.
          </Text>

          <Text style={[styles.subHeader, {marginTop: 16}]}>
            3) 위치 정보 수집
          </Text>
          <Text style={styles.bullet}>
            • GPS 기반 실시간 위치 정보 (서비스 이용을 위해 필요한 경우) –
            사용자 위치 기반, 병원 추천 💡 본 앱은 수집된 위치 정보를 앱 내 기능
            제공 목적 으로만 활용하며, 외부에 공유하거나 저장하지 않습니다.
          </Text>
        </>
      ),
    },
    {
      title: '수집 방법 · 이용 목적',
      content: (
        <>
          <Text style={styles.header}>3. 개인정보 수집 방법</Text>
          <Text style={styles.bullet}>
            1) 회원가입 및 서비스 이용 과정에서 사용자가 직접 입력한 정보
          </Text>
          <Text style={styles.bullet}>
            2) 영상·음성: 사용자가 직접 업로드하거나 녹음·촬영 시 자동 수집
          </Text>
          <Text style={styles.bullet}>
            3) 위치: 기기 권한을 통해 동의 받은 위치 정보를 실시간 수집
          </Text>

          <Text style={[styles.header, {marginTop: 20}]}>
            4. 개인정보의 이용 목적
          </Text>
          <Text style={styles.subHeader}>1) 서비스 제공 및 운영</Text>
          <Text style={styles.bullet}>
            • 사용자 연령 기반 퀴즈 제공 및 뇌졸중 위험도 파악
          </Text>

          <Text style={[styles.subHeader, {marginTop: 12}]}>
            2) 맞춤형 서비스 제공 및 사용자 경험 개선
          </Text>
          <Text style={styles.bullet}>
            • 맞춤형 안면인식·음성인식을 통한 뇌졸중 위험도 제공
          </Text>

          <Text style={[styles.subHeader, {marginTop: 12}]}>
            3) 위치 기반 서비스 제공
          </Text>
          <Text style={styles.bullet}>• 현재 위치에 따른 가까운 병원 추천</Text>

          <Text style={[styles.subHeader, {marginTop: 12}]}>
            4) 법적 의무 준수
          </Text>
          <Text style={styles.bullet}>
            • 관련 법령에 따른 이용자 정보 보호 및 기록 관리
          </Text>

          <Text style={[styles.note, {marginTop: 12}]}>
            참고: 영상·음성·위치 정보는 모두 본 앱 내부 기능 제공 목적으로만
            활용됩니다.
          </Text>
        </>
      ),
    },
    {
      title: '보관 및 파기 · 제3자 제공',
      content: (
        <>
          <Text style={styles.header}>5. 개인정보의 보관 및 파기</Text>
          <Text style={styles.subHeader}>1) 개인정보 보관 기간</Text>
          <Text style={styles.bullet}>
            • 회원가입 정보: 회원 탈퇴 시 즉시 삭제
          </Text>
          <Text style={styles.bullet}>
            • 영상·음성 콘텐츠: 사용자가 삭제 요청 시 즉시 파기
          </Text>
          <Text style={styles.bullet}>
            • 위치 정보: 실시간 서비스 제공 시점에만 일시 활용하고, 별도
            저장하지 않음
          </Text>
          <Text style={styles.bullet}>
            • 서비스 이용 기록(로그): 최대 1년 보관 후 자동 삭제
          </Text>

          <Text style={[styles.subHeader, {marginTop: 16}]}>
            2) 개인정보 파기 절차 및 방법
          </Text>
          <Text style={styles.bullet}>
            • 사용자가 탈퇴를 요청하면 즉시 모든 데이터를 영구 삭제
          </Text>
          <Text style={styles.bullet}>
            • 종이에 출력된 개인정보는 분쇄 또는 소각 처리
          </Text>
          <Text style={styles.bullet}>
            • 전자적 파일 형태로 저장된 개인정보는 복구 불가능한 방식으로 완전
            삭제
          </Text>

          <Text style={[styles.header, {marginTop: 20}]}>
            6. 개인정보의 제3자 제공 및 위탁
          </Text>
          <Text style={styles.bullet}>
            본 앱은 사용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.
            다만, 아래 경우에는 예외적으로 제공될 수 있습니다.
          </Text>
          <Text style={styles.bullet}>1) 사용자가 사전에 동의한 경우</Text>
          <Text style={styles.bullet}>
            2) 법령에 따라 수사기관 또는 정부 기관이 적법한 절차에 따라 요청하는
            경우
          </Text>

          <Text style={[styles.note, {marginTop: 12}]}>
            본 앱은 영상·음성·위치 정보를 포함한 모든 개인정보를 외부에 제공하지
            않으며, 필요 시 지정된 외부 업체(Google Analytics 등)와 최소한의
            정보만 공유합니다. 공유 시에는 해당 업체와 개인정보 보호 계약을
            체결하여 데이터를 안전하게 관리합니다.
          </Text>
        </>
      ),
    },
    {
      title: '권리 행사 · 보호 대책 · 책임자 · 변경',
      content: (
        <>
          <Text style={styles.header}>7. 사용자의 권리 및 행사 방법</Text>
          <Text style={styles.bullet}>
            1) 개인정보 삭제 및 회원 탈퇴: 마이페이지 → 회원 탈퇴 메뉴에서 직접
            탈퇴 가능
          </Text>
          <Text style={styles.note}>
            본 앱은 사용자의 요청이 있을 경우 지체 없이 개인정보를 수정 또는
            삭제합니다.
          </Text>

          <Text style={[styles.header, {marginTop: 20}]}>
            8. 개인정보 보호를 위한 기술적·관리적 대책
          </Text>
          <Text style={styles.bullet}>
            • 영상·음성 파일은 암호화된 형태로만 일시 저장하거나, 사용자가
            명시적으로 업로드한 이후 즉시 분석 완료 후 삭제합니다.
          </Text>
          <Text style={styles.bullet}>
            • 위치 정보는 실시간 기능 제공 시에만 일시 활용하며, 별도 저장하지
            않습니다.
          </Text>

          <Text style={[styles.header, {marginTop: 20}]}>
            9. 개인정보 보호책임자 및 문의처
          </Text>
          <Text style={styles.bullet}>• 소속 : 동국대학교 Gradude팀</Text>
          <Text style={styles.bullet}>• 이메일: donggukGradude@gamil.com</Text>
          <Text style={styles.note}>
            사용자는 개인정보 보호 관련 문의 사항이 있을 경우 위 연락처로 문의할
            수 있으며, 본 앱은 신속·성실하게 답변드립니다.
          </Text>

          <Text style={[styles.header, {marginTop: 20}]}>
            10. 개인정보처리방침의 변경
          </Text>
          <Text style={styles.bullet}>
            본 개인정보처리방침은 법령 변경, 서비스 정책 변경 등에 따라
            업데이트될 수 있으며, 중요한 변경 사항이 있을 경우 앱 내 공지를 통해
            안내합니다.
          </Text>
          <Text style={[styles.note, {marginTop: 12}]}>
            최종 업데이트 날짜: 2025-06-01
          </Text>
        </>
      ),
    },
  ];

  return (
    <View style={styles.screen}>
      <PagerView
        style={styles.pager}
        initialPage={0}
        onPageSelected={e => setPage(e.nativeEvent.position)}
        offscreenPageLimit={3}
        orientation="horizontal">
        {pages.map((p, idx) => (
          <View key={idx.toString()} style={styles.page}>
            <Animated.View style={[styles.card, animatedStyle]}>
              <ScrollView contentContainerStyle={{paddingBottom: 20}}>
                <Text style={styles.title}>{p.title}</Text>
                {p.content}
              </ScrollView>
            </Animated.View>
          </View>
        ))}
      </PagerView>

      <View style={styles.indicatorContainer}>
        {pages.map((_, idx) => (
          <View
            key={idx.toString()}
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
    justifyContent: 'flex-start',
  },
  pager: {
    flex: 1,
    width: SCREEN_W,
  },
  page: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: SCREEN_W,
    paddingTop: 40,
  },
  card: {
    width: SCREEN_W * 0.9,
    backgroundColor: colors.WHITE,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.BLACK,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.MAINBLUE,
    marginBottom: 12,
    textAlign: 'center',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.MAINBLUE,
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.BLACK,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 14,
    color: colors.BLACK,
    lineHeight: 20,
    marginBottom: 8,
  },
  bullet: {
    fontSize: 14,
    color: colors.BLACK,
    lineHeight: 20,
    marginVertical: 4,
    paddingLeft: 8,
  },
  note: {
    fontSize: 12,
    color: colors.GRAY,
    fontStyle: 'italic',
    marginTop: 8,
    lineHeight: 18,
  },
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

export default InfoScreen;

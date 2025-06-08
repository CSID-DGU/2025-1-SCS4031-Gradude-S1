import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  Switch,
  ActivityIndicator,
  Alert,
  LayoutAnimation,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation, CommonActions} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackScreenProps} from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import useForm from '@/hooks/useForm';
import useAuth from '@/hooks/queries/useAuth';
import {validateSignup} from '@/utils/validate';
import {authNavigations, colors} from '@/constants';
import type {RootState} from '@/store';
import type {RootStackParamList} from '@/navigations/root/RootNavigator';
import type {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';
import CustomButton from '@/components/commons/CustomButton';
import GenderToggle from '@/components/GenderToggle';
import KakaoProfile from '@/assets/icons/KakaoProfile.svg';

// 1) 네비게이션 타입 정의
type RootNavProp = NativeStackNavigationProp<RootStackParamList>;
type SignupProps = StackScreenProps<
  AuthStackParamList,
  typeof authNavigations.SIGNUP
>;

// 2) Redux에 미리 저장된 “preSignupUserInfo” 타입 정의
type UserInfo = {
  kakaoId: number;
  nickname: string;
  profileImageUrl: string;
};

export default function SignupScreen({}: SignupProps) {
  const dispatch = useDispatch();
  const navigation = useNavigation<RootNavProp>();

  // ── Redux에서 “preSignupUserInfo” 가져오기 ──
  //    (Login 과정에서, 첫 로그인인 경우에만 setPreSignupUserInfo(...)를 통해 채워둔 값)
  const pre = useSelector<RootState, UserInfo | null>(
    state => state.auth.preSignupUserInfo,
  );

  // ── 이미 프로필이 완성된 상태라면(앱 재실행 or 두 번 이상 진입 방지) 바로 메인으로 이동 ──
  const profileComplete = useSelector<RootState, boolean>(
    state => state.auth.profileComplete,
  );

  useEffect(() => {
    if (profileComplete) {
      // Root 네비게이터로 올라가서 TabNavigator로 리셋
      const rootNav = navigation.getParent();
      if (rootNav) {
        rootNav.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'TabNavigator'}],
          }),
        );
      }
    }
  }, [profileComplete, navigation]);

  // 만약 “preSignupUserInfo”가 아직 없다면(=카카오 로그인 직후 호출 흐름이 제대로 오지 않은 경우)
  // 무한 로딩을 방지하기 위해 로딩 스피너만 띄워 둡니다.
  if (!pre) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={colors.MAINBLUE} />
      </SafeAreaView>
    );
  }

  // 3) useForm 훅으로 각 필드 관리
  const form = useForm({
    initialValue: {
      kakaoId: pre.kakaoId,
      nickname: pre.nickname,
      profileImageUrl: pre.profileImageUrl,
      gender: 'MALE' as 'MALE' | 'FEMALE',
      birth: '',
      faceRecognitionAgreed: false,
    },
    validate: validateSignup,
  });

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isConsentExpanded, setIsConsentExpanded] = useState(false);

  // 생년월일 DatePicker 콜백
  const handleConfirm = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    form.getFieldProps('birth').onChange(`${yyyy}-${mm}-${dd}`);
    setDatePickerVisibility(false);
  };

  // 개인정보 수집 동의 토글
  const toggleConsent = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsConsentExpanded(prev => !prev);
  };

  // 회원가입 버튼 누를 때 호출
  const {signupMutation} = useAuth();
  const handleSignup = () => {
    // 1) 얼굴 인식 동의 여부 체크
    if (!form.values.faceRecognitionAgreed) {
      Alert.alert('안내', '개인 정보 수집 동의는 필수입니다.');
      return;
    }

    // 2) 생년월일 형식 체크 (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.values.birth)) {
      Alert.alert('안내', '생년월일을 올바르게 입력해주세요 (YYYY-MM-DD).');
      return;
    }

    // 3) validateSignup 함수 호출 (추가 검증)
    const errors = validateSignup({
      kakaoId: pre.kakaoId,
      nickname: pre.nickname,
      profileImageUrl: pre.profileImageUrl,
      gender: form.values.gender,
      birth: form.values.birth,
      faceRecognitionAgreed: form.values.faceRecognitionAgreed,
    });
    for (const key in errors) {
      const msg = errors[key as keyof typeof errors];
      if (msg) {
        Alert.alert('안내', msg);
        return;
      }
    }

    // 4) 백엔드 회원가입 API 호출
    signupMutation.mutate(
      {
        kakaoId: pre.kakaoId,
        nickname: pre.nickname,
        profileImageUrl: pre.profileImageUrl,
        gender: form.values.gender,
        birth: form.values.birth,
        faceRecognitionAgreed: form.values.faceRecognitionAgreed,
      },
      {
        onSuccess: () => {
          console.log('✅ 회원가입 성공');
          // onSuccess에서 profileComplete = true로 바뀌면 useEffect가 실행되어 메인으로 리셋됩니다.
        },
        onError: err => {
          // console.error('❌ 회원가입 에러:', err);
          Alert.alert(
            '오류',
            '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.',
          );
        },
      },
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        {/* ── 프로필 이미지 + 닉네임 ── */}
        <View style={styles.inputContainer}>
          <Image source={{uri: pre.profileImageUrl}} style={styles.avatar} />
          <Text style={styles.nicknameText}>{pre.nickname}</Text>

          {/* 성별 라디오 */}
          <Text style={styles.label}>성별</Text>
          <GenderToggle
            value={form.values.gender}
            onChange={g => form.getFieldProps('gender').onChange(g)}
          />

          {/* 생년월일 입력 */}
          <Text style={styles.label}>생년월일</Text>
          <TouchableOpacity
            onPress={() => setDatePickerVisibility(true)}
            activeOpacity={0.8}>
            <View style={[styles.dateInputContainer, styles.dateinput]}>
              <Text style={styles.dateText}>
                {form.values.birth || 'YYYY-MM-DD'}
              </Text>
              <Ionicons name="calendar-outline" size={20} color={colors.GRAY} />
            </View>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={() => setDatePickerVisibility(false)}
            confirmTextIOS="확인"
            cancelTextIOS="취소"
            locale="ko"
          />

          {/* 개인정보 수집 동의 */}
          <View style={styles.consentContainer}>
            <TouchableOpacity
              style={styles.consentHeader}
              activeOpacity={0.7}
              onPress={toggleConsent}>
              <Text style={styles.consentTitle}>
                개인 정보 수집 동의 (필수)
              </Text>
              <Ionicons
                name={isConsentExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={colors.GRAY}
              />
            </TouchableOpacity>

            {isConsentExpanded && (
              <View style={styles.consentDescriptionWrapper}>
                <Text style={styles.consentDescription}>
                  <Text style={styles.bold}>다시 봄, 개인정보 처리 방침</Text>
                  {'\n\n'}
                  <Text style={styles.bold}>• 수집 정보</Text>
                  {'\n'} └ 안면 정보 (카메라 캡처)
                  {'\n'} └ 음성 정보 (마이크 녹음)
                  {'\n'} └ 위치 정보 (GPS 기반, 지도 기능 제공용)
                  {'\n\n'}
                  <Text style={styles.bold}>• 이용 목적</Text>
                  {'\n'} └ 얼굴·음성 인증 및 기능 제공
                  {'\n'} └ 지도 내 사용자 위치 표시 및 경로 안내
                  {'\n'} └ 서비스 개선을 위한 분석
                  {'\n\n'}
                  <Text style={styles.bold}>• 보관 및 파기</Text>
                  {'\n'} └ 수집된 정보는 앱 내 사용에만 활용합니다.
                  {'\n'} └ 사용자가 탈퇴하거나 해당 기능 해제 시 즉시
                  삭제합니다.
                  {'\n'} └ 외부 서버/제3자에게 절대 제공하지 않습니다.
                  {'\n\n'}
                  <Text style={styles.bold}>• 동의 방법</Text>
                  {'\n'} └ 회원가입 화면에서 본 안내를 확인 후 “동의” 스위치를
                  켜주세요.
                  {'\n\n'}
                  <Text style={styles.bold}>
                    자세한 내용은 앱 설정 → 개인정보 처리방침에서 확인할 수
                    있습니다.
                  </Text>
                </Text>
              </View>
            )}

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>동의합니다</Text>
              <Switch
                value={form.values.faceRecognitionAgreed}
                onValueChange={val =>
                  form.getFieldProps('faceRecognitionAgreed').onChange(val)
                }
                thumbColor={form.values.faceRecognitionAgreed ? '#fff' : '#fff'}
                trackColor={{false: '#ccc', true: colors.MAINBLUE}}
              />
            </View>
          </View>
        </View>

        {/* 완료 버튼 */}
        <CustomButton
          label="완료"
          variant="filled"
          size="large"
          onPress={handleSignup}
          disabled={signupMutation.status === 'pending'}
        />
        {signupMutation.status === 'pending' && (
          <ActivityIndicator
            style={styles.loadingIndicator}
            size="small"
            color={colors.MAINBLUE}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.WHITE},
  scrollContent: {padding: 20, flexGrow: 1, justifyContent: 'center'},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  inputContainer: {flex: 1, marginBottom: 40},
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 100,
    marginVertical: 20,
    alignSelf: 'center',
  },
  nicknameText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {fontSize: 15, marginBottom: 10, color: '#333'},
  dateinput: {
    borderBottomWidth: 1,
    borderColor: colors.LIGHTGRAY,
    marginBottom: 24,
    paddingVertical: 8,
  },
  dateInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  dateText: {fontSize: 16, color: colors.BLACK},
  consentContainer: {marginBottom: 32},
  consentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: colors.LIGHTGRAY,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 12,
  },
  consentTitle: {fontSize: 16, fontWeight: '600', color: '#333'},
  consentDescriptionWrapper: {
    marginTop: 8,
    padding: 12,
    backgroundColor: colors.ALERTBACK,
    borderRadius: 8,
    borderColor: '#e1e1e1',
    borderWidth: 1,
  },
  consentDescription: {fontSize: 14, color: colors.GRAY, lineHeight: 22},
  bold: {fontWeight: '600', color: '#333'},
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  switchLabel: {fontSize: 15, color: '#333'},
  loadingIndicator: {marginTop: 10, alignSelf: 'center'},
});

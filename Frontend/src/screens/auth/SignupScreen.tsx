import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Switch,
  ActivityIndicator,
  Alert,
  LayoutAnimation,
  ScrollView,
} from 'react-native';
import {format} from 'date-fns';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackScreenProps} from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import useForm from '@/hooks/useForm';
import useAuth from '@/hooks/queries/useAuth';
import {validateSignup} from '@/utils/validate';
import {authNavigations, colors} from '@/constants';
import {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';
import GenderToggle from '@/components/GenderToggle';
import CustomButton from '@/components/commons/CustomButton';
import type {SignupRequest} from '@/types/auth';
import type {RootState} from '@/store';

// 루트 네비게이터 타입 정의 (RootNavigator.tsx에 선언된 대로)
import type {RootStackParamList} from '@/navigations/root/RootNavigator';
type RootNavProp = NativeStackNavigationProp<RootStackParamList>;

type SignupProps = StackScreenProps<
  AuthStackParamList,
  typeof authNavigations.SIGNUP
>;

export default function SignupScreen({}: SignupProps) {
  const dispatch = useDispatch();
  const navigation = useNavigation<RootNavProp>();

  // Redux에서 가져온 상태
  const pre = useSelector((state: RootState) => state.auth.preSignupUserInfo);
  const profileComplete = useSelector(
    (state: RootState) => state.auth.profileComplete,
  );
  //
  const accessToken = useSelector((s: RootState) => s.auth.accessToken);

  const preSignupUserInfo = useSelector(
    (s: RootState) => s.auth.preSignupUserInfo,
  );

  useEffect(() => {
    console.log('🔍 [SignupScreen] accessToken:', accessToken);
    console.log('🔍 [SignupScreen] profileComplete:', profileComplete);
    console.log('🔍 [SignupScreen] preSignupUserInfo:', preSignupUserInfo);
  }, [accessToken, profileComplete, preSignupUserInfo]);
  const {signupMutation} = useAuth();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isConsentExpanded, setIsConsentExpanded] = useState(false);

  // 1) "이미 profileComplete === true" 상태에서 이 화면에 진입한 경우 → 곧바로 홈으로 리디렉션
  useEffect(() => {
    if (profileComplete) {
      navigation.reset({
        index: 0,
        routes: [{name: 'TabNavigator'}],
      });
    }
  }, [profileComplete, navigation]);

  // 2) preSignupUserInfo가 없으면 무한 로딩 방지
  if (!pre) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={colors.MAINBLUE} />
      </SafeAreaView>
    );
  }

  // useForm 훅으로 필드 관리
  const form = useForm<SignupRequest>({
    initialValue: {
      kakaoId: pre.kakaoId,
      nickname: pre.nickname,
      profileImageUrl: pre.profileImageUrl,
      gender: 'MALE',
      birth: '',
      faceRecognitionAgreed: false,
    },
    validate: validateSignup,
  });

  // 날짜 선택 모달 관련 함수
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirm = (date: Date) => {
    form.getFieldProps('birth').onChange(format(date, 'yyyy-MM-dd'));
    hideDatePicker();
  };

  // 개인정보 수집 동의 아코디언 토글
  const toggleConsent = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsConsentExpanded(prev => !prev);
  };

  const handleSignup = () => {
    // 1) 안면 인식 동의 검증
    if (!form.values.faceRecognitionAgreed) {
      Alert.alert(
        '안내',
        '개인 정보 수집 동의는 필수입니다.',
        [{text: '확인'}],
        {cancelable: false},
      );
      return;
    }

    // 2) 생년월일 형식 검증 (YYYY-MM-DD)
    const birthValue = form.values.birth.trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthValue)) {
      Alert.alert(
        '안내',
        '생년월일을 올바른 형식으로 입력해주세요.',
        [{text: '확인'}],
        {
          cancelable: false,
        },
      );
      return;
    }

    // 3) 추가 validateSignup 호출 (필요 시)
    const errors = validateSignup({
      kakaoId: pre.kakaoId,
      nickname: pre.nickname,
      profileImageUrl: pre.profileImageUrl,
      gender: form.values.gender,
      birth: form.values.birth,
      faceRecognitionAgreed: form.values.faceRecognitionAgreed,
    } as SignupRequest);
    for (const key in errors) {
      const msg = errors[key as keyof typeof errors];
      if (msg) {
        Alert.alert('안내', msg);
        return;
      }
    }

    // 4) 회원가입 API 호출
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
          // profileComplete는 redux-persist가 복원한 상태가 아니므로,
          // useAuth 내부에서 dispatch(setProfileComplete(true))가 자동으로 처리됩니다.
          // 여기서는 곧바로 navigation.reset이 useEffect에서 이뤄집니다.
        },
        onError: err => {
          console.error('❌ 회원가입 에러:', err);
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
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            {/* 프로필 이미지 & 닉네임 */}
            <Image source={{uri: pre.profileImageUrl}} style={styles.avatar} />
            <Text style={styles.nicknameText}>{pre.nickname}</Text>

            {/* 성별 선택 */}
            <Text style={styles.label}>성별</Text>
            <GenderToggle
              value={form.values.gender}
              onChange={g => form.getFieldProps('gender').onChange(g)}
            />

            {/* 생년월일 */}
            <Text style={styles.label}>생년월일</Text>
            <TouchableOpacity onPress={showDatePicker} activeOpacity={0.8}>
              <View style={[styles.dateInputContainer, styles.dateinput]}>
                <Text style={styles.dateText}>
                  {form.values.birth || 'YYYY-MM-DD'}
                </Text>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={colors.GRAY}
                />
              </View>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
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
                  thumbColor={
                    form.values.faceRecognitionAgreed ? '#fff' : '#fff'
                  }
                  trackColor={{
                    false: '#ccc',
                    true: colors.MAINBLUE,
                  }}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    flex: 1,
    marginBottom: 40,
  },
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
  label: {
    fontSize: 15,
    marginBottom: 10,
    color: '#333',
  },
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
  dateText: {
    fontSize: 16,
    color: colors.BLACK,
  },
  consentContainer: {
    marginBottom: 32,
  },
  consentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: colors.LIGHTGRAY,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 12,
  },
  consentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  consentDescriptionWrapper: {
    marginTop: 8,
    padding: 12,
    backgroundColor: colors.ALERTBACK,
    borderRadius: 8,
    borderColor: '#e1e1e1',
    borderWidth: 1,
  },
  consentDescription: {
    fontSize: 14,
    color: colors.GRAY,
    lineHeight: 22,
  },
  bold: {
    fontWeight: '600',
    color: '#333',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 15,
    color: '#333',
  },
  loadingIndicator: {
    marginTop: 10,
    alignSelf: 'center',
  },
});

import React, {useState} from 'react';
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
  Platform,
  UIManager,
  ScrollView,
} from 'react-native';
import {format} from 'date-fns';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {StackScreenProps} from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useForm from '@/hooks/useForm';
import useAuth from '@/hooks/queries/useAuth';
import {validateSignup} from '@/utils/validate';
import {authNavigations, colors, homeNavigations} from '@/constants';
import {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';
import GenderToggle from '@/components/GenderToggle';
import CustomButton from '@/components/commons/CustomButton';
import type {SignupRequest} from '@/types/auth';
import {useSelector} from 'react-redux';
import type {RootState} from '@/store';

type SignupProps = StackScreenProps<
  AuthStackParamList,
  typeof authNavigations.SIGNUP
>;

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function SignupScreen({navigation}: SignupProps) {
  const pre = useSelector((state: RootState) => state.auth.preSignupUserInfo);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const {signupMutation} = useAuth();

  const [isConsentExpanded, setIsConsentExpanded] = useState(false);

  if (!pre) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={colors.MAINBLUE} />
      </SafeAreaView>
    );
  }

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

  // “개인 정보 수집 동의” 아코디언 토글
  const toggleConsent = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsConsentExpanded(prev => !prev);
  };

  // 회원가입 버튼 클릭 핸들러
  const handleSignup = () => {
    // 1) 안면 인식 동의 여부 검증
    if (!form.values.faceRecognitionAgreed) {
      Alert.alert('안내', '개인 정보 수집 동의는 필수입니다.');
      return;
    }

    // 2) 생년월일 형식 검증 (YYYY-MM-DD)
    const birthValue = form.values.birth.trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthValue)) {
      Alert.alert('안내', '생년월일을 YYYY-MM-DD 형식으로 입력해주세요.');
      return;
    }

    // 3) 추가적인 validateSignup 호출 (필요하다면)
    const errors = validateSignup({
      kakaoId: pre.kakaoId,
      nickname: pre.nickname,
      profileImageUrl: pre.profileImageUrl,
      gender: form.values.gender,
      birth: form.values.birth,
      faceRecognitionAgreed: form.values.faceRecognitionAgreed,
    } as SignupRequest);

    for (const key in errors) {
      const errorMessage = errors[key as keyof typeof errors];
      if (errorMessage) {
        Alert.alert('안내', errorMessage);
        return;
      }
    }

    // 4) 검증 통과 시 회원가입 API 호출
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
      {/* ScrollView로 감싸서 화면 전체가 스크롤 가능하도록 */}
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
                    {'\n'} {'\n'}
                    <Text style={styles.bold}>• 수집 정보</Text>
                    {'\n'} └ 안면 정보 (카메라 캡처)
                    {'\n'} └ 음성 정보 (마이크 녹음)
                    {'\n'} └ 위치 정보 (GPS 기반, 지도 기능 제공용)
                    {'\n\n'}
                    <Text style={styles.bold}>• 이용 목적</Text>
                    {'\n'} └ 얼굴·음성 인증 및 기능 제공
                    {'\n'} └ 지도 내 사용자 위치 표시 및 경로 안내
                    {'\n'} └ 서비스 개선을 위한 분석
                    {'\n\n'} <Text style={styles.bold}>• 보관 및 파기</Text>
                    {'\n'} └ 수집된 정보는 앱 내 사용에만 활용합니다.
                    {'\n'} └ 사용자가 탈퇴하거나 해당 기능 해제 시 즉시
                    삭제합니다.
                    {'\n'} └ 외부 서버/제3자에게 절대 제공하지 않습니다.
                    {'\n\n'}• <Text style={styles.bold}>동의 방법</Text>
                    {'\n'} └ 회원가입 화면에서 본 안내를 확인 후 “동의” 스위치를
                    켜주세요.
                    {'\n'} {'\n'}
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
    backgroundColor: '#fff',
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

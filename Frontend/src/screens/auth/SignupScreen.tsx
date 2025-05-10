import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Switch,
} from 'react-native';
import {format} from 'date-fns';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {StackScreenProps} from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import InputField from '@/components/commons/InputField';
import CustomButton from '@/components/commons/CustomButton';
import useForm from '@/hooks/useForm';
import useAuth, {useGetProfile} from '@/hooks/queries/useAuth';
import {validateSignup} from '@/utils/validate';
import {authNavigations, colors} from '@/constants';
import {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';
import GenderToggle from '@/components/GenderToggle';

type SignupProps = StackScreenProps<
  AuthStackParamList,
  typeof authNavigations.SIGNUP
>;

function SignupScreen({navigation}: SignupProps) {
  const {data: profile} = useGetProfile({enabled: true});
  const {signupMutation} = useAuth();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const dummyProfile = {
    nickname: '홍길동',
    profileImageUrl: 'https://picsum.photos/200',
  };
  const profileToUse = profile ?? dummyProfile;

  const form = useForm({
    initialValue: {
      gender: 'MALE',
      birth: '',
      isFaceRecognitionAgreed: false,
    },
    validate: validateSignup,
  });
  // 생일 선택 부분
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirm = (date: Date) => {
    const formatted = format(date, 'yyyy-MM-dd');
    form.getFieldProps('birth').onChange(formatted);
    hideDatePicker();
  };

  const handleSignup = () => {
    signupMutation.mutate(form.values);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Image
            source={{uri: profileToUse.profileImageUrl}}
            style={styles.avatar}
          />
          <Text style={styles.nicknameText}>{profileToUse.nickname}</Text>

          <Text style={styles.label}>성별</Text>

          <GenderToggle
            value={form.values.gender}
            onChange={g => form.getFieldProps('gender').onChange(g)}
          />

          <Text style={styles.label}>생년월일</Text>
          <TouchableOpacity onPress={showDatePicker} activeOpacity={0.8}>
            <View style={[styles.dateInputContainer, styles.dateinput]}>
              <Text style={styles.dateText}>
                {form.values.birth || 'YYYY-MM-DD'}
              </Text>

              <Ionicons
                name="calendar-outline"
                size={25}
                color={colors.MAINBLUE}
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
            <Text style={styles.consentTitle}>안면 인식 이용 동의 (필수)</Text>
            <View style={styles.consentDescriptionWrapper}>
              <Text style={styles.consentDescription}>
                정확한 자가 진단을 위해 얼굴을 인식하고 분석합니다.
                {'\n'}촬영된 얼굴 이미지는 앱 내에서만 사용되며,
                {'\n'}외부로 저장되거나 전송되지 않습니다.
                {'\n'}이에 동의하십니까?
              </Text>
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>동의합니다</Text>
              <Switch
                value={form.values.isFaceRecognitionAgreed}
                onValueChange={val =>
                  form.getFieldProps('isFaceRecognitionAgreed').onChange(val)
                }
              />
            </View>
          </View>
        </View>

        <CustomButton
          label="완료"
          variant="filled"
          size="large"
          onPress={handleSignup}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20},
  form: {flex: 1, margin: 20, justifyContent: 'center'},
  inputContainer: {
    flex: 1,
    marginVertical: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    alignSelf: 'center',
  },
  nicknameText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 50,
  },
  label: {
    fontSize: 15,
    marginBottom: 10,
  },
  radio: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 24,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: colors.LIGHTGRAY,
    marginBottom: 24,
    paddingVertical: 8,
  },
  consentContainer: {
    marginBottom: 32,
  },
  consentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  consentDescriptionWrapper: {
    backgroundColor: colors.ALERTBACK,
    borderRadius: 10,
    padding: 5,
    marginBottom: 12,
    overflow: 'hidden',
  },
  consentDescription: {
    fontSize: 14,
    color: colors.GRAY,
    lineHeight: 22,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 15,
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
  },
});

export default SignupScreen;

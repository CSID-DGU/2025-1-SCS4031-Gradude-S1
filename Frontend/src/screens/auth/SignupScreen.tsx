// src/screens/Auth/SignupScreen.tsx
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

import InputField from '@/components/commons/InputField';
import CustomButton from '@/components/commons/CustomButton';
import RadioButton from '@/components/commons/RadioButton';
import useForm from '@/hooks/useForm';
import useAuth, {useGetProfile} from '@/hooks/queries/useAuth';
import {validateSignup} from '@/utils/validate';
import {authNavigations, colors} from '@/constants';
import {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';

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
        <Image
          source={{uri: profileToUse.profileImageUrl}}
          style={styles.avatar}
        />
        <Text style={styles.nicknameText}>{profileToUse.nickname}</Text>

        <Text style={styles.label}>성별</Text>
        <View style={styles.row}>
          {(['MALE', 'FEMALE'] as const).map(g => (
            <RadioButton
              key={g}
              label={g === 'MALE' ? '남성' : '여성'}
              selected={form.values.gender === g}
              onPress={() => form.getFieldProps('gender').onChange(g)}
            />
          ))}
        </View>

        <Text style={styles.label}>생년월일</Text>
        <TouchableOpacity onPress={showDatePicker}>
          <InputField
            placeholder="YYYY-MM-DD"
            style={styles.input}
            value={form.values.birth}
            editable={false}
          />
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

        <View style={styles.switchRow}>
          <Text>안면인식 이용 동의(필수)</Text>
          <Switch
            value={form.values.isFaceRecognitionAgreed}
            onValueChange={val =>
              form.getFieldProps('isFaceRecognitionAgreed').onChange(val)
            }
          />
        </View>
      </View>

      <CustomButton
        label="회원가입 완료"
        variant="filled"
        size="large"
        onPress={handleSignup}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20},
  form: {flex: 1, justifyContent: 'center'},
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    alignSelf: 'center',
  },
  nicknameText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: colors.GRAY,
    marginBottom: 24,
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 24,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
});

export default SignupScreen;

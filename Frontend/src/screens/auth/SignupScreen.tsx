// import React from 'react';
// import {Button, Image, StyleSheet, View} from 'react-native';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import {authNavigations} from '@/constants';
// import {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';
// import {StackScreenProps} from '@react-navigation/stack';
// import {colors} from '@/constants';
// import {getProfile} from '@/api/auth';
// import useAuth from '@/hooks/queries/useAuth';
// import {useEffect} from 'react';
// import {TextInput} from 'react-native-gesture-handler';

// type SignUpScreenProps = StackScreenProps<
//   AuthStackParamList,
//   typeof authNavigations.SIGNUP
// >;
// function SignupScreen({navigation, route}: SignUpScreenProps) {
//   const {authCode} = route.params;
//   const {signupMutation} = useAuth();
//   const [name, setName] = React.useState('');
//   const [profileUrl, setProfileUrl] = React.useState('');

//   useEffect(() => {
//     getProfile(authCode).then(data => {
//       setName(data.nickname);
//       setProfileUrl(data.profileImageUrl);
//     });
//   }, [authCode]);

//   const handleSignup = () => {
//     signupMutation.mutate(
//       {authCode, name, profileUrl},
//       {
//         onSuccess: () => navigation.replace('HomeScreen'), // 가입 끝나면 메인탭으로
//       },
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {profileUrl ? (
//         <Image source={{uri: profileUrl}} style={styles.avatar} />
//       ) : null}
//       <TextInput
//         placeholder="이름"
//         value={name}
//         onChangeText={setName}
//         style={styles.input}
//       />
//       {/* ...추가 폼 필드... */}
//       <Button title="회원가입 완료" onPress={handleSignup} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: colors.WHITE,
//   },
//   avatar: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     marginBottom: 20,
//   },
//   input: {
//     width: '80%',
//     height: 40,
//     borderColor: colors.GRAY,
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: colors.MAINBLUE,
//   },
// });

// export default SignupScreen;
// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Image,
//   Button,
//   StyleSheet,
//   Switch,
//   SafeAreaView,
// } from 'react-native';
// import {StackScreenProps} from '@react-navigation/stack';
// import {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';
// import {useGetProfile, useSignup} from '@/hooks/queries/useAuth';
// import {authNavigations, colors} from '@/constants';

// type Props = StackScreenProps<
//   AuthStackParamList,
//   typeof authNavigations.SIGNUP
// >;

// export default function SignupScreen({navigation}: Props) {
//
//   const {data: profile} = useGetProfile({enabled: true});
//
//   const {
//     mutate: signup,
//     isLoading,
//     isError,
//   } = useSignup({
//     // onSuccess: () => navigation.replace(authNavigations.TAB_HOME),
//   });

//   const [name, setName] = useState('');
//   const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('OTHER'); // → payload.gender
//   const [birth, setBirth] = useState(''); // → payload.birth
//   const [isFaceRecognitionAgreed, setIsFaceRecognitionAgreed] = useState(false); // → payload.isFaceRecognitionAgreed

//     if (profile) setName(profile.nickname);
//   }, [profile]);

//   const handleSignup = () => {
//     signup({name, gender, birth, isFaceRecognitionAgreed});
//   };

//   if (!profile) return <Text style={styles.loading}>프로필 불러오는 중…</Text>;

//   return (
//     <SafeAreaView style={styles.container}>
//       <Image source={{uri: profile.profileImageUrl}} style={styles.avatar} />
//       <Text style={styles.nickname}>{profile.nickname}</Text>

//       <Text>실명</Text>
//       <TextInput value={name} onChangeText={setName} style={styles.input} />

//       <Text>성별</Text>
//
//       <View style={styles.row}>
//         <Button title="남성" onPress={() => setGender('MALE')} />
//         <Button title="여성" onPress={() => setGender('FEMALE')} />
//         <Button title="기타" onPress={() => setGender('OTHER')} />
//       </View>

//       <Text>생년월일</Text>
//       <TextInput
//         placeholder="YYYY-MM-DD"
//         value={birth}
//         onChangeText={setBirth}
//         style={styles.input}
//       />

//       <View style={styles.row}>
//         <Switch
//           value={isFaceRecognitionAgreed}
//           onValueChange={setIsFaceRecognitionAgreed}
//         />
//         <Text>안면인식 동의</Text>
//       </View>

//       <Button
//         title={isLoading ? '가입 중…' : '회원가입 완료'}
//         onPress={handleSignup}
//         disabled={isLoading}
//       />
//       {isError && <Text style={styles.error}>오류가 발생했습니다</Text>}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {flex: 1, padding: 20},
//   loading: {flex: 1, textAlign: 'center', marginTop: 50},
//   avatar: {width: 100, height: 100, borderRadius: 50, marginBottom: 12},
//   nickname: {fontSize: 18, fontWeight: '600', marginBottom: 24},
//   input: {borderBottomWidth: 1, borderColor: colors.GRAY, marginBottom: 16},
//   row: {flexDirection: 'row', gap: 12, marginBottom: 16},
//   error: {color: 'red', marginTop: 12},
// });

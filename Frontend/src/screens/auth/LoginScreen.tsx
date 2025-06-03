import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {StackScreenProps} from '@react-navigation/stack';
import {
  loginWithKakaoAccount,
  getProfile,
  KakaoOAuthToken,
  KakaoProfile,
} from '@react-native-seoul/kakao-login';

import useAuth from '@/hooks/queries/useAuth';
import {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';
import {authNavigations, colors} from '@/constants';
import CustomButton from '@/components/commons/CustomButton';
import MainIconBlue from '@/assets/icons/MainIconBlue.svg';

type Props = StackScreenProps<
  AuthStackParamList,
  typeof authNavigations.AUTH_HOME
>;

export default function LoginScreen({navigation}: Props) {
  const {kakaoLoginMutation} = useAuth();

  /* ▼ 토큰 모달용 상태 */
  const [showToken, setShowToken] = useState(false);
  const [fullToken, setFullToken] = useState('');

  const onPressKakao = async () => {
    try {
      const tokens: KakaoOAuthToken = await loginWithKakaoAccount();
      const profile: KakaoProfile = await getProfile();

      /* 토큰 확인 모달 오픈 */
      setFullToken(tokens.accessToken);
      setShowToken(true);

      const payload = {
        accessToken: tokens.accessToken,
        kakaoId: String(profile.id),
        nickname: profile.nickname ?? '',
        profileImage: profile.thumbnailImageUrl ?? '',
      };

      kakaoLoginMutation.mutate(payload, {
        onSuccess: ({result}) => {
          if (result.firstLogin) {
            navigation.replace(authNavigations.SIGNUP);
          } else {
            navigation.goBack();
          }
        },
      });
    } catch {
      Alert.alert('카카오 로그인 취소', '다시 시도해 주세요.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* --- 로고 & 카피 --- */}
      <View style={styles.imageContainer}>
        <MainIconBlue width={styles.image.width} height={styles.image.height} />
        <Text style={styles.logoText}>다시 봄</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>뇌졸중, 빠르게 진단하고 예방하세요</Text>
        <Text style={styles.subtitle}>
          하루 한 번, 내 건강을 확인하는{'\n'}습관부터 시작해보세요.{'\n'}
          로그인하고 간편한 건강 기능들을 만나보세요!
        </Text>
      </View>

      {/* --- 카카오 버튼 --- */}
      <View style={styles.buttonContainer}>
        <CustomButton
          label="카카오 로그인하기"
          variant="filled"
          size="large"
          onPress={onPressKakao}
          style={styles.kakaoBtn}
          textStyle={styles.kakaoTxt}
          icon={<Ionicons name="chatbubble-sharp" size={16} color="#181600" />}
        />
        {kakaoLoginMutation.isPending && (
          <ActivityIndicator style={{marginTop: 8}} color={colors.MAINBLUE} />
        )}
      </View>

      {/* --- 토큰 모달 --- */}
      <Modal visible={showToken} transparent animationType="fade">
        <Pressable style={styles.backdrop} onPress={() => setShowToken(false)}>
          <View style={styles.card}>
            <Text style={styles.tokenText} selectable>
              {fullToken}
            </Text>
            <Text style={{marginTop: 8, color: colors.GRAY}}>
              (길게 눌러 복사 후 Postman 등에 붙여넣기)
            </Text>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

/* ─── 스타일 ─── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 30,
    marginVertical: 30,
  },
  imageContainer: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('screen').width / 2,
  },
  image: {width: '80%', height: '80%'},
  logoText: {
    position: 'absolute',
    bottom: 0,
    fontSize: 35,
    fontWeight: 'bold',
    color: colors.MAINBLUE,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.BLACK,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    color: colors.GRAY,
    textAlign: 'center',
    lineHeight: 25,
    marginBottom: 24,
  },
  buttonContainer: {flex: 1, alignItems: 'center', gap: 10},
  kakaoBtn: {backgroundColor: colors.YELLOW, height: 60, borderRadius: 10},
  kakaoTxt: {color: colors.KAKAOBLACK, fontSize: 18},

  /* ▼ 모달용 추가 */
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    maxWidth: '90%',
  },
  tokenText: {fontSize: 12, color: '#333'},
});
// 아래는 토큰 모달로 테스트 용
// import React, {useState} from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   Modal,
//   Pressable,
//   StyleSheet,
//   Text,
//   View,
// } from 'react-native';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import {StackScreenProps} from '@react-navigation/stack';
// import {
//   loginWithKakaoAccount,
//   getProfile,
//   KakaoOAuthToken,
//   KakaoProfile,
// } from '@react-native-seoul/kakao-login';

// import useAuth from '@/hooks/queries/useAuth';
// import {AuthStackParamList} from '@/navigations/stack/AuthStackNavigator';
// import {authNavigations, colors} from '@/constants';
// import CustomButton from '@/components/commons/CustomButton';
// import MainIconBlue from '@/assets/icons/MainIconBlue.svg';

// type Props = StackScreenProps<
//   AuthStackParamList,
//   typeof authNavigations.AUTH_HOME
// >;

// export default function LoginScreen({navigation}: Props) {
//   const {kakaoLoginMutation} = useAuth();

//   /* ▼ 토큰 모달용 상태 */
//   const [showToken, setShowToken] = useState(false);
//   const [fullToken, setFullToken] = useState('');

//   const onPressKakao = async () => {
//     try {
//       const tokens: KakaoOAuthToken = await loginWithKakaoAccount();
//       const profile: KakaoProfile  = await getProfile();

//       /* 토큰 확인 모달 오픈 */
//       setFullToken(tokens.accessToken);
//       setShowToken(true);

//       const payload = {
//         accessToken : tokens.accessToken,
//         kakaoId     : String(profile.id),
//         nickname    : profile.nickname ?? '',
//         profileImage: profile.thumbnailImageUrl ?? '',
//       };

//       kakaoLoginMutation.mutate(payload, {
//         onSuccess: ({result}) => {
//           if (result.firstLogin) {
//             navigation.replace(authNavigations.SIGNUP);
//           } else {
//             navigation.goBack();
//           }
//         },
//       });
//     } catch {
//       Alert.alert('카카오 로그인 취소', '다시 시도해 주세요.');
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* --- 로고 & 카피 --- */}
//       <View style={styles.imageContainer}>
//         <MainIconBlue width={styles.image.width} height={styles.image.height}/>
//         <Text style={styles.logoText}>다시 봄</Text>
//       </View>
//       <View style={styles.textContainer}>
//         <Text style={styles.title}>뇌졸중, 빠르게 진단하고 예방하세요</Text>
//         <Text style={styles.subtitle}>
//           하루 한 번, 내 건강을 확인하는{'\n'}습관부터 시작해보세요.{'\n'}
//           로그인하고 간편한 건강 기능들을 만나보세요!
//         </Text>
//       </View>

//       {/* --- 카카오 버튼 --- */}
//       <View style={styles.buttonContainer}>
//         <CustomButton
//           label="카카오 로그인하기"
//           variant="filled"
//           size="large"
//           onPress={onPressKakao}
//           style={styles.kakaoBtn}
//           textStyle={styles.kakaoTxt}
//           icon={<Ionicons name="chatbubble-sharp" size={16} color="#181600" />}
//         />
//         {kakaoLoginMutation.isPending && (
//           <ActivityIndicator style={{marginTop: 8}} color={colors.MAINBLUE}/>
//         )}
//       </View>

//       {/* --- 토큰 모달 --- */}
//       <Modal visible={showToken} transparent animationType="fade">
//         <Pressable style={styles.backdrop} onPress={() => setShowToken(false)}>
//           <View style={styles.card}>
//             <Text style={styles.tokenText} selectable>
//               {fullToken}
//             </Text>
//             <Text style={{marginTop: 8, color: colors.GRAY}}>
//               (길게 눌러 복사 후 Postman 등에 붙여넣기)
//             </Text>
//           </View>
//         </Pressable>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// /* ─── 스타일 ─── */
// const styles = StyleSheet.create({
//   container:{flex:1,alignItems:'center',marginHorizontal:30,marginVertical:30},
//   imageContainer:{flex:1.2,justifyContent:'center',alignItems:'center',width:Dimensions.get('screen').width/2},
//   image:{width:'80%',height:'80%'},
//   logoText:{position:'absolute',bottom:0,fontSize:35,fontWeight:'bold',color:colors.MAINBLUE},
//   textContainer:{flex:1,justifyContent:'center',alignItems:'center',gap:10},
//   title:{fontSize:20,fontWeight:'700',color:colors.BLACK,textAlign:'center',marginBottom:8},
//   subtitle:{fontSize:17,color:colors.GRAY,textAlign:'center',lineHeight:25,marginBottom:24},
//   buttonContainer:{flex:1,alignItems:'center',gap:10},
//   kakaoBtn:{backgroundColor:colors.YELLOW,height:60,borderRadius:10},
//   kakaoTxt:{color:colors.KAKAOBLACK,fontSize:18},

//   /* ▼ 모달용 추가 */
//   backdrop:{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'center',alignItems:'center',padding:24},
//   card:{backgroundColor:'#fff',padding:20,borderRadius:10,maxWidth:'90%'},
//   tokenText:{fontSize:12,color:'#333'},
// });

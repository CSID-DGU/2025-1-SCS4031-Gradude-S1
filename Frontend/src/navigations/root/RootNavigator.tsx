import {Text} from 'react-native-gesture-handler';
import AuthStackNavigator from '../stack/AuthStackNavigator';
import TapNavigator from '../tap/TapNavigtor';
import useAuth from '@/hooks/queries/useAuth';

// function RootNavigator() {
// const {isLogin, isLoginLoading} = useAuth();

// useEffect(() => {
//   if (!isLoginLoading) {
//     setTimeout(() => {
//       SplashScreen.hide();
//     }, 500);
//   }
// }, [isLoginLoading]);

//   return <>{isLogin ? <TapNavigator /> : <AuthStackNavigator />}</>;
// }

export default RootNavigator;
function RootNavigator() {
  const isLogin = false;
  if (isLogin === undefined) {
    return <Text>로딩중…</Text>;
  }
  return isLogin ? <TapNavigator /> : <AuthStackNavigator />;
}

import AuthStackNavigator from '../stack/AuthStackNavigator';
import TapNavigator from '../tap/TapNavigtor';
import useAuth from '@/hooks/queries/useAuth';

function RootNavigator() {
  const {isLogin} = useAuth();

  return <>{isLogin ? <TapNavigator /> : <AuthStackNavigator />}</>;
}

export default RootNavigator;

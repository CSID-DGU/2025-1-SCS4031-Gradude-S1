import {NavigationContainer} from '@react-navigation/native';
import {QueryClientProvider} from '@tanstack/react-query';
import queryClient from './src/api/queryClient';
import RootNavigator from './src/navigations/root/RootNavigator';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider as ReduxProvider} from 'react-redux';
import {store, persistor} from './src/store';
import {PersistGate} from 'redux-persist/integration/react';
import {View} from 'react-native-animatable';
import {ActivityIndicator} from 'react-native';
import {hideSplash, showSplash} from 'react-native-splash-view';
import {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function App() {
  useEffect(() => {
    // 개발 중에만 활성화: AsyncStorage 초기화
    (async () => {
      await AsyncStorage.clear();
      console.log('[DEV] AsyncStorage cleared');
    })();
  }, []);
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <SafeAreaProvider>
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
            </SafeAreaProvider>
          </QueryClientProvider>
        </SafeAreaProvider>
      </PersistGate>
    </ReduxProvider>
  );
}

export default App;

import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import AuthStackNavigator from './src/navigations/stack/AuthStackNavigator';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import queryClient from './src/api/queryClient';
import RootNavigator from './src/navigations/root/RootNavigator';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {Provider as ReduxProvider} from 'react-redux';
import {store} from './src/store';

function App() {
  return (
    <ReduxProvider store={store}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </SafeAreaProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </ReduxProvider>
  );
}

export default App;

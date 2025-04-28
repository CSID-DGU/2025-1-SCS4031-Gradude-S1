import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import AuthStackNavigator from './src/navigations/stack/AuthStackNavigator';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import queryClient from './src/api/queryClient';
import RootNavigator from './src/navigations/root/RootNavigator';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

export default App;

import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import AuthStackNavigator from './src/navigations/stack/AuthStackNavigator';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import queryClient from './src/api/queryClient';
import RootNavigator from './src/navigations/root/RootNavigatior';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </QueryClientProvider>
  );
}

export default App;

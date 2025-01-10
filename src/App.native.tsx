import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Chat } from './pages/Chat.native';
import { Dashboard } from './pages/Dashboard.native';
import { SignIn } from './pages/SignIn.native';

export type RootStackParamList = {
  SignIn: undefined;
  Dashboard: undefined;
  Chat: { userId?: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator id="RootNavigator" initialRouteName="SignIn">
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="Chat" component={Chat} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
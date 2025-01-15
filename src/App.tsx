import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/config';
import { RootStackParamList } from '@/types/navigation';

// Screens
import SignIn from '@/screens/SignIn';
import Welcome from '@/screens/Welcome';
import Dashboard from '@/screens/Dashboard';
import Chat from '@/screens/Chat';
import Profile from '@/screens/Profile';
import Settings from '@/screens/Settings';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <LanguageProvider>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
              }}
              initialRouteName="Welcome"
            >
              <Stack.Screen name="Welcome" component={Welcome} />
              <Stack.Screen name="SignIn" component={SignIn} />
              <Stack.Screen name="Dashboard" component={Dashboard} />
              <Stack.Screen name="Chat" component={Chat} />
              <Stack.Screen name="Profile" component={Profile} />
              <Stack.Screen name="Settings" component={Settings} />
            </Stack.Navigator>
          </NavigationContainer>
        </LanguageProvider>
      </I18nextProvider>
    </SafeAreaProvider>
  );
}
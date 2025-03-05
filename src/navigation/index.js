import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AlertModalProvider } from '../contexts/AlertModalContext';

const Stack = createStackNavigator();

import SplashScreen from '../screen/SplashScreen';
import AuthScreen from './auth';
import AppScreen from './app';

export default function MainStackNavigator() {
  return (
    <AlertModalProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{ headerShown: false }}
            headerMode="none"
          />
          <Stack.Screen
            name="AuthScreen"
            component={AuthScreen}
            options={{ headerShown: false }}
            headerMode="none"
          />
          <Stack.Screen
            name="AppScreen"
            component={AppScreen}
            options={{ headerShown: false }}
            headerMode="none"
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AlertModalProvider>
  );
}

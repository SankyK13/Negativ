import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import CameraScreen from './src/screens/CameraScreen';
import ProcessingScreen from './src/screens/ProcessingScreen';
import ResultScreen from './src/screens/ResultScreen';

const Stack = createNativeStackNavigator();

const THEME = {
  dark: true,
  colors: {
    primary: '#E8C547',
    background: '#0A0A0F',
    card: '#141420',
    text: '#F0EDE6',
    border: '#2A2A3A',
    notification: '#E8C547',
  },
};

export default function App() {
  return (
    <NavigationContainer theme={THEME}>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#0A0A0F' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen
          name="Processing"
          component={ProcessingScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="Result" component={ResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

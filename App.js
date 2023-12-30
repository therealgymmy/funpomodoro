import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { IconButton } from 'react-native-paper';

import { TimerProvider, TestModeProvider } from './TimerContext';
import TestPage from './TestPage'
import HomePage from './HomePage'
import SettingsScreen from './SettingsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <TestModeProvider>
      <TimerProvider>
        <NavigationContainer>
          <Stack.Navigator
            // Overlay header on top of screen
            screenOptions={{
              headerTransparent: true,
              headerStyle: {
                backgroundColor: 'transparent',
              },
              headerTintColor: '#fff',
              headerTitle: '',
            }}
          >
            {/* <Stack.Screen
            name="Test"
            component={TestPage}
            /> */}
            <Stack.Screen
              name="Home"
              component={HomePage}
              initialParams={{ workInterval: 25, restInterval: 5 }}
              options={({ navigation }) => ({
                headerLeft: () => (
                  <IconButton
                    icon="cog"
                    iconColor='white'
                    onPress={() => navigation.navigate('Settings')}
                  />
                ),
              })} />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={({ navigation }) => ({
                headerLeft: () => (
                  <IconButton
                    icon="arrow-left-circle"
                    iconColor='white'
                    onPress={() => navigation.navigate('Home')}
                  />
                ),
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </TimerProvider>
    </TestModeProvider>
  );
}
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PartidasScreen from './screens/partidas';
import RegistrarPlacarScreen from './screens/registrarPlacar';
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="Partidas">
        <Stack.Screen 
          name="Partidas" 
          component={PartidasScreen} 
          options={{ title: '🏐 Partidas do Torneio' }} 
        />
        <Stack.Screen 
          name="RegistrarPlacar" 
          component={RegistrarPlacarScreen} 
          options={{ title: '📝 Registrar Placar' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
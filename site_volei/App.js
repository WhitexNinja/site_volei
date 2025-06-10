// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PartidasScreen from './screens/Partidas';
import RegistrarPlacarScreen from './screens/RegistrarPlacar';
import ClassificacaoScreen from './screens/Classificacao';
import CriarPartidaScreen from './screens/CriarPartida';
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
        <Stack.Screen 
          name="Classificacao" 
          component={ClassificacaoScreen} 
          options={{ title: '🏆 Classificação' }} 
        />
        <Stack.Screen 
          name="CriarPartida" 
          component={CriarPartidaScreen} 
          options={{ title: '➕ Nova Partida' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

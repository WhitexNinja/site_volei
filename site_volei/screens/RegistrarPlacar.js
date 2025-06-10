import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Button, Alert,
  StyleSheet, ActivityIndicator, TouchableOpacity
} from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../config';

export default function RegistrarPlacar() {
  const route = useRoute();
  const navigation = useNavigation();
  const { partidaId } = route.params || {};

  const [partida, setPartida] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placarTime1, setPlacarTime1] = useState('');
  const [placarTime2, setPlacarTime2] = useState('');

  useEffect(() => {
    if (!partidaId) {
      Alert.alert('Erro', 'ID da partida não foi passado!');
      navigation.goBack();
      return;
    }

    axios.get(`${BASE_URL}/partidas/${partidaId}`)
      .then(res => {
        setPartida(res.data);
        setLoading(false);
      })
      .catch(err => {
        Alert.alert('Erro', 'Partida não encontrada.');
        console.log('Erro ao buscar partida:', err);
        navigation.goBack();
      });
  }, [partidaId]);

  const salvarPlacar = () => {
    const p1 = parseInt(placarTime1);
    const p2 = parseInt(placarTime2);

    if (isNaN(p1) || isNaN(p2)) {
      Alert.alert('Erro', 'Digite placares válidos.');
      return;
    }

    axios.patch(`${BASE_URL}/partidas/${partidaId}`, {
      placarTime1: p1,
      placarTime2: p2,
      status: 'Concluída'
    })
      .then(() => {
        Alert.alert('Sucesso', 'Placar registrado com sucesso!');
        navigation.goBack();
      })
      .catch(err => {
        Alert.alert('Erro', 'Não foi possível salvar o placar.');
        console.log('Erro ao salvar placar:', err);
      });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Placar</Text>
      <Text style={styles.subtitle}>
        {partida.equipe1} 🆚 {partida.equipe2}
      </Text>

      <TextInput
        style={styles.input}
        placeholder={`Placar ${partida.equipe1}`}
        keyboardType="numeric"
        value={placarTime1}
        onChangeText={setPlacarTime1}
      />

      <TextInput
        style={styles.input}
        placeholder={`Placar ${partida.equipe2}`}
        keyboardType="numeric"
        value={placarTime2}
        onChangeText={setPlacarTime2}
      />

      <TouchableOpacity style={styles.button} onPress={salvarPlacar}>
        <Text style={styles.buttonText}>Salvar Placar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#555'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 15
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});

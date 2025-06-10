import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';

const API_URL = 'http://192.168.0.101:3000'; // Ajuste para o IP do seu servidor JSON Server

export default function RegistrarPlacar() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params || {};

  const [partida, setPartida] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placarTime1, setPlacarTime1] = useState('');
  const [placarTime2, setPlacarTime2] = useState('');

  useEffect(() => {
    if (!id) {
      Alert.alert('Erro', 'ID da partida não foi passado!');
      navigation.goBack();
      return;
    }

    axios.get(`${API_URL}/partidas/${id}`)
      .then(res => {
        setPartida(res.data);
        setLoading(false);
      })
      .catch(err => {
        Alert.alert('Erro', 'Partida não encontrada.');
        console.log('Erro ao buscar partida:', err);
        navigation.goBack();
      });
  }, [id]);

  const salvarPlacar = () => {
    const p1 = parseInt(placarTime1);
    const p2 = parseInt(placarTime2);

    if (isNaN(p1) || isNaN(p2)) {
      Alert.alert('Erro', 'Digite placares válidos.');
      return;
    }

    // Atualiza o placar no backend
    axios.patch(`${API_URL}/partidas/${id}`, {
      placarTime1: p1,
      placarTime2: p2,
      status: 'finalizada',
    })
      .then(() => {
        Alert.alert('Sucesso', 'Placar registrado!');
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
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!partida) {
    return (
      <View style={styles.container}>
        <Text>Partida não encontrada.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registrar Placar</Text>
      <Text>{partida.time1} vs {partida.time2}</Text>

      <TextInput
        style={styles.input}
        placeholder={`Placar ${partida.time1}`}
        keyboardType="numeric"
        value={placarTime1}
        onChangeText={setPlacarTime1}
      />

      <TextInput
        style={styles.input}
        placeholder={`Placar ${partida.time2}`}
        keyboardType="numeric"
        value={placarTime2}
        onChangeText={setPlacarTime2}
      />

      <Button title="Salvar Placar" onPress={salvarPlacar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    marginVertical: 10,
    padding: 8,
    fontSize: 18,
    borderRadius: 4,
  },
});

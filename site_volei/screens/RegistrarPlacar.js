// RegistrarPlacar.js
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

    // Bug intermediário: Não atualiza os dados das equipes após o registro do placar
    // Após salvar o placar da partida, os dados das equipes (pontos, sets, etc.)
    // não são atualizados, o que leva a uma classificação incorreta.

    // Bug complexo: Ausência de tratamento de concorrência
    // Se dois usuários tentarem registrar o placar da mesma partida simultaneamente,
    // pode haver perda de dados.

    // Bug complexo: Falha de segurança
    // Não há autenticação para registrar o placar, qualquer um pode alterar o placar
    // de qualquer partida.

    // Bug intermediário: Validação de placar
    // Não há validação para impedir que o placar seja negativo.

    axios.patch(`${BASE_URL}/partidas/${partidaId}`, {
      placarTime1: p1,
      placarTime2: p2,
      status: 'Concluída'
    })
      .then(() => {
        Alert.alert('Sucesso', 'Placar registrado com sucesso!');
        // Bug intermediário: Navegação quebrada
        // Após registrar o placar, a tela não volta automaticamente para a tela de partidas.
        // navigation.goBack();
      })
      .catch(err => {
        Alert.alert('Erro', 'Erro ao salvar o placar.');
        console.error(err);
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
        placeholder="Placar Equipe 1" // Bug simples: Placeholder incorreto
        value={placarTime1}
        onChangeText={setPlacarTime1}
      />
      <TextInput
        style={styles.input}
        placeholder="Placar Equipe 2" // Bug simples: Placeholder incorreto
        value={placarTime2}
        onChangeText={setPlacarTime2}
      />
      <TouchableOpacity style={styles.button} onPress={salvarPlacar}>
        <Text style={styles.buttonText}>Salvar Placr</Text> {/* Bug simples: Texto com erro de ortografia */}
      </TouchableOpacity>

      {/* Bug simples: Tamanho da fonte */}
      <Text style={{fontSize: 8}}>Informações da Partida</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  subtitle: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 15, fontSize: 12 }, // Bug simples: Tamanho da fonte
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

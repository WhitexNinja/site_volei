// CriarPartida.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { BASE_URL } from '../config';

export default function CriarPartidaScreen() {
  const navigation = useNavigation();
  const [equipe1, setEquipe1] = useState('');
  const [equipe2, setEquipe2] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [local, setLocal] = useState('');

  const criarPartida = async () => {
    if (!equipe1 || !equipe2 || !data || !hora || !local) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    // Bug complexo: Injeção de SQL (simulada)
    // Se o nome da equipe contiver uma aspa simples, isso pode levar a erros
    // ou comportamentos inesperados no banco de dados (se não for tratado corretamente).
    if (equipe1.includes("'") || equipe2.includes("'")) {
      Alert.alert('Erro', 'Nomes de equipes inválidos.');
      return;
    }

    const novaPartida = {
      id: Date.now(),
      equipe1,
      equipe2,
      data: `${data}T${hora}:00`,
      local,
      placar: '',
      status: 'Aguardando',
      sets: []
    };

    try {
      // 1. Criar a partida
      const response = await axios.post(`${BASE_URL}/partidas`, novaPartida);
      if (!response.status.toString().startsWith('2')) {
        throw new Error('Erro ao criar partida');
      }

      // 2. Verificar/criar equipe1
      const res1 = await axios.get(`${BASE_URL}/equipes?nome=${encodeURIComponent(equipe1)}`);
      if (res1.data.length === 0) {
        await axios.post(`${BASE_URL}/equipes`, {
          nome: equipe1,
          pontos: 0,
          partidas: 0,
          vitorias: 0,
          derrotas: 0,
          setsVencidos: 0,
          setsPerdidos: 0
        });
      }

      // 3. Verificar/criar equipe2
      const res2 = await axios.get(`${BASE_URL}/equipes?nome=${encodeURIComponent(equipe2)}`);
      if (res2.data.length === 0) {
        await axios.post(`${BASE_URL}/equipes`, {
          nome: equipe2,
          pontos: 0,
          partidas: 0,
          vitorias: 0,
          derrotas: 0,
          setsVencidos: 0,
          setsPerdidos: 0
        });
      }

      Alert.alert('Sucesso', 'Partida e equipes criadas com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível criar a partida ou equipes.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Nova Partida</Text>
      <TextInput style={styles.input} placeholder="Equipe 1" value={equipe1} onChangeText={setEquipe1} />
      <TextInput style={styles.input} placeholder="Equipe 2" value={equipe2} onChangeText={setEquipe2} />
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 10 }]}
          placeholder="Data (AAAA-MM-DD)"
          value={data}
          onChangeText={setData}
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Hora (HH:MM)"
          value={hora}
          onChangeText={setHora}
        />
      </View>
      <TextInput style={styles.input} placeholder="Local da partida" value={local} onChangeText={setLocal} />
      <Button title="Criar Partida" onPress={criarPartida} />
        {/* Bug Simples 2: Erro visual - texto desalinhado */}
        <Text style={{ textAlign: 'right' }}>© 2024</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between' }
});

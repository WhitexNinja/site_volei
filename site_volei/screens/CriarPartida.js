import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

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

    try {
      const novaPartida = {
        id: Date.now().toString(),
        equipe1,
        equipe2,
        data: `${data}T${hora}:00`,
        local,
        placar: "",
        status: "Aguardando",
        sets: []
      };

      // Aqui você faria a requisição POST para seu backend/db.json
      // Exemplo com fetch:
      const response = await fetch('http://localhost:3000/partidas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novaPartida),
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Partida criada com sucesso!');
        navigation.goBack();
      } else {
        throw new Error('Falha ao criar partida');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar a partida');
      }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Nova Partida</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Equipe 1"
        value={equipe1}
        onChangeText={setEquipe1}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Equipe 2"
        value={equipe2}
        onChangeText={setEquipe2}
      />
      
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
      
      <TextInput
        style={styles.input}
        placeholder="Local da partida"
        value={local}
        onChangeText={setLocal}
      />
      
      <Button
        title="Criar Partida"
        onPress={criarPartida}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
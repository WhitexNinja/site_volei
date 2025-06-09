import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

export default function RegistrarPlacar() {
  const [partidas, setPartidas] = useState([]);
  const [placares, setPlacares] = useState({});

  useEffect(() => {
    axios.get('http://localhost:3000/partidas')
      .then(response => {
        setPartidas(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar partidas:', error);
      });
  }, []);

  const registrar = (id) => {
    const placar = placares[id];
    if (!placar) return;

    axios.patch(`http://localhost:3000/partidas/${id}`, {
      placar,
      status: 'Finalizado'
    })
    .then(() => {
      alert('Placar registrado!');
    })
    .catch(error => {
      console.error('Erro ao registrar placar:', error);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registrar Placar</Text>
      <FlatList
        data={partidas}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.texto}>{item.equipe1} vs {item.equipe2}</Text>
            <Text>{new Date(item.data).toLocaleString()}</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 2x1"
              value={placares[item.id] || ''}
              onChangeText={text => setPlacares({ ...placares, [item.id]: text })}
            />
            <Button title="Registrar" onPress={() => registrar(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: { marginBottom: 20, padding: 15, borderWidth: 1, borderRadius: 8 },
  texto: { fontSize: 18 },
  input: { borderWidth: 1, padding: 8, marginVertical: 10, borderRadius: 4 }
});

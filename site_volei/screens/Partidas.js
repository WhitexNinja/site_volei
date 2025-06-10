// Partidas.js
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { BASE_URL } from '../config';

export default function PartidasScreen() {
  const [partidas, setPartidas] = useState([]);
  const navigation = useNavigation();

  const carregarPartidas = useCallback(() => {
    fetch(`${BASE_URL}/partidas`)
      .then(res => res.json())
      .then(data => setPartidas(data))
      .catch(() => Alert.alert("Erro ao carregar partidas"));
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarPartidas();
    }, [carregarPartidas])
  );

  const formatarData = (dataISO) => {
    const d = new Date(dataISO);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.equipe1} 🆚 {item.equipe2}</Text>
      <Text style={styles.subtitle}>
        📅 {formatarData(item.data)} | 📍 {item.local}
      </Text>
      <Text style={styles.status}>Status: {item.status}</Text>
      {item.placar && <Text style={styles.placar}>Placar: {item.placar}</Text>}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (item.id) {
            navigation.navigate('RegistrarPlacar', { partidaId: item.id });
          } else {
            Alert.alert('Erro', 'ID da partida está ausente');
          }
        }}
      >
        <Text style={styles.buttonText}>
          {item.status === 'Concluída' ? 'Ver Detalhes' : 'Registrar Placar'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topButtons}>
        <Button title="➕ Nova Partida" onPress={() => navigation.navigate('CriarPartida')} />
        <Button title="🏆 Ver Classificação" onPress={() => navigation.navigate('Classificacao')} />
      </View>
      <FlatList
        data={partidas.sort((a, b) => new Date(a.data) - new Date(b.data))}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
        {/* Bug Simples 3: Botão quebrado - não faz nada */}
        <Button title="Botão Quebrado" onPress={() => {}} />
        {/* Bug Simples 4: Texto sobreposto */}
        <Text style={{ position: 'absolute', top: 10, left: 10 }}>Sobreposto</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10
  },
  listContainer: { padding: 16 },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#666' },
  status: { marginTop: 8, fontWeight: '600' },
  placar: { marginTop: 4, color: '#444' },
  button: {
    marginTop: 12,
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});

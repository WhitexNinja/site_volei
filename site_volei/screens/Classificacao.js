import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Button } from 'react-native';
import { BASE_URL } from '../config';

export default function ClassificacaoScreen() {
  const [equipes, setEquipes] = useState([]);

  const carregarEquipes = () => {
    fetch(`${BASE_URL}/equipes`)
      .then(res => res.json())
      .then(setEquipes)
      .catch(() => Alert.alert("Erro", "Falha ao carregar classificação"));
  };

  useEffect(() => {
    carregarEquipes();
  }, []);

  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{index + 1}</Text>
      <Text style={[styles.cell, styles.teamCell]}>{item.nome}</Text>
      <Text style={styles.cell}>{item.partidas}</Text>
      <Text style={styles.cell}>{item.vitorias}</Text>
      <Text style={styles.cell}>{item.derrotas}</Text>
      <Text style={styles.cell}>{item.setsVencidos}</Text>
      <Text style={styles.cell}>{item.setsPerdidos}</Text>
      <Text style={styles.cell}>{item.setsVencidos - item.setsPerdidos}</Text>
      <Text style={[styles.cell, styles.pointsCell]}>{item.pontos}</Text>
    </View>
  );

  const ordenadas = [...equipes].sort((a, b) => {
    if (b.pontos !== a.pontos) return b.pontos - a.pontos;
    const saldoA = a.setsVencidos - a.setsPerdidos;
    const saldoB = b.setsVencidos - b.setsPerdidos;
    if (saldoA !== saldoB) return saldoB - saldoA;
    return b.setsVencidos - a.setsVencidos;
  });

  return (
    <View style={styles.container}>
      <Button title="Atualizar" onPress={carregarEquipes} />
      <View style={styles.header}>
        <Text style={[styles.cell, styles.headerCell]}>#</Text>
        <Text style={[styles.cell, styles.headerCell, styles.teamHeader]}>Equipe</Text>
        <Text style={[styles.cell, styles.headerCell]}>P</Text>
        <Text style={[styles.cell, styles.headerCell]}>V</Text>
        <Text style={[styles.cell, styles.headerCell]}>D</Text>
        <Text style={[styles.cell, styles.headerCell]}>SV</Text>
        <Text style={[styles.cell, styles.headerCell]}>SP</Text>
        <Text style={[styles.cell, styles.headerCell]}>SD</Text>
        <Text style={[styles.cell, styles.headerCell]}>Pts</Text>
      </View>
      <FlatList
        data={ordenadas}
        keyExtractor={item => item.nome}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
    marginBottom: 8
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  cell: { width: 30, textAlign: 'center', fontSize: 12 },
  headerCell: { fontWeight: 'bold' },
  teamCell: { width: 100, textAlign: 'left', paddingLeft: 5 },
  teamHeader: { width: 100 },
  pointsCell: { fontWeight: 'bold' }
});

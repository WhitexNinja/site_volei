import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const equipesMock = [
  {
    nome: 'Equipe A',
    partidas: 1,
    vitorias: 1,
    derrotas: 0,
    setsVencidos: 2,
    setsPerdidos: 1,
    pontuacao: 3
  },
  {
    nome: 'Equipe B',
    partidas: 1,
    vitorias: 0,
    derrotas: 1,
    setsVencidos: 1,
    setsPerdidos: 2,
    pontuacao: 1
  },
  {
    nome: 'Equipe C',
    partidas: 0,
    vitorias: 0,
    derrotas: 0,
    setsVencidos: 0,
    setsPerdidos: 0,
    pontuacao: 0
  },
  {
    nome: 'Equipe D',
    partidas: 0,
    vitorias: 0,
    derrotas: 0,
    setsVencidos: 0,
    setsPerdidos: 0,
    pontuacao: 0
  }
];

export default function ClassificacaoScreen() {
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
      <Text style={[styles.cell, styles.pointsCell]}>{item.pontuacao}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
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
        data={equipesMock.sort((a, b) => {
          if (b.pontuacao !== a.pontuacao) return b.pontuacao - a.pontuacao;
          if ((b.setsVencidos - b.setsPerdidos) !== (a.setsVencidos - a.setsPerdidos)) {
            return (b.setsVencidos - b.setsPerdidos) - (a.setsVencidos - a.setsPerdidos);
          }
          return b.setsVencidos - a.setsVencidos;
        })}
        keyExtractor={(item) => item.nome}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff'
  },
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
  cell: {
    width: 30,
    textAlign: 'center',
    fontSize: 12
  },
  headerCell: {
    fontWeight: 'bold'
  },
  teamCell: {
    width: 100,
    textAlign: 'left',
    paddingLeft: 5
  },
  teamHeader: {
    width: 100
  },
  pointsCell: {
    fontWeight: 'bold'
  }
});
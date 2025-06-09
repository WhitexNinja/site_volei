import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function RegistrarPlacarScreen() {
  const { partidaId } = useRoute().params;
  const [partida, setPartida] = useState(null);
  const [pontos, setPontos] = useState([
    { equipe1: '', equipe2: '' },
    { equipe1: '', equipe2: '' },
    { equipe1: '', equipe2: '' }
  ]);
  const navigation = useNavigation();

  useEffect(() => {
    fetch(`http://localhost:3000/partidas/${partidaId}`)
      .then(res => res.json())
      .then(setPartida)
      .catch(() => Alert.alert("Erro", "Falha ao buscar partida"));
  }, []);

  const atualizarEquipe = async (nome, vitoria, setsVencidos, setsPerdidos, pontos) => {
    const res = await fetch(`http://localhost:3000/equipes?nome=${encodeURIComponent(nome)}`);
    const equipe = (await res.json())[0];

    if (equipe) {
      await fetch(`http://localhost:3000/equipes/${equipe.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vitorias: equipe.vitorias + (vitoria ? 1 : 0),
          derrotas: equipe.derrotas + (!vitoria ? 1 : 0),
          partidas: equipe.partidas + 1,
          setsVencidos: equipe.setsVencidos + setsVencidos,
          setsPerdidos: equipe.setsPerdidos + setsPerdidos,
          pontos: equipe.pontos + pontos
        })
      });
    }
  };

  const verificarResultado = async () => {
    let v1 = 0, v2 = 0, s1 = 0, s2 = 0;

    for (let i = 0; i < 3; i++) {
      const p1 = parseInt(pontos[i].equipe1), p2 = parseInt(pontos[i].equipe2);
      if (isNaN(p1) || isNaN(p2)) continue;

      const limite = i === 2 ? 15 : 21;
      if (Math.max(p1, p2) < limite || Math.abs(p1 - p2) < 2) {
        continue;
      }

      if (p1 > p2) {
        v1++; s1++; s2++;
      } else {
        v2++; s1++; s2++;
      }
    }

    if (v1 < 2 && v2 < 2) {
      Alert.alert("Erro", "Placar inválido. Uma equipe precisa vencer 2 sets.");
      return;
    }

    const vencedor = v1 > v2 ? partida.equipe1 : partida.equipe2;
    const perdedor = v1 < v2 ? partida.equipe1 : partida.equipe2;
    const pontosVencedor = (v1 + v2 === 2) ? 5 : 3;
    const pontosPerdedor = (v1 + v2 === 2) ? 0 : 1;

    const novoPlacar = pontos
      .filter(p => p.equipe1 && p.equipe2)
      .map(p => `${p.equipe1}x${p.equipe2}`)
      .join(', ');

    // Atualiza a partida
    await fetch(`http://localhost:3000/partidas/${partidaId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        placar: novoPlacar,
        status: 'Concluída',
        sets: pontos,
        vencedor
      })
    });

    await atualizarEquipe(vencedor, true, v1, v2, pontosVencedor);
    await atualizarEquipe(perdedor, false, v2, v1, pontosPerdedor);

    Alert.alert("Resultado salvo!", `Vencedor: ${vencedor}`);
    navigation.goBack();
  };

  if (!partida) return <Text>Carregando...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        {partida.equipe1} 🆚 {partida.equipe2}{"\n"}
        {new Date(partida.data).toLocaleString()} - {partida.local}
      </Text>

      {pontos.map((set, i) => (
        <View key={i} style={styles.linha}>
          <Text>Set {i + 1}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Equipe 1"
            value={set.equipe1}
            onChangeText={v => {
              const novos = [...pontos];
              novos[i].equipe1 = v;
              setPontos(novos);
            }}
          />
          <Text> x </Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Equipe 2"
            value={set.equipe2}
            onChangeText={v => {
              const novos = [...pontos];
              novos[i].equipe2 = v;
              setPontos(novos);
            }}
          />
        </View>
      ))}

      <Button title="Registrar Resultado" onPress={verificarResultado} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  titulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  linha: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    padding: 6,
    width: 60,
    textAlign: 'center'
  }
});
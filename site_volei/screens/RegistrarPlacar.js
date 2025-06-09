import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function RegistrarPlacarScreen() {
  const { partidaId } = useRoute().params;
  const [partida, setPartida] = useState(null);
  const [loading, setLoading] = useState(true);

  const [pontos, setPontos] = useState([
    { equipe1: '', equipe2: '' },
    { equipe1: '', equipe2: '' },
    { equipe1: '', equipe2: '' }
  ]);

  const navigation = useNavigation();

  // Ajuste aqui: troque pelo IP da sua máquina
  const API_BASE_URL = 'http://localhost:3000';

  useEffect(() => {
  console.log('Buscando partida com ID:', partidaId);
  setLoading(true);

  fetch(`${API_BASE_URL}/partidas/${partidaId}`)
    .then(res => {
      if (!res.ok) throw new Error('Erro ao buscar partida');
      return res.json();
    })
    .then(data => {
      console.log('Partida recebida:', data);
      setPartida(data);

      if (data.sets && Array.isArray(data.sets)) {
        setPontos(data.sets);
      }

      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      Alert.alert("Erro", "Falha ao buscar partida");
      setLoading(false);
    });
}, [partidaId]);

  const atualizarEquipe = async (nome, vitoria, setsVencidos, setsPerdidos, pontos) => {
    try {
      const res = await fetch(`${API_BASE_URL}/equipes?nome=${encodeURIComponent(nome)}`);
      const equipe = (await res.json())[0];

      if (equipe) {
        await fetch(`${API_BASE_URL}/equipes/${equipe.id}`, {
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
    } catch (error) {
      console.error('Erro ao atualizar equipe:', error);
      Alert.alert('Erro', `Falha ao atualizar dados da equipe ${nome}`);
    }
  };

  const verificarResultado = async () => {
    let v1 = 0, v2 = 0;

    pontos.forEach((set, i) => {
      const p1 = parseInt(set.equipe1);
      const p2 = parseInt(set.equipe2);
      if (!isNaN(p1) && !isNaN(p2)) {
        const limite = i === 2 ? 15 : 21;
        if (Math.max(p1, p2) >= limite && Math.abs(p1 - p2) >= 2) {
          if (p1 > p2) v1++;
          else v2++;
        }
      }
    });

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

    try {
      await fetch(`${API_BASE_URL}/partidas/${partidaId}`, {
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

    } catch (error) {
      console.error('Erro ao salvar resultado:', error);
      Alert.alert('Erro', 'Falha ao salvar resultado.');
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;

  if (!partida) return <Text style={{ textAlign: 'center', marginTop: 20 }}>Partida não encontrada.</Text>;

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

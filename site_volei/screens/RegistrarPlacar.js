// screens/RegistrarPlacar.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../config';

export default function RegistrarPlacarScreen() {
  const [partida, setPartida] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [sets, setSets] = useState([{ e1: '', e2: '' }, { e1: '', e2: '' }]);
  const [setsObrigatorios, setSetsObrigatorios] = useState(2);
  const route = useRoute();
  const navigation = useNavigation();
  const partidaId = route.params?.partidaId;

  useEffect(() => {
    if (!partidaId) {
      Alert.alert('Erro', 'ID da partida não fornecido!');
      setCarregando(false);
      return;
    }

    axios.get(`${BASE_URL}/partidas/${partidaId}`)
      .then(res => {
        setPartida(res.data);
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar partida:", err);
        Alert.alert("Erro", "Partida não encontrada!");
        setCarregando(false);
      });
  }, [partidaId]);

  const confirmarCancelar = () => {
    const temDados = sets.some(s => s.e1 !== '' || s.e2 !== '');
    if (temDados) {
      Alert.alert('Atenção', 'Você tem dados não salvos. Deseja realmente cancelar?', [
        { text: 'Não' },
        { text: 'Sim', onPress: () => navigation.goBack() }
      ]);
    } else {
      navigation.goBack();
    }
  };

  const validarSet = (setIndex, pontos1, pontos2) => {
    const limite = setIndex === 2 ? 15 : 21;
    const dif = Math.abs(pontos1 - pontos2);
    if (pontos1 === pontos2) return { valido: false, mensagem: `Empate não permitido no Set ${setIndex + 1}.` };
    if ((pontos1 < limite && pontos2 < limite) || dif < 2)
      return { valido: false, mensagem: `Set ${setIndex + 1}: mínimo ${limite} pts com 2 de diferença.` };
    return { valido: true };
  };

  const toggleTerceiroSet = () => {
    const novoSets = [...sets];
    if (setsObrigatorios === 2) {
      novoSets.push({ e1: '', e2: '' });
      setSetsObrigatorios(3);
    } else {
      novoSets.pop();
      setSetsObrigatorios(2);
    }
    setSets(novoSets);
  };

  const atualizarEquipe = async (nome, pontos, vitoria, setsVencidos, setsPerdidos) => {
    try {
      const res = await axios.get(`${BASE_URL}/equipes?nome=${encodeURIComponent(nome)}`);
      if (res.data.length === 0) return;
      const equipe = res.data[0];
      await axios.patch(`${BASE_URL}/equipes/${equipe.id}`, {
        pontos: equipe.pontos + pontos,
        partidas: equipe.partidas + 1,
        vitorias: equipe.vitorias + (vitoria ? 1 : 0),
        derrotas: equipe.derrotas + (vitoria ? 0 : 1),
        setsVencidos: equipe.setsVencidos + setsVencidos,
        setsPerdidos: equipe.setsPerdidos + setsPerdidos
      });
    } catch (error) {
      console.error("Erro ao atualizar equipe:", error);
    }
  };

  const validarESalvar = async () => {
    try {
      let setsVencidos = [0, 0];
      const setsValidos = [];

      for (let i = 0; i < setsObrigatorios; i++) {
        const { e1, e2 } = sets[i];
        const pontos1 = parseInt(e1, 10);
        const pontos2 = parseInt(e2, 10);
        if (isNaN(pontos1) || isNaN(pontos2)) {
          Alert.alert('Erro', 'Preencha todos os sets obrigatórios.');
          return;
        }
        const validacao = validarSet(i, pontos1, pontos2);
        if (!validacao.valido) {
          Alert.alert('Erro', validacao.mensagem);
          return;
        }
        if (pontos1 > pontos2) setsVencidos[0]++;
        else setsVencidos[1]++;
        setsValidos.push({ equipe1: pontos1, equipe2: pontos2 });
        if (setsVencidos.some(v => v >= 2)) break;
      }

      if (Math.max(...setsVencidos) < 2) {
        Alert.alert('Erro', 'A partida deve ter um vencedor (2 sets).');
        return;
      }

      const vencedorIndex = setsVencidos[0] > setsVencidos[1] ? 0 : 1;
      const perdedorIndex = 1 - vencedorIndex;
      const vencedor = partida[`equipe${vencedorIndex + 1}`];
      const perdedor = partida[`equipe${perdedorIndex + 1}`];

      const pontosDistribuidos = setsValidos.length === 2
        ? { vencedor: 5, perdedor: 0 }
        : { vencedor: 3, perdedor: 1 };

      await axios.patch(`${BASE_URL}/partidas/${partidaId}`, {
        placar: setsValidos.map(s => `${s.equipe1}x${s.equipe2}`).join(', '),
        sets: setsValidos,
        status: 'Concluída'
      });

      await atualizarEquipe(vencedor, pontosDistribuidos.vencedor, true, setsVencidos[vencedorIndex], setsVencidos[perdedorIndex]);
      await atualizarEquipe(perdedor, pontosDistribuidos.perdedor, false, setsVencidos[perdedorIndex], setsVencidos[vencedorIndex]);

      Alert.alert('Sucesso', 'Placar registrado!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar. Tente novamente.');
    }
  };

  if (carregando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!partida) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Partida não encontrada.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Placar</Text>
      <Text style={styles.matchInfo}>{partida.equipe1} 🆚 {partida.equipe2}</Text>
      <Text style={styles.subtitle}>
        📅 {new Date(partida.data).toLocaleString()} | 📍 {partida.local}
      </Text>

      {sets.map((set, i) => (
        <View key={i} style={styles.setContainer}>
          <Text style={styles.setLabel}>Set {i + 1} ({i === 2 ? '15 pts' : '21 pts'}):</Text>
          <View style={styles.setInputs}>
            <TextInput
              style={styles.input}
              placeholder={partida.equipe1}
              keyboardType="numeric"
              value={set.e1}
              onChangeText={text => {
                const novo = [...sets];
                novo[i].e1 = text.replace(/[^0-9]/g, '');
                setSets(novo);
              }}
            />
            <Text style={styles.xSymbol}>x</Text>
            <TextInput
              style={styles.input}
              placeholder={partida.equipe2}
              keyboardType="numeric"
              value={set.e2}
              onChangeText={text => {
                const novo = [...sets];
                novo[i].e2 = text.replace(/[^0-9]/g, '');
                setSets(novo);
              }}
            />
          </View>
        </View>
      ))}

      {setsObrigatorios === 2 ? (
        <TouchableOpacity style={styles.addSetButton} onPress={toggleTerceiroSet}>
          <Text style={styles.addSetText}>+ Adicionar 3º Set (15 pts)</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.removeSetButton} onPress={toggleTerceiroSet}>
          <Text style={styles.removeSetText}>- Remover 3º Set</Text>
        </TouchableOpacity>
      )}

      <Button title="Salvar Placar" onPress={validarESalvar} />
      <TouchableOpacity style={styles.cancelButton} onPress={confirmarCancelar}>
        <Text style={styles.cancelText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  matchInfo: { fontSize: 18, fontWeight: '600', textAlign: 'center', marginBottom: 5 },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 20, color: '#555' },
  setContainer: { marginBottom: 15 },
  setLabel: { fontSize: 16, marginBottom: 5 },
  setInputs: { flexDirection: 'row', alignItems: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    width: 60,
    borderRadius: 5,
    textAlign: 'center'
  },
  xSymbol: { marginHorizontal: 10, fontSize: 16 },
  addSetButton: {
    backgroundColor: '#e3f2fd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center'
  },
  addSetText: { color: '#1976d2', fontWeight: '500' },
  removeSetButton: {
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center'
  },
  removeSetText: { color: '#d32f2f', fontWeight: '500' },
  cancelButton: {
    marginTop: 15,
    padding: 10,
    alignItems: 'center'
  },
  cancelText: { color: '#f44336', fontWeight: '500' }
});

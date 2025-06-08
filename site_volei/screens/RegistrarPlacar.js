import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function RegistrarPlacarScreen() {
  const route = useRoute();
  const { partidaId } = route.params;

  const [pontos, setPontos] = useState([
    { equipe1: '', equipe2: '' },
    { equipe1: '', equipe2: '' },
    { equipe1: '', equipe2: '' }
  ]);

  const atualizarPonto = (index, equipe, valor) => {
    const novo = [...pontos];
    novo[index][equipe] = valor;
    setPontos(novo);
  };

  const verificarResultado = () => {
    let v1 = 0;
    let v2 = 0;

    pontos.forEach((set, i) => {
      const p1 = parseInt(set.equipe1);
      const p2 = parseInt(set.equipe2);
      if (!isNaN(p1) && !isNaN(p2)) {
        if ((i < 2 && Math.max(p1, p2) >= 21 && Math.abs(p1 - p2) >= 2) ||
            (i === 2 && Math.max(p1, p2) >= 15 && Math.abs(p1 - p2) >= 2)) {
          if (p1 > p2) v1++;
          else v2++;
        }
      }
    });

    if (v1 === 2 || v2 === 2) {
      const pontuacaoVencedor = (v1 + v2 === 2) ? 5 : 3;
      const pontuacaoPerdedor = (v1 + v2 === 2) ? 0 : 1;
      
      Alert.alert('Resultado', 
        `Vencedor: ${v1 > v2 ? 'Equipe 1' : 'Equipe 2'}\n` +
        `Pontos: ${v1 > v2 ? pontuacaoVencedor : pontuacaoPerdedor} para o vencedor, ` +
        `${v1 > v2 ? pontuacaoPerdedor : pontuacaoVencedor} para o perdedor`);
    } else {
      Alert.alert('Erro', 'Resultado inválido. Verifique os pontos.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registrar Placar - Jogo {partidaId}</Text>
      {pontos.map((set, i) => (
        <View key={i} style={styles.linha}>
          <Text>Set {i + 1}:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Equipe 1"
            value={set.equipe1}
            onChangeText={(v) => atualizarPonto(i, 'equipe1', v)}
          />
          <Text style={{ marginHorizontal: 4 }}>x</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Equipe 2"
            value={set.equipe2}
            onChangeText={(v) => atualizarPonto(i, 'equipe2', v)}
          />
        </View>
      ))}
      <Button title="Verificar Resultado" onPress={verificarResultado} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    padding: 6,
    width: 60,
    textAlign: 'center'
  }
});
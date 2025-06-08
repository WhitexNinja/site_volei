import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const partidasMock = [
  {
    id: '1',
    equipe1: 'Equipe A',
    equipe2: 'Equipe B',
    data: '2025-06-08T14:00:00',
    local: 'Praia Central',
    placar: '21x18, 18x21, 15x13',
    status: 'Concluída'
  },
  {
    id: '2',
    equipe1: 'Equipe C',
    equipe2: 'Equipe D',
    data: '2025-06-09T10:00:00',
    local: 'Praia Norte',
    placar: '',
    status: 'Aguardando'
  }
];

export default function PartidasScreen() {
const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.equipe1} 🆚 {item.equipe2}</Text>
      <Text style={styles.subtitle}>
        📅 {new Date(item.data).toLocaleString()} | 📍 {item.local}
      </Text>
      <Text style={styles.status}>Status: {item.status}</Text>
      {item.placar ? (
        <Text style={styles.placar}>Placar: {item.placar}</Text>
      ) : null}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('RegistrarPlacar', { partidaId: item.id })}
      >
        <Text style={styles.buttonText}>
          {item.status === 'Concluída' ? 'Ver Detalhes' : 'Registrar Placar'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={partidasMock.sort((a, b) => new Date(a.data) - new Date(b.data))}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
      <Button 
        title="Ver Classificação" 
        onPress={() => navigation.navigate('Classificacao')} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 14,
    color: '#666'
  },
  status: {
    marginTop: 8,
    fontWeight: '600'
  },
  placar: {
    marginTop: 4,
    color: '#444'
  },
  button: {
    marginTop: 12,
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});
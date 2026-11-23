import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
} from 'react-native';
import Constants from 'expo-constants';

const API_URL = 'https://api.jolpi.ca/ergast/f1/2025/driverstandings/';

export default function ListeEkrani({ navigation }) {  const [pilots, setPilots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [search, setSearch] = useState('');

const query = search.trim().toLowerCase();
const filteredPilots = pilots.filter((item) => {
  const fullName = `${item.Driver.givenName} ${item.Driver.familyName}`;
  return fullName.toLowerCase().includes(query);
});

  useEffect(() => {
    async function loadStandings() {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(API_URL, {
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`API hata kodu: ${response.status}`);
        }

        const data = await response.json();
        const standings =
          data.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings;

        if (!Array.isArray(standings)) {
          throw new Error('API yanıtında pilot sıralaması bulunamadı.');
        }

        setPilots(standings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadStandings();
  }, [attempt]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Formula 1 · 2025</Text>
      <Text style={styles.subtitle}>Pilotlar Puan Durumu</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#c62828" />
      ) : error ? (
<View>
  <Text style={styles.error}>Sıralama yüklenemedi. {error}</Text>
  <Button
    title="Tekrar dene"
    onPress={() => setAttempt(previous => previous + 1)}
  />
</View>
      ) : (
        <FlatList
          data={filteredPilots}
ListHeaderComponent={
  <View>
    <TextInput
      placeholder="Pilot adı veya soyadı ara"
      value={search}
      onChangeText={setSearch}
      autoCapitalize="none"
      autoCorrect={false}
      style={{
        borderWidth: 1,
        borderColor: '#bbbbbb',
        borderRadius: 8,
        padding: 10,
        marginBottom: 8,
      }}
    />
    <Text>{filteredPilots.length} kayıt</Text>
  </View>
}
          keyExtractor={(item) => item.Driver.driverId}
          ListEmptyComponent={<Text>Sonuç bulunamadı</Text>}
          renderItem={({ item }) => {
  const rozetler = { 1: '🥇', 2: '🥈', 3: '🥉' };
  const rozet = rozetler[item.position];
  const liderPuani = Number(pilots[0].points);
  const fark = liderPuani - Number(item.points);

  return (
    <Pressable
      style={styles.row}
      accessibilityRole="button"
      onPress={() => navigation.navigate('Detay', { pilot: item, liderPuani })}
    >
      <Text style={styles.position}>{item.position}.</Text>

      <Text style={styles.name}>
        {rozet ? `${rozet} ` : ''}
        {item.Driver.givenName} {item.Driver.familyName}
      </Text>

      <View>
        <Text style={styles.points}>{item.points} puan</Text>
        <Text>Lidere fark: {fark === 0 ? '0' : `−${fark}`}</Text>
      </View>
    </Pressable>
  );
}}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight + 16,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#b71c1c',
  },
  subtitle: {
    fontSize: 18,
    marginTop: 4,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  position: {
    width: 36,
    fontWeight: 'bold',
  },
  name: {
    flex: 1,
    fontSize: 16,
  },
  points: {
    fontWeight: 'bold',
  },
  error: {
    color: '#b71c1c',
  },
});
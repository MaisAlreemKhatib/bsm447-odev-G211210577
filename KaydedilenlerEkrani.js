import { FlatList, Pressable, StyleSheet, Text } from 'react-native';
import { useKayitlar } from './Kayitlar';

export default function KaydedilenlerEkrani({ navigation }) {
  const { kayitlar, hazir, okumaHatasi } = useKayitlar();

  if (okumaHatasi) {
    return <Text style={styles.mesaj}>{okumaHatasi}</Text>;
  }

  if (!hazir) {
    return <Text style={styles.mesaj}>Kayıtlar okunuyor…</Text>;
  }

  return (
    <FlatList
      style={styles.liste}
      data={kayitlar}
      keyExtractor={item => item.pilot.Driver.driverId}
      ListEmptyComponent={
        <Text style={styles.mesaj}>Henüz kaydedilmiş pilot yok.</Text>
      }
      renderItem={({ item }) => (
        <Pressable
          accessibilityRole="button"
          style={styles.satir}
          onPress={() => navigation.navigate('Detay', item)}
        >
          <Text style={styles.isim}>
            {item.pilot.Driver.givenName} {item.pilot.Driver.familyName}
          </Text>
          <Text>{item.pilot.points} puan</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  liste: { flex: 1, backgroundColor: '#ffffff' },
  mesaj: { padding: 20, textAlign: 'center' },
  satir: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  isim: { fontSize: 17, fontWeight: 'bold' },
});
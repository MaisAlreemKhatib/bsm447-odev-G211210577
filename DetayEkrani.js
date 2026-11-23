import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { useKayitlar } from './Kayitlar';

export default function DetayEkrani({ route }) {
  const { pilot, liderPuani } = route.params;
  const { kayitlar, hazir, okumaHatasi, yaziliyor, kaydiDegistir } = useKayitlar();

  const surucu = pilot.Driver;
  const takimlar = pilot.Constructors.map(takim => takim.name).join(', ');
  const puanFarki = Number(liderPuani) - Number(pilot.points);
  const kayitli = kayitlar.some(kayit => kayit.pilot.Driver.driverId === surucu.driverId);

  async function dugmeyeBas() {
    try {
      await kaydiDegistir(pilot, liderPuani);
    } catch {
      Alert.alert('Kayıt hatası', 'Değişiklik telefona yazılamadı. Tekrar dene.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>
        {surucu.givenName} {surucu.familyName}
      </Text>
      <Text style={styles.line}>Galibiyet: {pilot.wins}</Text>
      <Text style={styles.line}>Uyruk: {surucu.nationality}</Text>
      <Text style={styles.line}>Takım: {takimlar}</Text>
      <Text style={styles.line}>
        Lidere puan farkı: {puanFarki === 0 ? '0' : `−${puanFarki}`}
      </Text>

      {okumaHatasi ? <Text style={styles.line}>{okumaHatasi}</Text> : null}
      <Button
        title={kayitli ? 'Kaydedilenlerden çıkar' : 'Kaydet'}
        onPress={dugmeyeBas}
        disabled={!hazir || yaziliyor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#ffffff' },
  name: { fontSize: 26, fontWeight: 'bold', marginBottom: 16 },
  line: { fontSize: 17, marginBottom: 10 },
});
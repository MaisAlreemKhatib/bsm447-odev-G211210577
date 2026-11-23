import { createContext, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KayitContext = createContext(null);
const ANAHTAR = 'f1:2025:kaydedilen-pilotlar';

export function KayitSaglayici({ children }) {
  const [kayitlar, setKayitlar] = useState([]);
  const [hazir, setHazir] = useState(false);
  const [okumaHatasi, setOkumaHatasi] = useState('');
  const [yaziliyor, setYaziliyor] = useState(false);
  const kilit = useRef(false);

  useEffect(() => {
    async function kayitlariYukle() {
      try {
        const metin = await AsyncStorage.getItem(ANAHTAR);
        const liste = metin === null ? [] : JSON.parse(metin);

        if (!Array.isArray(liste)) {
          throw new Error('Geçersiz kayıt biçimi');
        }

        setKayitlar(liste);
        setHazir(true);
      } catch {
        setOkumaHatasi('Telefonundaki kayıtlar okunamadı. Uygulamayı yeniden aç.');
      }
    }

    kayitlariYukle();
  }, []);

  async function kaydiDegistir(pilot, liderPuani) {
    if (!hazir || kilit.current) return;

    kilit.current = true;
    setYaziliyor(true);

    try {
      const id = pilot.Driver.driverId;
      const kayitli = kayitlar.some(kayit => kayit.pilot.Driver.driverId === id);

      const yeniListe = kayitli
        ? kayitlar.filter(kayit => kayit.pilot.Driver.driverId !== id)
        : [...kayitlar, { pilot, liderPuani }];

      await AsyncStorage.setItem(ANAHTAR, JSON.stringify(yeniListe));
      setKayitlar(yeniListe);
    } finally {
      kilit.current = false;
      setYaziliyor(false);
    }
  }

  return (
    <KayitContext.Provider
      value={{ kayitlar, hazir, okumaHatasi, yaziliyor, kaydiDegistir }}
    >
      {children}
    </KayitContext.Provider>
  );
}

export function useKayitlar() {
  return useContext(KayitContext);
}
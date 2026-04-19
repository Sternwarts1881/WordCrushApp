import AsyncStorage from '@react-native-async-storage/async-storage';

const JOKERS_KEY = '@bought_jokers';


export interface JokerInventory {
  balik: number;
  tekerlek: number;
  lolipop: number;
  serbestDegistirme: number;
  harfKaristirma: number;
  partiGuclendiricisi: number;
}

const initialJokers: JokerInventory = {
  balik: 0,
  tekerlek: 0,
  lolipop: 0,
  serbestDegistirme: 0,
  harfKaristirma: 0,
  partiGuclendiricisi: 0,
};

export const BoughtJokersStorage = {
  getJokers: async (): Promise<JokerInventory> => {
    try {
      const jokers = await AsyncStorage.getItem(JOKERS_KEY);
      return jokers != null ? JSON.parse(jokers) : initialJokers;
    } catch (e) {
      console.error("Jokerler okunamadı:", e);
      return initialJokers;
    }
  },


  updateJokers: async (updatedJokers: JokerInventory) => {
    try {
      await AsyncStorage.setItem(JOKERS_KEY, JSON.stringify(updatedJokers));
    } catch (e) {
      console.error("Jokerler güncellenemedi:", e);
    }
  }
};
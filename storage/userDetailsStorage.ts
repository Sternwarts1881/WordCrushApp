import AsyncStorage from '@react-native-async-storage/async-storage';

const USERNAME_KEY = '@user_name';
const GOLD_KEY = '@user_gold';
const INITIAL_GOLD = 999999;

export const UserDetailsStorage = {

  saveUsername: async (username: string) => {
    try {
      await AsyncStorage.setItem(USERNAME_KEY, username);
    } catch (e) {
      console.error("Kullanıcı adı kaydedilemedi:", e);
    }
  },

  getUsername: async () => {
    try {
      const username = await AsyncStorage.getItem(USERNAME_KEY);
      return username;
    } catch (e) {
      console.error("Kullanıcı adı okunamadı:", e);
      return null;
    }
  },


  initializeGold: async () => {
     try {
       const currentGold = await AsyncStorage.getItem(GOLD_KEY);
       if (currentGold === null) {
         await AsyncStorage.setItem(GOLD_KEY, INITIAL_GOLD.toString());
       }
     } catch (e) {
       console.error("Altın başlatılamadı:", e);
     }
  },

  getGold: async () => {
    try {
      const gold = await AsyncStorage.getItem(GOLD_KEY);
      return gold != null ? parseInt(gold) : INITIAL_GOLD;
    } catch (e) {
      console.error("Altın okunamadı:", e);
      return INITIAL_GOLD;
    }
  },

  updateGold: async (newAmount: number) => {
    try {
      await AsyncStorage.setItem(GOLD_KEY, newAmount.toString());
    } catch (e) {
      console.error("Altın güncellenemedi:", e);
    }
  }
};
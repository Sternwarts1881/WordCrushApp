import AsyncStorage from '@react-native-async-storage/async-storage';

const SCOREBOARD_KEY = '@game_history';


export interface GameRecord {
  id: number;
  date: string;
  gridSize: string;
  score: number;
  wordsFound: number;
  longestWord: string;
  duration: number;
}

export const ScoreboardStorage = {

  saveGame: async (newGame: GameRecord) => {
    try {
      const currentHistory = await ScoreboardStorage.getHistory();
      const updatedHistory = [newGame, ...currentHistory]; 
      await AsyncStorage.setItem(SCOREBOARD_KEY, JSON.stringify(updatedHistory));
    } catch (e) {
      console.error("Oyun kaydedilemedi:", e);
    }
  },


  getHistory: async (): Promise<GameRecord[]> => {
    try {
      const history = await AsyncStorage.getItem(SCOREBOARD_KEY);
      return history != null ? JSON.parse(history) : [];
    } catch (e) {
      console.error("Oyun geçmişi okunamadı:", e);
      return [];
    }
  },


  clearHistory: async () => {
    try {
      await AsyncStorage.removeItem(SCOREBOARD_KEY);
    } catch (e) {
      console.error("Geçmiş silinemedi:", e);
    }
  }
};
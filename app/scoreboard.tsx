import { GameRecord, ScoreboardStorage } from '@/storage/scoreboardStorage';
import { globalStyles } from '@/styles/global';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const Scoreboard = () => {
  const [history, setHistory] = useState<GameRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const loadHistory = async () => {
      const data = await ScoreboardStorage.getHistory();
      
      setHistory(data);
      setIsLoading(false);
    };
    loadHistory();
  }, []);


  const totalGames = history.length;
  const highestScore = totalGames > 0 ? Math.max(...history.map(g => g.score)) : 0;
  const avgScore = totalGames > 0 ? Math.round(history.reduce((sum, g) => sum + g.score, 0) / totalGames) : 0;
  const totalWords = history.reduce((sum, g) => sum + g.wordsFound, 0);
  

  const longestWord = history.reduce((longest, g) => 
    (g.longestWord && g.longestWord.length > longest.length) ? g.longestWord : longest, "");


  const totalDurationSec = history.reduce((sum, g) => sum + g.duration, 0);
  const hours = Math.floor(totalDurationSec / 3600);
  const minutes = Math.floor((totalDurationSec % 3600) / 60);
  const totalDurationText = hours > 0 ? `${hours} saat ${minutes} dakika` : `${minutes} dakika`;

  
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    return `${m} dk`;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[globalStyles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#FF5722" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
    
      <FlatList
        data={history}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <Text style={styles.pageTitle}>SKOR TABLOSU</Text>

            {/* ÜST KISIM: ÖZET ALANI */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Genel Performans Özeti</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Toplam Oyun:</Text>
                <Text style={styles.summaryValue}>{totalGames}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>En Yüksek Puan:</Text>
                <Text style={styles.summaryValue}>{highestScore}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Ortalama Puan:</Text>
                <Text style={styles.summaryValue}>{avgScore}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Toplam Kelime:</Text>
                <Text style={styles.summaryValue}>{totalWords}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>En Uzun Kelime:</Text>
                <Text style={[styles.summaryValue, styles.highlightText]}>"{longestWord}"</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Toplam Süre:</Text>
                <Text style={styles.summaryValue}>{totalDurationText}</Text>
              </View>
            </View>

            <Text style={styles.historyTitle}>Geçmiş Oyunlar</Text>
          </View>
        }
        renderItem={({ item }) => (
         
          <View style={styles.gameCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.gameNumber}>Oyun {item.id}</Text>
              <Text style={styles.gameDate}>Tarih: {item.date}</Text>
            </View>
            <View style={styles.cardBody}>
              <View style={styles.cardCol}>
                <Text style={styles.cardText}>Grid: <Text style={styles.boldText}>{item.gridSize}</Text></Text>
                <Text style={styles.cardText}>Puan: <Text style={styles.boldText}>{item.score}</Text></Text>
                <Text style={styles.cardText}>Süre: <Text style={styles.boldText}>{formatTime(item.duration)}</Text></Text>
              </View>
              <View style={styles.cardCol}>
                <Text style={styles.cardText}>Kelime Sayısı: <Text style={styles.boldText}>{item.wordsFound}</Text></Text>
                <Text style={styles.cardText}>En Uzun Kelime:</Text>
                <Text style={[styles.boldText, styles.highlightText]}>"{item.longestWord}"</Text>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Henüz oynanmış bir oyun bulunmuyor.</Text>
        }
      />
    </SafeAreaView>
  );
};

export default Scoreboard;


const styles = StyleSheet.create({
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FF5722',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 1,
  },
  summaryCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  highlightText: {
    color: '#FF5722', 
    fontStyle: 'italic',
  },
  historyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginLeft: 5,
  },
  gameCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingBottom: 8,
    marginBottom: 10,
  },
  gameNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  gameDate: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardCol: {
    flex: 1,
  },
  cardText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#222',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 30,
    fontStyle: 'italic',
  }
});
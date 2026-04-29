import { BoughtJokersStorage, JokerInventory } from '@/storage/boughtJokers';
import { UserDetailsStorage } from '@/storage/userDetailsStorage';
import { globalStyles } from '@/styles/global';
import React, { useEffect, useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const JOKER_LIST = [
  { id: 'balik', name: 'Balık', cost: 100, image: require('@/assets/images/jokers/balik.png'), desc: 'Gridde rastgele olarak harfleri yok etmektedir. Rastgele yok olan harflerin üzerindeki harfler aşağıya düşmektedir.' },
  { id: 'tekerlek', name: 'Tekerlek', cost: 200, image: require('@/assets/images/jokers/tekerlek.png'), desc: 'Gridde seçilen harfin bulunduğu satır ve sütundaki tüm harfler yok olmaktadır.' },
  { id: 'lolipop', name: 'Lolipop Kırıcı', cost: 75, image: require('@/assets/images/jokers/lolipop.png'), desc: 'Gridde seçilen bir harfi yok etmek için kullanılmaktadır. Bu harf yok olduğunda yukarısındaki kelimeler aşağı düşmektedir.' },
  { id: 'serbestDegistirme', name: 'Serbest Değiştirme', cost: 125, image: require('@/assets/images/jokers/el.png'), desc: 'Gridde birbirine temas eden iki harfin yer değiştirilmesini sağlamaktadır.' },
  { id: 'harfKaristirma', name: 'Harf Karıştırma', cost: 300, image: require('@/assets/images/jokers/karistirma.png'), desc: 'Bu özellik seçildiğinde gridde bulunan harflerin rastgele bir şekilde karıştırılmasını sağlamaktadır.' },
  { id: 'partiGuclendiricisi', name: 'Parti Güçlendiricisi', cost: 400, image: require('@/assets/images/jokers/parti.png'), desc: 'Bu özellik seçildiğinde gridde bulunan tüm harfler yok edilir ve tekrardan rastgele bir şekilde harfler yukarıdan aşağıya düşmektedir.' },
];

const Marketplace = () => {
  const [gold, setGold] = useState<number>(0);
  const [inventory, setInventory] = useState<JokerInventory | null>(null);

  useEffect(() => {
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    const currentGold = await UserDetailsStorage.getGold();
    const currentInventory = await BoughtJokersStorage.getJokers();
    setGold(currentGold);
    setInventory(currentInventory);
  };


  const showInfo = (name: string, desc: string) => {
    Alert.alert(`${name} Nedir?`, desc, [{ text: 'Anladım', style: 'cancel' }]);
  };

  const handleBuy = async (jokerId: keyof JokerInventory, cost: number, name: string) => {
    if (gold >= cost && inventory) {
      const newGold = gold - cost;
      const newInventory = { ...inventory, [jokerId]: inventory[jokerId] + 1 };


      await UserDetailsStorage.updateGold(newGold);
      await BoughtJokersStorage.updateJokers(newInventory);


      setGold(newGold);
      setInventory(newInventory);

      Alert.alert('Başarılı!', `${name} satın alındı.`);
    } else {
      Alert.alert('Hata', 'Yeterli altınınız bulunmamaktadır!');
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>

      <View style={styles.headerRow}>
        <Text style={styles.pageTitle}>MARKET</Text>
        <View style={styles.goldBadge}>
          <Text style={styles.goldText}>🪙 {gold} Altın</Text>
        </View>
      </View>


      <ScrollView contentContainerStyle={styles.scrollContent}>
        {JOKER_LIST.map((joker) => (
          <View key={joker.id} style={styles.card}>
           
            <View style={styles.imageContainer}>
              <Image source={joker.image} style={styles.jokerImage} resizeMode="contain" />
            </View>


            <View style={styles.infoContainer}>
              <View style={styles.nameRow}>
                <Text style={styles.jokerName}>{joker.name}</Text>

                <TouchableOpacity onPress={() => showInfo(joker.name, joker.desc)}>
                  <Text style={styles.infoIcon}>ℹ️</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.ownedText}>Sahip Olduğun: {inventory ? inventory[joker.id as keyof JokerInventory] : 0}</Text>
              <Text style={styles.costText}>Fiyat: {joker.cost} Altın</Text>
            </View>


            <TouchableOpacity
              style={[styles.buyButton, gold < joker.cost && styles.disabledButton]}
              onPress={() => handleBuy(joker.id as keyof JokerInventory, joker.cost, joker.name)}
              disabled={gold < joker.cost}
            >
              <Text style={styles.buyButtonText}>Satın Al</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Marketplace;


const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FF5722',
  },
  goldBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 3,
  },
  goldText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContent: {
    padding: 15,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  imageContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  jokerImage: {
    width: 45,
    height: 45,
  },
  infoContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jokerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  infoIcon: {
    fontSize: 18,
    color: '#2196F3',
  },
  ownedText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  costText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF9800',
    marginTop: 2,
  },
  buyButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  disabledButton: {
    backgroundColor: '#A5D6A7',
  },
  buyButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
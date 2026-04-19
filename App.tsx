import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const App = () => {
  // Kullanıcı adı ve giriş durumunu tuttuğumuz stateler
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Giriş yapma fonksiyonu
  const handleLogin = () => {
    if (username.trim().length > 0) {
      setIsLoggedIn(true);
    }
  };

  // Kullanıcı giriş YAPMADIYSA Giriş Ekranı gösterilir
  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loginContainer}>
          <Text style={styles.title}>Word Crush'a</Text>
          <Text style={styles.subtitle}>Hoş Geldiniz!</Text>

          <TextInput
            style={styles.input}
            placeholder="Kullanıcı Adınızı Girin"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
          />

          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>Oyuna Başla</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Kullanıcı giriş YAPTIYSA Ana Menü gösterilir
  return (
    <SafeAreaView style={styles.container}>
      {/* Sol üstteki kullanıcı adı (Tıklanabilir) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setIsLoggedIn(false)}>
          <Text style={styles.usernameText}>👤 {username}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menuContainer}>
        <Text style={styles.mainTitle}>WORD CRUSH</Text>

        {/* Ana Menü Butonları */}
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuButtonText}>Yeni Oyun</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuButtonText}>Skor Tablosu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuButtonText}>Market</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Tasarım (Style) Ayarları
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC', // Arka plan için açık bir bej tonu
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    color: '#555',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
  },
  usernameText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mainTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: '#FF5722',
    marginBottom: 50,
    letterSpacing: 2,
  },
  menuButton: {
    backgroundColor: '#2196F3',
    width: '80%',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default App;
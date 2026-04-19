import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { globalStyles } from '@/styles/global';

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
      <SafeAreaView style={globalStyles.container}>
        <View style={globalStyles.loginContainer}>
          <Text style={globalStyles.title}>Word Crush'a</Text>
          <Text style={globalStyles.subtitle}>Hoş Geldiniz!</Text>

          <TextInput
            style={globalStyles.input}
            placeholder="Kullanıcı Adınızı Girin"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
          />

          <TouchableOpacity style={globalStyles.primaryButton} onPress={handleLogin}>
            <Text style={globalStyles.buttonText}>Oyuna Başla</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Kullanıcı giriş YAPTIYSA Ana Menü gösterilir
  return (
    <SafeAreaView style={globalStyles.container}>
      {/* Sol üstteki kullanıcı adı (Tıklanabilir) */}
      <View style={globalStyles.header}>
        <TouchableOpacity onPress={() => setIsLoggedIn(false)}>
          <Text style={globalStyles.usernameText}>👤 {username}</Text>
        </TouchableOpacity>
      </View>

      <View style={globalStyles.menuContainer}>
        <Text style={globalStyles.mainTitle}>WORD CRUSH</Text>

        {/* Ana Menü Butonları */}
        <TouchableOpacity style={globalStyles.menuButton}>
          <Text style={globalStyles.menuButtonText}>Yeni Oyun</Text>
        </TouchableOpacity>

        <TouchableOpacity style={globalStyles.menuButton}>
          <Text style={globalStyles.menuButtonText}>Skor Tablosu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={globalStyles.menuButton}>
          <Text style={globalStyles.menuButtonText}>Market</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Tasarım (Style) Ayarları


export default App;
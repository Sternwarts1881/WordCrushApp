import React, { useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { globalStyles } from '@/styles/global';
import FirstWelcomeScreen from './firstWelcomeScreen';

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
      <FirstWelcomeScreen
        username={username}
        onUsernameChange={setUsername}
        onLogin={handleLogin}
      />
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



export default App;
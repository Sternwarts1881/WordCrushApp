import React, { useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { globalStyles } from '@/styles/global';
import FirstWelcomeScreen from './firstWelcomeScreen';
import { Link, useRouter } from 'expo-router';
import NameChange from './nameChange';
import GameScreen from './gameScreen';
import Scoreboard from './scoreboard';
import Marketplace from './marketplace';


const App = () => {
  // Kullanıcı adı ve giriş durumunu tuttuğumuz stateler
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);

  // Giriş yapma fonksiyonu
  const handleLogin = () => {
    if (username.trim().length > 0) {
      setIsLoggedIn(true);
    }
  };
  // Kullanici isim degistirmek isterse
  const handleSaveName = () => {
    if (username.trim().length > 0) {
      setIsEditingName(false);
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
// Kullanici isim degistirmek istiyorsa gosterilir
  if (isEditingName) {
    return (
      <NameChange
        username={username}
        onUsernameChange={setUsername}
        onSave={handleSaveName}
      />
    );
  }


  // Kullanıcı giriş YAPTIYSA Ana Menü gösterilir
  return (
    <SafeAreaView style={globalStyles.container}>
      {/* Sol üstteki kullanıcı adı (Tıklanabilir) */}
      <View style={globalStyles.header}>
        <TouchableOpacity onPress={() => setIsEditingName(true)}>
          <Text style={globalStyles.usernameText}>👤 {username}</Text>
        </TouchableOpacity>
      </View>

      <View style={globalStyles.menuContainer}>
        <Text style={globalStyles.mainTitle}>WORD CRUSH</Text>

        {/* Ana Menü Butonları */}
        <TouchableOpacity 
          style={globalStyles.menuButton}
          onPress={() => router.push('/gameScreen')} 
        >
          <Text style={globalStyles.menuButtonText}>Yeni Oyun</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={globalStyles.menuButton}
          onPress={() => router.push('/scoreboard')} 
        >
          <Text style={globalStyles.menuButtonText}>Skor Tablosu</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={globalStyles.menuButton}
          onPress={() => router.push('/marketplace')} 
        >
          <Text style={globalStyles.menuButtonText}>Market</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};



export default App;
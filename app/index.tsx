import React, { useState, useEffect } from 'react'; // useEffect eklendi
import { SafeAreaView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { globalStyles } from '@/styles/global';
import FirstWelcomeScreen from './firstWelcomeScreen';
import { useRouter } from 'expo-router';
import NameChange from './nameChange';
// Storage sınıfını içeri aktarıyoruz
import { UserDetailsStorage } from '@/storage/userDetailsStorage';

const HomeScreen = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Yüklenme durumu

  // 1. ADIM: Uygulama açıldığında hafızayı kontrol et
  useEffect(() => {
    const checkStorage = async () => {
      const savedName = await UserDetailsStorage.getUsername();
      if (savedName) {
        setUsername(savedName);
        setIsLoggedIn(true);
      }
      setIsLoading(false);
    };
    checkStorage();
  }, []);

  // 2. ADIM: Giriş yaparken ismi kaydet
  const handleLogin = async () => {
    if (username.trim().length > 0) {
      await UserDetailsStorage.saveUsername(username); // Hafızaya yaz
      await UserDetailsStorage.initializeGold(); // Başlangıç altınını tanımla
      setIsLoggedIn(true);
    }
  };

  // 3. ADIM: İsim değiştirirken hafızayı güncelle
  const handleSaveName = async () => {
    if (username.trim().length > 0) {
      await UserDetailsStorage.saveUsername(username); // Yeni ismi hafızaya yaz
      setIsEditingName(false);
    }
  };


  if (isLoading) {
    return (
      <SafeAreaView style={[globalStyles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#FF5722" />
      </SafeAreaView>
    );
  }

  if (!isLoggedIn) {
    return (
      <FirstWelcomeScreen
        username={username}
        onUsernameChange={setUsername}
        onLogin={handleLogin}
      />
    );
  }

  if (isEditingName) {
    return (
      <NameChange
        username={username}
        onUsernameChange={setUsername}
        onSave={handleSaveName}
      />
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.header}>
        <TouchableOpacity onPress={() => setIsEditingName(true)}>
          <Text style={globalStyles.usernameText}>👤 {username}</Text>
        </TouchableOpacity>
      </View>

      <View style={globalStyles.menuContainer}>
        <Text style={globalStyles.mainTitle}>WORD CRUSH</Text>

        <TouchableOpacity
          style={globalStyles.menuButton}
          onPress={() => router.push('/(GameScreen)/gameScreen')}
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

export default HomeScreen;
import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { globalStyles } from '@/styles/global';
import FirstWelcomeScreen from './firstWelcomeScreen';
import { useRouter } from 'expo-router';
import NameChange from './nameChange';
// Storage sınıfını içeri aktarıyoruz
import { UserDetailsStorage } from '@/storage/userDetailsStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const clearAllData = async () => {
    try {
      await AsyncStorage.clear(); // Tüm local storage verilerini ucurur
      Alert.alert("Sıfırlandı!", "Tüm veriler silindi. Lütfen uygulamayı tamamen kapatıp yeniden açın.");
    } catch (e) {
      console.error("Veriler silinirken hata oldu:", e);
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
      {/* SOL ÜST KÖŞE: KIRMIZI SIFIRLAMA BUTONU */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          width: 45,
          height: 45,
          backgroundColor: '#D32F2F',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 8,
          zIndex: 100,
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 3,
        }}
        onPress={clearAllData}
      >
        <Text style={{ color: '#FFF', fontSize: 20 }}>🗑</Text>
      </TouchableOpacity>


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
import React from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { globalStyles } from '@/styles/global';

type Props = {
  username: string;
  onUsernameChange: (text: string) => void;
  onLogin: () => void;
};

const FirstWelcomeScreen = ({ username, onUsernameChange, onLogin }: Props) => {
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
          onChangeText={onUsernameChange}
        />

        <TouchableOpacity style={globalStyles.primaryButton} onPress={onLogin}>
          <Text style={globalStyles.buttonText}>Oyuna Başla</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FirstWelcomeScreen;

import React from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { globalStyles } from '@/styles/global';

type Props = {
  username: string;
  onUsernameChange: (text: string) => void;
  onSave: () => void;
};

const NameChange = ({ username, onUsernameChange, onSave }: Props) => {
  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.loginContainer}>
        <Text style={globalStyles.title}>Kullanıcı İsiminizi Değiştirin</Text>

        <TextInput
          style={globalStyles.input}
          placeholder="Yeni kullanıcı adınızı girin"
          placeholderTextColor="#999"
          value={username}
          onChangeText={onUsernameChange}
        />

        <TouchableOpacity style={globalStyles.primaryButton} onPress={onSave}>
          <Text style={globalStyles.buttonText}>Kaydet</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default NameChange;
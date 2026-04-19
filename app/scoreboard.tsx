import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { globalStyles } from '@/styles/global';

const Scoreboard = () => {
  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.menuContainer}>
        <Text style={globalStyles.mainTitle}>Skor Tablosu</Text>
      </View>
    </SafeAreaView>
  );
};

export default Scoreboard;
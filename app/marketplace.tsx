import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { globalStyles } from '@/styles/global';

const Marketplace = () => {
  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.menuContainer}>
        <Text style={globalStyles.mainTitle}>Market</Text>
        {/* Market içeriğini buraya ekle */}
      </View>
    </SafeAreaView>
  );
};

export default Marketplace;
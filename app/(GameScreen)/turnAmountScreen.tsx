import React, { useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { globalStyles } from '@/styles/global';

type Props = {

    turnamount:number;
    onSelectSize: (size: number)=>void;

};

const TurnAmountQuery = ({turnamount, onSelectSize}:Props)=>{
    return(
        <SafeAreaView style={globalStyles.container}>
                  <View style={globalStyles.menuContainer}>
                    <Text style={globalStyles.mainTitle}>Yeni Oyun İçin Hamle Sayısı Seçiniz</Text>
            
                    {/* Ana Menü Butonları */}
                    <TouchableOpacity 
                      style={globalStyles.menuButton}
                      onPress={() => onSelectSize(25)} 
                    >
                      <Text style={globalStyles.menuButtonText}>Kolay (25)</Text>
                    </TouchableOpacity>
            
                    <TouchableOpacity 
                      style={globalStyles.menuButton}
                      onPress={() => onSelectSize(20)} 
                    >
                      <Text style={globalStyles.menuButtonText}>Orta (20)</Text>
                    </TouchableOpacity>
            
                    <TouchableOpacity 
                      style={globalStyles.menuButton}
                      onPress={() => onSelectSize(15)} 
                    >
                      <Text style={globalStyles.menuButtonText}>Zor (15)</Text>
                    </TouchableOpacity>
                  </View>
        </SafeAreaView>
    );
};

export default TurnAmountQuery;
import React, { useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { globalStyles } from '@/styles/global';

type Props = {

    gridsize:number;
    onSelectSize: (size: number)=>void;

};

const GridSizeQuery = ({gridsize, onSelectSize}:Props)=>{
    return(
        <SafeAreaView style={globalStyles.container}>
                  <View style={globalStyles.menuContainer}>
                    <Text style={globalStyles.mainTitle}>Yeni Oyun İçin Zorluk Seviyesi Seçiniz</Text>
            
                    {/* Ana Menü Butonları */}
                    <TouchableOpacity 
                      style={globalStyles.menuButton}
                      onPress={() => onSelectSize(6)} 
                    >
                      <Text style={globalStyles.menuButtonText}>Kolay (6x6)</Text>
                    </TouchableOpacity>
            
                    <TouchableOpacity 
                      style={globalStyles.menuButton}
                      onPress={() => onSelectSize(8)} 
                    >
                      <Text style={globalStyles.menuButtonText}>Orta (8x8)</Text>
                    </TouchableOpacity>
            
                    <TouchableOpacity 
                      style={globalStyles.menuButton}
                      onPress={() => onSelectSize(10)} 
                    >
                      <Text style={globalStyles.menuButtonText}>Zor (10x10)</Text>
                    </TouchableOpacity>
                  </View>
        </SafeAreaView>
    );
};

export default GridSizeQuery;
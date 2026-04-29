import { globalStyles } from '@/styles/global';
import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    gridsize: number;
    onSelectSize: (size: number) => void;
};

const GridSizeQuery = ({ gridsize, onSelectSize }: Props) => {
    return (
        <SafeAreaView style={globalStyles.container}>
            <View style={globalStyles.menuContainer}>
                <Text style={globalStyles.mainTitle}>Izgara (Grid) Boyutu Seçiniz</Text>
                <Text style={{textAlign: 'center', marginBottom: 20, color: '#555', fontSize: 16}}>
                    Proje kurallarına göre küçük alan daha zordur.
                </Text>

                
                <TouchableOpacity
                    style={[globalStyles.menuButton, { backgroundColor: '#4CAF50' }]} 
                    onPress={() => onSelectSize(10)}
                >
                    <Text style={globalStyles.menuButtonText}>Kolay (10x10)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[globalStyles.menuButton, { backgroundColor: '#FF9800' }]} 
                    onPress={() => onSelectSize(8)}
                >
                    <Text style={globalStyles.menuButtonText}>Orta (8x8)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[globalStyles.menuButton, { backgroundColor: '#F44336' }]} 
                    onPress={() => onSelectSize(6)}
                >
                    <Text style={globalStyles.menuButtonText}>Zor (6x6)</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default GridSizeQuery;
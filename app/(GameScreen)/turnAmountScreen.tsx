import { globalStyles } from '@/styles/global';
import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    turnamount: number;
    onSelectSize: (size: number) => void;
};

const TurnAmountQuery = ({ turnamount, onSelectSize }: Props) => {
    return (
        <SafeAreaView style={globalStyles.container}>
            <View style={globalStyles.menuContainer}>
                <Text style={globalStyles.mainTitle}>Hamle Sayısı Seçiniz</Text>

                
                <TouchableOpacity
                    style={[globalStyles.menuButton, { backgroundColor: '#4CAF50' }]}
                    onPress={() => onSelectSize(25)}
                >
                    <Text style={globalStyles.menuButtonText}>Kolay (25 Hamle)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[globalStyles.menuButton, { backgroundColor: '#FF9800' }]}
                    onPress={() => onSelectSize(20)}
                >
                    <Text style={globalStyles.menuButtonText}>Orta (20 Hamle)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[globalStyles.menuButton, { backgroundColor: '#F44336' }]}
                    onPress={() => onSelectSize(15)}
                >
                    <Text style={globalStyles.menuButtonText}>Zor (15 Hamle)</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default TurnAmountQuery;
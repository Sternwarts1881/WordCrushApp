import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    score: number;
    wordsFound: number;
    longestWord: string;
    timeElapsed: number;
    onReturn: () => void;
};

const GameOverScreen = ({ score, wordsFound, longestWord, timeElapsed, onReturn }: Props) => {
    
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <SafeAreaView style={styles.gameOverContainer}>
            <View style={styles.gameOverCard}>
                <Text style={styles.gameOverTitle}>OYUN BİTTİ!</Text>
                
                <View style={styles.statsRow}>
                    <Text style={styles.statLabel}>Toplam Puan:</Text>
                    <Text style={styles.statValueHighlight}>{score}</Text>
                </View>
                <View style={styles.statsRow}>
                    <Text style={styles.statLabel}>Bulunan Kelime:</Text>
                    <Text style={styles.statValue}>{wordsFound}</Text>
                </View>
                <View style={styles.statsRow}>
                    <Text style={styles.statLabel}>En Uzun Kelime:</Text>
                    <Text style={styles.statValue}>{longestWord || "-"}</Text>
                </View>
                <View style={styles.statsRow}>
                    <Text style={styles.statLabel}>Geçen Süre:</Text>
                    <Text style={styles.statValue}>{formatTime(timeElapsed)}</Text>
                </View>

                <TouchableOpacity style={styles.returnButton} onPress={onReturn}>
                    <Text style={styles.returnButtonText}>OK (Ana Menüye Dön)</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default GameOverScreen;

const styles = StyleSheet.create({
    gameOverContainer: {
        flex: 1,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    gameOverCard: {
        backgroundColor: '#FFF',
        width: '100%',
        borderRadius: 20,
        padding: 30,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        alignItems: 'center',
    },
    gameOverTitle: {
        fontSize: 36,
        fontWeight: '900',
        color: '#F44336',
        marginBottom: 30,
        letterSpacing: 2,
    },
    statsRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        paddingBottom: 5,
    },
    statLabel: {
        fontSize: 18,
        color: '#555',
        fontWeight: '600',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    statValueHighlight: {
        fontSize: 22,
        fontWeight: '900',
        color: '#2196F3',
    },
    returnButton: {
        marginTop: 30,
        backgroundColor: '#2196F3',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
        width: '100%',
        alignItems: 'center',
    },
    returnButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, BackHandler, Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';

import GameOverScreen from './gameOverScreenn';
import GridSizeQuery from './gridSizeScreen';
import TurnAmountQuery from './turnAmountScreen';

import { ScoreboardStorage } from '@/storage/scoreboardStorage';
import { WordLibrary } from '@/storage/wordLibraryStorage';
import { ComboChecker } from '@/utils/comboCheck';
import { generateInitialGrid } from '@/utils/gridGenerator';
import { PointCalculator } from '@/utils/pointCalculator';
import { findAvailableWordsCount } from '@/utils/wordFinderr';

const screenWidth = Dimensions.get('window').width;

interface CellPosition {
    row: number;
    col: number;
}

const GameScreen = () => {
    const router = useRouter();

    const [gridSize, setGridsize] = useState(0);
    const [turnAmount, setTurnAmount] = useState(0);

    const [grid, setGrid] = useState<string[][]>([]);
    const [selectedCells, setSelectedCells] = useState<CellPosition[]>([]);
    const [score, setScore] = useState(0);
    const [poppedAmount, setPoppedAmount] = useState(0);
    const [longestWord, setLongestWord] = useState('');
    const [availableWords, setAvailableWords] = useState(0);
    
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isGameActive, setIsGameActive] = useState(false);

    useEffect(() => {
        if (gridSize > 0 && turnAmount > 0 && grid.length === 0) {
            setGrid(generateInitialGrid(gridSize));
            setIsGameActive(true);
        }
    }, [gridSize, turnAmount]);

    useEffect(() => {
        if (grid.length > 0) {
            const timeoutId = setTimeout(() => {
                const count = findAvailableWordsCount(grid);
                setAvailableWords(count);
            }, 10);
            return () => clearTimeout(timeoutId);
        }
    }, [grid]);

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (isGameActive && !isGameOver) {
            timer = setInterval(() => {
                setTimeElapsed(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isGameActive, isGameOver]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        const backAction = () => {
            if (isGameActive && !isGameOver) { 
                Alert.alert("Çıkış", "Oyundan çıkmak istediğinize emin misiniz?", [
                    { text: "İptal", style: "cancel" },
                    { text: "Evet", onPress: () => router.replace('/') } 
                ]);
                return true; 
            }
            return false;
        };
        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => backHandler.remove();
    }, [isGameActive, isGameOver]);

    useEffect(() => {
        if (isGameActive && turnAmount === 0 && !isGameOver) {
            setIsGameOver(true);
            setIsGameActive(false); 
            
            const saveGameData = async () => {
                const today = new Date();
                const dateString = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth() + 1).toString().padStart(2, '0')}.${today.getFullYear()}`;
                
                const gameRecord = {
                    id: Math.floor(Math.random() * 10000), 
                    date: dateString,
                    gridSize: `${gridSize}x${gridSize}`,
                    score: score,
                    wordsFound: poppedAmount,
                    longestWord: longestWord,
                    duration: timeElapsed
                };
                await ScoreboardStorage.saveGame(gameRecord);
            };
            saveGameData();
        }
    }, [turnAmount, isGameActive, isGameOver]);

    const cellSize = (screenWidth - 40) / gridSize;

    const onGestureEvent = (event: any) => {
        const { x, y } = event.nativeEvent;
        if (x < 0 || y < 0 || x >= gridSize * cellSize || y >= gridSize * cellSize) return;
        
        const col = Math.floor(x / cellSize);
        const row = Math.floor(y / cellSize);
        
        if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) return;

        const isAlreadySelected = selectedCells.some(cell => cell.row === row && cell.col === col);
        if (isAlreadySelected || selectedCells.length === 0) return;

        const lastCell = selectedCells[selectedCells.length - 1];
        if (Math.abs(lastCell.row - row) <= 1 && Math.abs(lastCell.col - col) <= 1) {
            setSelectedCells(prev => [...prev, { row, col }]);
        }
    };

    const onHandlerStateChange = (event: any) => {
        if (event.nativeEvent.state === State.BEGAN) {
            const { x, y } = event.nativeEvent;
            const col = Math.floor(x / cellSize);
            const row = Math.floor(y / cellSize);
            if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
                setSelectedCells([{ row, col }]);
            }
        } else if (event.nativeEvent.state === State.END) {
            if (selectedCells.length < 3) {
                Alert.alert("Geçersiz", "En az 3 harf!");
                setSelectedCells([]);
                return;
            }
            
            const word = selectedCells.map(cell => grid[cell.row][cell.col]).join('');
            const wordExists: boolean = WordLibrary.isValidWord(word);

            if (wordExists) {
                let totalPoint = 0; 
                let alertMessage = `Oluşturduğunuz kelime: ${word}`; 


                if (word.length > 3) {
                    const comboCheckResult = ComboChecker.checkCombo(word);

                    if (comboCheckResult.length > 1) {
                        alertMessage += `\n${comboCheckResult.length}X KOMBO!\nKombo kelimeleri: ${comboCheckResult.join(', ')}`;

                        for (const subWord of comboCheckResult) {
                            totalPoint += PointCalculator.calculateScore(subWord); 
                        }
                    } else {
                        totalPoint = PointCalculator.calculateScore(word);
                    }
                } else {
                    totalPoint = PointCalculator.calculateScore(word);
                }


                setScore(prev => prev + totalPoint);
                setPoppedAmount(prev => prev + 1);

                if (word.length > longestWord.length) {
                    setLongestWord(word);
                }

                // 3. Ekrana Bildirim Çıkarma (Döngü dışında, tek seferlik)
                Alert.alert("Kelime Oluşturuldu", alertMessage);

            } else {
                Alert.alert("Oluşturduğunuz Kelime Sözlükte Yok!", `Oluşturduğunuz kelime: ${word}`);
            }

            // 4. Tur ve Seçim Sıfırlama
            setTurnAmount(prev => prev - 1);
            setSelectedCells([]);
        }
    };

    if (gridSize === 0) return <GridSizeQuery gridsize={gridSize} onSelectSize={setGridsize} />;
    
    if (isGameOver) {
        return (
            <GameOverScreen 
                score={score} 
                wordsFound={poppedAmount} 
                longestWord={longestWord} 
                timeElapsed={timeElapsed} 
                onReturn={() => router.replace('/')} 
            />
        );
    }

    if (turnAmount === 0) return <TurnAmountQuery turnamount={turnAmount} onSelectSize={setTurnAmount} />;

    return (
        <SafeAreaView style={styles.gameContainer}>
            {/* ÜST PANEL: Puan, Hamle, Olası Kelimeler ve Süre */}
            <View style={styles.topPanel}>
                <View>
                    <Text style={styles.panelText}>Puan: {score}</Text>
                    <Text style={styles.panelText}>Kalan Hamle: {turnAmount}</Text>
                    {/* Olası kelimeler buraya, dikkat çekici sarı renkle taşındı */}
                    <Text style={[styles.panelText, { color: '#FFEB3B', marginTop: 4 }]}>
                        Olası Kelimeler: {availableWords}
                    </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.timerText}>⏱ {formatTime(timeElapsed)}</Text>
                </View>
            </View>

            {/* ORTA KISIM: Grid (Izgara) tam ortaya hizalanır */}
            <View style={styles.middleContainer}>
                <GestureHandlerRootView style={styles.gridBoard}>
                    <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
                        <View style={styles.gridContainer}>
                            {grid.map((row, rI) => (
                                <View key={rI} style={styles.row}>
                                    {row.map((letter, cI) => {
                                        const sel = selectedCells.some(c => c.row === rI && c.col === cI);
                                        return (
                                            <View key={cI} style={[styles.cell, { width: cellSize - 4, height: cellSize - 4 }, sel && styles.cellSelected]}>
                                                <Text style={[styles.letterText, sel && styles.letterTextSelected]}>{letter}</Text>
                                            </View>
                                        );
                                    })}
                                </View>
                            ))}
                        </View>
                    </PanGestureHandler>
                </GestureHandlerRootView>
            </View>

        
            <View style={styles.bottomPanel}>
                <Text style={styles.currentWordText}>
                    {selectedCells.map(c => grid[c.row][c.col]).join('')}
                </Text>
            </View>
        </SafeAreaView>
    );
};

export default GameScreen;

const styles = StyleSheet.create({
    gameContainer: { flex: 1, backgroundColor: '#8BC34A', justifyContent: 'space-between' }, // Flex yapısı düzeltildi
    topPanel: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: 'rgba(0,0,0,0.2)' },
    panelText: { fontSize: 16, fontWeight: 'bold', color: '#FFF', marginBottom: 4 },
    timerText: { fontSize: 24, fontWeight: '900', color: '#FFEB3B' },
    middleContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' }, // Grid her ekranda tam ortada durur
    gridBoard: { padding: 10, justifyContent: 'center', alignItems: 'center' },
    gridContainer: { justifyContent: 'center', alignItems: 'center' },
    row: { flexDirection: 'row' },
    cell: { backgroundColor: '#FFE0B2', margin: 2, justifyContent: 'center', alignItems: 'center', borderRadius: 8, elevation: 3 },
    cellSelected: { backgroundColor: '#FF5722' },
    letterText: { fontSize: 24, fontWeight: 'bold', color: '#1565C0' },
    letterTextSelected: { color: '#FFF' },
    bottomPanel: { padding: 20, alignItems: 'center', minHeight: 80, justifyContent: 'center' }, // Absolute pozisyonlama kaldırıldı
    currentWordText: { fontSize: 36, fontWeight: '900', color: '#FFF', letterSpacing: 4 }
});
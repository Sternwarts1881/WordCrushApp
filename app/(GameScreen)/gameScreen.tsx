import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import GridSizeQuery from './gridSizeScreen';
import TurnAmountQuery from './turnAmountScreen';

import { generateInitialGrid } from '@/utils/gridGenerator';
import { WordLibrary } from '@/storage/wordLibraryStorage';
import { PointCalculator } from '@/utils/pointCalculator';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

interface CellPosition {
    row: number;
    col: number;
}

const GameScreen = () => {
   
    const [gridSize, setGridsize] = useState(0);
    const [turnAmount, setTurnAmount] = useState(0);

 
    const [grid, setGrid] = useState<string[][]>([]);
    const [selectedCells, setSelectedCells] = useState<CellPosition[]>([]);
    const [score, setScore] = useState(0);
    const [availableWords, setAvailableWords] = useState(0);

   
    useEffect(() => {
        if (gridSize > 0 && turnAmount > 0 && grid.length === 0) {
            setGrid(generateInitialGrid(gridSize));
        }
    }, [gridSize, turnAmount]);

    const cellSize = (screenWidth - 40) / gridSize;

    const onGestureEvent = (event: any) => {
        const { x, y } = event.nativeEvent;
        const relativeX = x;
        const relativeY = y;

        if (relativeX < 0 || relativeY < 0 || relativeX >= gridSize * cellSize || relativeY >= gridSize * cellSize) {
            return;
        }

        const col = Math.floor(relativeX / cellSize);
        const row = Math.floor(relativeY / cellSize);

        if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) return;

        const isAlreadySelected = selectedCells.some(cell => cell.row === row && cell.col === col);

        if (isAlreadySelected) return;

        if (selectedCells.length === 0) return; // Wait for start

        const lastCell = selectedCells[selectedCells.length - 1];
        const rowDiff = Math.abs(lastCell.row - row);
        const colDiff = Math.abs(lastCell.col - col);

        if (rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0)) {
            setSelectedCells(prev => [...prev, { row, col }]);
        }
    };

    const onHandlerStateChange = (event: any) => {
        if (event.nativeEvent.state === State.BEGAN) {
            const { x, y } = event.nativeEvent;
            const relativeX = x;
            const relativeY = y;

            if (relativeX < 0 || relativeY < 0 || relativeX >= gridSize * cellSize || relativeY >= gridSize * cellSize) {
                return;
            }

            const col = Math.floor(relativeX / cellSize);
            const row = Math.floor(relativeY / cellSize);

            if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
                setSelectedCells([{ row, col }]);
            }
        } else if (event.nativeEvent.state === State.END) {

            if (selectedCells.length < 3) {
                Alert.alert("Geçersiz", "Kelime en az 3 harfli olmalıdır!");
                setSelectedCells([]);
                return;
            }
            
            const word = selectedCells.map(cell => grid[cell.row][cell.col]).join('');
            const wordExists : boolean = WordLibrary.isValidWord(word);
            if (wordExists){
                Alert.alert("Kelime Oluşturuldu", `Oluşturduğunuz kelime: ${word}`);
                const wordPoint = PointCalculator.calculateScore(word);
                setScore(score+wordPoint)
            }else{
                Alert.alert("Oluşturduğunuz Kelime Sözlükte Yok!", `Oluşturduğunuz kelime: ${word}`);
            }

            setTurnAmount(prev => prev - 1);
            setSelectedCells([]);
        }
    };


    if (gridSize == 0) {
        return (
            <GridSizeQuery
                gridsize={gridSize}
                onSelectSize={setGridsize}
            />
        );
    }

    if (turnAmount == 0) {
        return (
            <TurnAmountQuery
                turnamount={turnAmount}
                onSelectSize={setTurnAmount}
            />
        );
    }

    return (
        <SafeAreaView style={styles.gameContainer}>
            {/* Üst Bilgi Paneli */}
            <View style={styles.topPanel}>
                <Text style={styles.panelText}>Puan: {score}</Text>
                <Text style={styles.panelText}>Kalan Hamle: {turnAmount}</Text>
            </View>

            {/* Grid Alanı */}
            <GestureHandlerRootView style={styles.gridBoard}>
                <PanGestureHandler
                    onGestureEvent={onGestureEvent}
                    onHandlerStateChange={onHandlerStateChange}
                >
                    <View style={styles.gridContainer}>
                        {grid.map((row, rowIndex) => (
                            <View key={`row-${rowIndex}`} style={styles.row}>
                                {row.map((letter, colIndex) => {
                                    const isSelected = selectedCells.some(cell => cell.row === rowIndex && cell.col === colIndex);

                                    return (
                                        <View
                                            key={`cell-${rowIndex}-${colIndex}`}
                                            style={[
                                                styles.cell,
                                                { width: cellSize - 4, height: cellSize - 4 },
                                                isSelected && styles.cellSelected
                                            ]}
                                        >
                                            <Text style={[styles.letterText, isSelected && styles.letterTextSelected]}>
                                                {letter}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        ))}
                    </View>
                </PanGestureHandler>
            </GestureHandlerRootView>

            {/* Alt Panel */}
            <View style={styles.bottomPanel}>
                <Text style={styles.panelText}>Seçilebilir kelimeler: {availableWords}</Text>
                <Text style={styles.currentWordText}>
                    {selectedCells.map(cell => grid[cell.row][cell.col]).join('')}
                </Text>
            </View>
        </SafeAreaView>
    );
};

export default GameScreen;


const styles = StyleSheet.create({
    gameContainer: {
        flex: 1,
        backgroundColor: '#8BC34A', 
    },
    topPanel: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    panelText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    gridBoard: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gridContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        backgroundColor: '#FFE0B2', 
        margin: 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    cellSelected: {
        backgroundColor: '#FF5722', 
        transform: [{ scale: 0.95 }],
    },
    letterText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1565C0',
    },
    letterTextSelected: {
        color: '#FFF',
    },
    bottomPanel: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        alignItems: 'center',
    },
    currentWordText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
        letterSpacing: 3,
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
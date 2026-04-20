import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import GridSizeQuery from './gridSizeScreen';
import TurnAmountQuery from './turnAmountScreen';

import { generateInitialGrid } from '@/utils/gridGenerator';

const screenWidth = Dimensions.get('window').width;

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

   
    useEffect(() => {
        if (gridSize > 0 && turnAmount > 0 && grid.length === 0) {
            setGrid(generateInitialGrid(gridSize));
        }
    }, [gridSize, turnAmount]);

  
    const handleCellPress = (row: number, col: number) => {
        const isAlreadySelected = selectedCells.some(cell => cell.row === row && cell.col === col);
        
        if (isAlreadySelected) {
          
            if (selectedCells[selectedCells.length - 1].row === row && selectedCells[selectedCells.length - 1].col === col) {
                setSelectedCells(prev => prev.slice(0, -1));
            }
            return;
        }

  
        if (selectedCells.length === 0) {
            setSelectedCells([{ row, col }]);
            return;
        }

     
        const lastCell = selectedCells[selectedCells.length - 1];
        const rowDiff = Math.abs(lastCell.row - row);
        const colDiff = Math.abs(lastCell.col - col);

        if (rowDiff <= 1 && colDiff <= 1) {
            setSelectedCells(prev => [...prev, { row, col }]);
        } else {
            Alert.alert("Geçersiz Hamle", "Sadece komşu harfleri seçebilirsiniz!");
        }
    };

   
    const handleSubmitWord = () => {
        if (selectedCells.length < 3) {
            Alert.alert("Geçersiz", "Kelime en az 3 harfli olmalıdır!");
            setSelectedCells([]);
            return;
        }
        
        const word = selectedCells.map(cell => grid[cell.row][cell.col]).join('');
        Alert.alert("Kelime Oluşturuldu", `Oluşturduğunuz kelime: ${word}`);
        
       
        setTurnAmount(prev => prev - 1);
        setSelectedCells([]);
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

    const cellSize = (screenWidth - 40) / gridSize;

    return (
        <SafeAreaView style={styles.gameContainer}>
            {/* Üst Bilgi Paneli */}
            <View style={styles.topPanel}>
                <Text style={styles.panelText}>Puan: {score}</Text>
                <Text style={styles.panelText}>Kalan Hamle: {turnAmount}</Text>
            </View>

            {/* Grid Alanı */}
            <View style={styles.gridBoard}>
                {grid.map((row, rowIndex) => (
                    <View key={`row-${rowIndex}`} style={styles.row}>
                        {row.map((letter, colIndex) => {
                            const isSelected = selectedCells.some(cell => cell.row === rowIndex && cell.col === colIndex);

                            return (
                                <TouchableOpacity
                                    key={`cell-${rowIndex}-${colIndex}`}
                                    style={[
                                        styles.cell,
                                        { width: cellSize - 4, height: cellSize - 4 },
                                        isSelected && styles.cellSelected
                                    ]}
                                    onPress={() => handleCellPress(rowIndex, colIndex)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[styles.letterText, isSelected && styles.letterTextSelected]}>
                                        {letter}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ))}
            </View>

            
            <View style={styles.bottomPanel}>
                <Text style={styles.currentWordText}>
                    {selectedCells.map(cell => grid[cell.row][cell.col]).join('')}
                </Text>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmitWord}>
                    <Text style={styles.submitButtonText}>Kelimeyi Dene</Text>
                </TouchableOpacity>
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
    submitButton: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 25,
        elevation: 5,
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
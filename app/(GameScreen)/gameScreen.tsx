import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, BackHandler, Dimensions, Image, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';

import Animated, { LinearTransition, ZoomIn, ZoomOut } from 'react-native-reanimated';

import GameOverScreen from './gameOverScreen';
import GridSizeQuery from './gridSizeScreen';
import TurnAmountQuery from './turnAmountScreen';

import { BoughtJokersStorage } from '@/storage/boughtJokers';
import { ScoreboardStorage } from '@/storage/scoreboardStorage';
import { WordLibrary } from '@/storage/wordLibraryStorage';
import { ComboChecker } from '@/utils/comboCheck';
import { generateGrid } from '@/utils/gridGenerator';
import { JokerLogic } from '@/utils/jokerLogic';
import { PointCalculator } from '@/utils/pointCalculator';
import { CellRemover } from '@/utils/popCells';
import { PowerUpLogic } from '@/utils/powerUp';
import { FindAvailableWordsCount } from '@/utils/wordFinder';

import ExplosionParticle from '@/ExplosionParticle';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const screenWidth = Dimensions.get('window').width;

export interface CellPosition {
    row: number;
    col: number;
}

export interface CellInformation {
    id?: string;
    cellValue: string;
    powerUp: string;
}

const JOKER_LIST = [
    { id: 'balik', image: require('@/assets/images/jokers/balik.png') },
    { id: 'tekerlek', image: require('@/assets/images/jokers/tekerlek.png') },
    { id: 'lolipop', image: require('@/assets/images/jokers/lolipop.png') },
    { id: 'serbestDegistirme', image: require('@/assets/images/jokers/el.png') },
    { id: 'harfKaristirma', image: require('@/assets/images/jokers/karistirma.png') },
    { id: 'partiGuclendiricisi', image: require('@/assets/images/jokers/parti.png') },
];

const POWERUP_LIST = [
    { id: 'sutunSilme', logo: '⇆' },
    { id: 'satirSilme', logo: '✹' },
    { id: 'alanPatlatma', logo: '⇅' },
    { id: 'megaPatlatma', logo: '✪' }
];

const JOKER_DESCRIPTIONS: Record<string, { title: string, desc: string }> = {
    'balik': { title: 'Joker: Balık', desc: 'Seçtiğiniz bir harfi ve rastgele 2 komşusunu yutarak yok eder. Patlayan harfler puan kazandırır!' },
    'tekerlek': { title: 'Joker: Tekerlek', desc: 'Seçtiğiniz bir satırı tamamen yeniler ve patlayan harflerin puanını size kazandırır.' },
    'lolipop': { title: 'Joker: Lolipop', desc: 'İstediğiniz bir harfi patlatarak puanını hanenize yazdırır.' },
    'serbestDegistirme': { title: 'Joker: Serbest Değiştirme', desc: 'Sadece birbirine temas eden iki harfin yerini hamle harcamadan değiştirmenizi sağlar.' },
    'harfKaristirma': { title: 'Joker: Harf Karıştırma', desc: 'Tüm harflerin yerlerini rastgele karıştırarak yeni fırsatlar yaratır.' },
    'partiGuclendiricisi': { title: 'Joker: Parti Güçlendiricisi', desc: 'Rastgele 5 harfi patlatarak büyük bir puan ve alan avantajı sağlar.' }
};

const GameScreen = () => {
    const router = useRouter();
    const navigation = useNavigation();

    const [gridSize, setGridsize] = useState(0);
    const [turnAmount, setTurnAmount] = useState(0);
    const [grid, setGrid] = useState<CellInformation[][]>([]);
    const [selectedCells, setSelectedCells] = useState<CellPosition[]>([]);
    const [score, setScore] = useState(0);
    const [poppedAmount, setPoppedAmount] = useState(0);
    const [longestWord, setLongestWord] = useState('');
    const [availableWords, setAvailableWords] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isGameActive, setIsGameActive] = useState(false);
    const [inventory, setInventory] = useState<any>(null);
    const [activeJoker, setActiveJoker] = useState<string | null>(null);
    const [swapFirstCell, setSwapFirstCell] = useState<CellPosition | null>(null);

    const [isAnimating, setIsAnimating] = useState(false);
    const [explosionParticles, setExplosionParticles] = useState<any[]>([]);
    const [fishTargets, setFishTargets] = useState<CellPosition[]>([]);
    const [centerOverlayJoker, setCenterOverlayJoker] = useState<string | null>(null);

    useEffect(() => {
        const loadInventory = async () => {
            const inv = await BoughtJokersStorage.getJokers();
            setInventory(inv);
        };
        loadInventory();
    }, []);

    const toggleJoker = (id: string) => {
        if (isAnimating) return;
        if (activeJoker === id) {
            setActiveJoker(null);
        } else {
            setActiveJoker(id);
        }
    };

    useEffect(() => {
        setSwapFirstCell(null);
    }, [activeJoker]);

    const handleJokerInfo = (id: string) => {
        const info = JOKER_DESCRIPTIONS[id];
        if (info) {
            Alert.alert(info.title, info.desc);
        }
    };

    const handleJokerAction = async (row?: number, col?: number) => {
        if (!activeJoker || isAnimating) return;

        const currentCount = inventory ? inventory[activeJoker] : 0;
        if (currentCount <= 0) {
            Alert.alert("Bitti", "Bu jokerden elinizde kalmadı!");
            setActiveJoker(null);
            return;
        }

        setIsAnimating(true);

        if (activeJoker === 'serbestDegistirme') {
            if (!swapFirstCell) {
                setSwapFirstCell({ row: row!, col: col! });
                setIsAnimating(false);
                return;
            } else {

                const isAdjacent = Math.abs(swapFirstCell.row - row!) <= 1 && Math.abs(swapFirstCell.col - col!) <= 1;
                const isSameCell = swapFirstCell.row === row! && swapFirstCell.col === col!;
                if (!isAdjacent || isSameCell) {
                    Alert.alert("Geçersiz Hamle", "Sadece birbirine temas eden harfler yer değiştirilebilir!");
                    setSwapFirstCell(null);
                    setIsAnimating(false);
                    return;
                }


                const result = JokerLogic.executeJoker(activeJoker, grid, gridSize, swapFirstCell.row, swapFirstCell.col, row, col);
                if (result.success) {
                    setGrid(result.newGrid);
                    const updatedInventory = { ...inventory, [activeJoker]: currentCount - 1 };
                    setInventory(updatedInventory);
                    await BoughtJokersStorage.updateJokers(updatedInventory);
                }
                setSwapFirstCell(null);
                setActiveJoker(null);
                setTimeout(() => setIsAnimating(false), 400);
                return;
            }
        }

        if (activeJoker === 'harfKaristirma' || activeJoker === 'partiGuclendiricisi') {
            setCenterOverlayJoker(activeJoker);

            setTimeout(async () => {
                setCenterOverlayJoker(null);

                const result = JokerLogic.executeJoker(activeJoker, grid, gridSize, row, col);
                if (result.success) {
                    setGrid(result.newGrid);
                    if (result.earnedScore && result.earnedScore > 0) {
                        setScore(prev => prev + result.earnedScore!);
                    }
                    const updatedInventory = { ...inventory, [activeJoker]: currentCount - 1 };
                    setInventory(updatedInventory);
                    await BoughtJokersStorage.updateJokers(updatedInventory);
                }
                setActiveJoker(null);
                setTimeout(() => setIsAnimating(false), 400);
            }, 1000);
            return;
        }

        const result = JokerLogic.executeJoker(activeJoker, grid, gridSize, row, col);

        if (result.success) {
            if (activeJoker === 'balik' && result.targetedCells) {
                setFishTargets(result.targetedCells);

                setTimeout(async () => {
                    setFishTargets([]);

                    setGrid(result.newGrid);
                    if (result.earnedScore && result.earnedScore > 0) {
                        setScore(prev => prev + result.earnedScore!);
                    }
                    const updatedInventory = { ...inventory, [activeJoker]: currentCount - 1 };
                    setInventory(updatedInventory);
                    await BoughtJokersStorage.updateJokers(updatedInventory);

                    setActiveJoker(null);
                    setTimeout(() => setIsAnimating(false), 400);
                }, 500);
                return;
            }

            setGrid(result.newGrid);
            if (result.earnedScore && result.earnedScore > 0) {
                setScore(prev => prev + result.earnedScore!);
            }
            const updatedInventory = { ...inventory, [activeJoker]: currentCount - 1 };
            setInventory(updatedInventory);
            await BoughtJokersStorage.updateJokers(updatedInventory);
        }

        setActiveJoker(null);
        setTimeout(() => setIsAnimating(false), 400);
    };

    useEffect(() => {
        if (gridSize > 0 && turnAmount > 0 && grid.length === 0) {
            setGrid(generateGrid(gridSize));
            setIsGameActive(true);
        }
    }, [gridSize, turnAmount]);

    useEffect(() => {
        if (grid.length > 0 && !isAnimating) {
            const timeoutId = setTimeout(() => {
                const count = FindAvailableWordsCount(grid);
                setAvailableWords(count);

                if (count === 0 && isGameActive && !isGameOver) {
                    Alert.alert(
                        "Hamle Kalmadı!",
                        "Grid üzerinde hiç oluşturulabilir kelime yok! Izgara yenileniyor...",
                        [
                            {
                                text: "Tamam",
                                onPress: () => {
                                    setGrid(generateGrid(gridSize));
                                }
                            }
                        ],
                        { cancelable: false }
                    );
                }
            }, 150);
            return () => clearTimeout(timeoutId);
        }
    }, [grid, isAnimating, isGameActive, isGameOver, gridSize]);

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

    const requestEarlyExit = () => {
        Alert.alert("Oyunu Bitir", "Oyunu erken bitirmek istediğinize emin misiniz? (Mevcut skorunuz kaydedilecektir)", [
            { text: "İptal", style: "cancel" },
            { text: "Evet", onPress: () => setTurnAmount(0) }
        ]);
    };

    useEffect(() => {
        const backAction = () => {
            if (isGameActive && !isGameOver && !isAnimating) {
                requestEarlyExit();
                return true;
            }
            return false;
        };
        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => backHandler.remove();
    }, [isGameActive, isGameOver, isAnimating]);

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity
                    onPress={() => {
                        if (isGameActive && !isGameOver && !isAnimating) {
                            requestEarlyExit();
                        } else if (!isAnimating) {
                            router.back();
                        }
                    }}
                    style={{ paddingRight: 20, paddingVertical: 5, marginLeft: -5 }}
                >
                    <Text style={{ fontSize: 26, color: '#333' }}>←</Text>
                </TouchableOpacity>
            )
        });
    }, [navigation, isGameActive, isGameOver, isAnimating]);

    useEffect(() => {
        if (isGameActive && turnAmount === 0 && !isGameOver && !isAnimating) {
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
    }, [turnAmount, isGameActive, isGameOver, isAnimating]);

    const cellSize = (screenWidth - 40) / gridSize;

    const onGestureEvent = (event: any) => {
        if (isAnimating) return;

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
        if (isAnimating) return;

        if (event.nativeEvent.state === State.BEGAN) {
            const { x, y } = event.nativeEvent;
            const col = Math.floor(x / cellSize);
            const row = Math.floor(y / cellSize);

            if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
                if (activeJoker) {
                    handleJokerAction(row, col);
                    return;
                }
                setSelectedCells([{ row, col }]);
            }
        } else if (event.nativeEvent.state === State.END) {
            if (selectedCells.length === 0) return;

            if (selectedCells.length < 3) {
                Alert.alert("Geçersiz", "En az 3 harf olmalı!");
                setSelectedCells([]);
                return;
            }

            const word = selectedCells.map(cell => grid[cell.row][cell.col].cellValue).join('');
            const wordExists: boolean = WordLibrary.isValidWord(word);

            if (wordExists) {
                setIsAnimating(true);

                let totalPoint = 0;
                let alertMessage = `Oluşturduğunuz kelime: ${word}`;
                let cellsToPop = [...selectedCells];

                if (word.length > 3) {
                    const uzunluk = selectedCells.length;
                    const sonHucre = selectedCells[uzunluk - 1];
                    switch (uzunluk) {
                        case 4:
                            grid[sonHucre.row][sonHucre.col] = { ...grid[sonHucre.row][sonHucre.col], powerUp: 'satirSilme' };
                            break;
                        case 5:
                            grid[sonHucre.row][sonHucre.col] = { ...grid[sonHucre.row][sonHucre.col], powerUp: 'alanPatlatma' };
                            break;
                        case 6:
                            grid[sonHucre.row][sonHucre.col] = { ...grid[sonHucre.row][sonHucre.col], powerUp: 'sutunSilme' };
                            break;
                        default:
                            grid[sonHucre.row][sonHucre.col] = { ...grid[sonHucre.row][sonHucre.col], powerUp: 'megaPatlatma' };
                            break;
                    };
                    cellsToPop.pop();
                    setGrid([...grid]);

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

                cellsToPop.forEach(cell => {
                    const existingPowerUp = grid[cell.row][cell.col].powerUp;

                    if (existingPowerUp) {
                        const powerResult = PowerUpLogic.executePowerUp(existingPowerUp, grid, gridSize, cellsToPop, cell.row, cell.col);

                        if (powerResult && powerResult.success) {
                            cellsToPop = powerResult.selectedCells;
                        }
                    }
                });

                setScore(prev => prev + totalPoint);
                setPoppedAmount(prev => prev + 1);

                if (word.length > longestWord.length) {
                    setLongestWord(word);
                };

                const newParticles: any[] = [];
                const colors = ['#FF5722', '#FFEB3B', '#FFC107', '#FFFFFF'];

                cellsToPop.forEach((cell) => {
                    const centerX = cell.col * cellSize + cellSize / 2;
                    const centerY = cell.row * cellSize + cellSize / 2;

                    for (let i = 0; i < 8; i++) {
                        newParticles.push({
                            id: Math.random().toString(),
                            x: centerX,
                            y: centerY,
                            color: colors[Math.floor(Math.random() * colors.length)],
                            size: cellSize / 4,
                        });
                    }
                });

                setExplosionParticles(prev => [...prev, ...newParticles]);

                const gridAfterRemoval = CellRemover.handleCellRemoval(cellsToPop, grid, gridSize);

                setGrid(gridAfterRemoval);

                setTimeout(() => {
                    const refilledGrid = generateGrid(gridSize, gridAfterRemoval);
                    setGrid(refilledGrid);
                    setIsAnimating(false);
                }, 400);


            } else {
                Alert.alert("Oluşturduğunuz Kelime Sözlükte Yok!", `Oluşturduğunuz kelime: ${word}`);
            }
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
            <View style={styles.topPanel}>
                <View>
                    <Text style={styles.panelText}>Puan: {score}</Text>
                    <Text style={styles.panelText}>Kalan Hamle: {turnAmount}</Text>
                    <Text style={[styles.panelText, { color: '#FFEB3B', marginTop: 4 }]}>
                        Olası Kelimeler: {availableWords}
                    </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.timerText}>⏱ {formatTime(timeElapsed)}</Text>
                </View>
            </View>

            <View style={styles.middleContainer}>
                <GestureHandlerRootView style={styles.gridBoard}>
                    <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
                        <View style={[styles.gridContainer, { position: 'relative' }]}>

                            {centerOverlayJoker && (
                                <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center', zIndex: 100, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 15 }]}>
                                    <Animated.Image
                                        source={JOKER_LIST.find(j => j.id === centerOverlayJoker)?.image}
                                        entering={ZoomIn.duration(400).springify()}
                                        exiting={ZoomOut.duration(300)}
                                        style={{ width: 160, height: 160 }}
                                        resizeMode="contain"
                                    />
                                </View>
                            )}

                            {explosionParticles.map(p => (
                                <ExplosionParticle
                                    key={p.id}
                                    x={p.x}
                                    y={p.y}
                                    color={p.color}
                                    size={p.size}
                                    onComplete={() => {
                                        setExplosionParticles(prev => prev.filter(particle => particle.id !== p.id));
                                    }}
                                />
                            ))}

                            {Array.from({ length: gridSize }).map((_, cI) => (
                                <View key={`col-${cI}`} style={styles.column}>
                                    {grid.map((row, rI) => {
                                        const letter = grid[rI][cI];
                                        if (!letter) return null;

                                        const sel = selectedCells.some(c => c.row === rI && c.col === cI) ||
                                            (swapFirstCell && swapFirstCell.row === rI && swapFirstCell.col === cI);

                                        const isEmpty = letter.cellValue === '';

                                        const isFishTarget = fishTargets.some(t => t.row === rI && t.col === cI);

                                        return (
                                            <Animated.View
                                                key={letter.id || `empty-${rI}-${cI}`}
                                                layout={LinearTransition.springify().damping(14).stiffness(100)}
                                                entering={isEmpty ? undefined : ZoomIn.duration(300).springify()}
                                                exiting={isEmpty ? undefined : ZoomOut.duration(200)}
                                                style={[
                                                    styles.cell,
                                                    { width: cellSize - 4, height: cellSize - 4 },
                                                    sel && styles.cellSelected,
                                                    isEmpty && { backgroundColor: 'transparent', elevation: 0 }
                                                ]}
                                            >
                                                {!isEmpty && (
                                                    <>
                                                        <Text style={[styles.letterText, sel && styles.letterTextSelected]}>
                                                            {letter.cellValue}
                                                        </Text>

                                                        {letter.powerUp ? (
                                                            <View style={styles.powerUpBadge}>
                                                                <Text style={styles.powerUpText}>
                                                                    {POWERUP_LIST.find(p => p.id === letter.powerUp)?.logo || '★'}
                                                                </Text>
                                                            </View>
                                                        ) : null}

                                                        {isFishTarget && (
                                                            <Animated.Image
                                                                source={require('@/assets/images/jokers/balik.png')}
                                                                entering={ZoomIn.duration(200).springify()}
                                                                style={{ position: 'absolute', width: '80%', height: '80%', zIndex: 50 }}
                                                                resizeMode="contain"
                                                            />
                                                        )}
                                                    </>
                                                )}
                                            </Animated.View>
                                        );
                                    })}
                                </View>
                            ))}
                        </View>
                    </PanGestureHandler>
                </GestureHandlerRootView>
            </View>

            <View style={styles.footerContainer}>
                <View style={styles.jokersContainer}>
                    {JOKER_LIST.map((joker) => {
                        const count = inventory ? inventory[joker.id] : 0;
                        const isSelected = activeJoker === joker.id;

                        return (
                            <TouchableOpacity
                                key={joker.id}
                                style={[styles.jokerButton, isSelected && styles.jokerSelected]}
                                onPress={() => toggleJoker(joker.id)}
                                onLongPress={() => handleJokerInfo(joker.id)}
                                delayLongPress={1000}
                                activeOpacity={isAnimating ? 1 : 0.8}
                            >
                                <Image source={joker.image} style={styles.jokerImage} resizeMode="contain" />
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{count}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={styles.bottomPanel}>
                    <Text style={styles.currentWordText}>
                        {selectedCells.map(c => grid[c.row][c.col]?.cellValue || '').join('')}
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default GameScreen;

const styles = StyleSheet.create({
    gameContainer: { flex: 1, backgroundColor: '#8BC34A', justifyContent: 'space-between' },
    topPanel: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: 'rgba(0,0,0,0.2)' },
    panelText: { fontSize: 16, fontWeight: 'bold', color: '#FFF', marginBottom: 4 },
    timerText: { fontSize: 24, fontWeight: '900', color: '#FFEB3B' },
    middleContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    gridBoard: { padding: 10, justifyContent: 'center', alignItems: 'center' },
    gridContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    column: { flexDirection: 'column' },
    cell: { backgroundColor: '#FFE0B2', margin: 2, justifyContent: 'center', alignItems: 'center', borderRadius: 8, elevation: 3 },
    cellSelected: { backgroundColor: '#FF5722' },
    letterText: { fontSize: 24, fontWeight: 'bold', color: '#1565C0' },
    letterTextSelected: { color: '#FFF' },
    footerContainer: { width: '100%', alignItems: 'center', paddingBottom: 20 },
    jokersContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', width: '100%', maxWidth: 280, marginBottom: 10 },
    jokerButton: { width: 55, height: 55, backgroundColor: '#ffffff', borderRadius: 12, margin: 15, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, borderWidth: 3, borderColor: 'transparent' },
    jokerSelected: { borderColor: '#FFEB3B', backgroundColor: '#FFFDE7', transform: [{ scale: 1.20 }], elevation: 8 },
    jokerImage: { width: 70, height: 70 },
    badge: { position: 'absolute', top: -8, left: -8, backgroundColor: '#F44336', width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF', elevation: 5 },
    badgeText: { color: '#FFF', fontSize: 12, fontWeight: '900' },
    bottomPanel: { padding: 10, alignItems: 'center', minHeight: 60, justifyContent: 'center' },
    currentWordText: { fontSize: 36, fontWeight: '900', color: '#FFF', letterSpacing: 4 },
    powerUpBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#D32F2F',
        borderRadius: 12,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        borderWidth: 1,
        borderColor: '#FFF'
    },
    powerUpText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    }
});
import React, { use, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { globalStyles } from '@/styles/global';
import GridSizeQuery from './gridSizeScreen';
import TurnAmountQuery from './turnAmountScreen';

const GameScreen=()=>{
    const [gridSize, setGridsize] = useState(0);
    const [turnAmount, setTurnAmount] = useState(0);

    if (gridSize==0){
        return(
            <GridSizeQuery
            gridsize = {gridSize}
            onSelectSize={setGridsize}
            />
        );
    };
    
    if (turnAmount==0){
        return(
            <TurnAmountQuery
            turnamount = {turnAmount}
            onSelectSize={setTurnAmount}
            />
        );
    };
    
    return(
    <SafeAreaView style={globalStyles.container}>

    <View style = {globalStyles.loginContainer}>
        <Text style={globalStyles.mainTitle} > Oyun ekrani</Text>
    </View>
    </SafeAreaView>
    );


};

export default GameScreen
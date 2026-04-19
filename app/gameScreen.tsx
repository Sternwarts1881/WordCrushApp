import React from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { globalStyles } from '@/styles/global';

const GameScreen=()=>{
    return(
    <SafeAreaView style={globalStyles.container}>

    <View style = {globalStyles.loginContainer}>
        <Text style={globalStyles.mainTitle} > Oyun ekrani</Text>
    </View>
    </SafeAreaView>
    );
};

export default GameScreen
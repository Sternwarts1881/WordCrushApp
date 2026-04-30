import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { globalStyles,colors } from '@/styles/global';


export default function RootLayout() {
  return (

      <Stack screenOptions={{headerShown:true , 
        headerStyle:globalStyles.header, 
        headerTintColor:colors.textPrimary
        }} >
        <Stack.Screen name='index' options={{headerShown:false, title:'Ana Sayfa'}}/>
        <Stack.Screen name='firstWelcomeScreen' options={{headerShown:false}}/>
        <Stack.Screen name='(GameScreen)/gameScreen' options={{title:'Yeni Oyun!'}}/>
        <Stack.Screen name='marketplace'options={{title:'Market Alanı'}}/>
        <Stack.Screen name='nameChange' options={{headerShown:false  }}/>
        <Stack.Screen name='scoreboard'options={{title:'Skor Tablosu'}}/>
      </Stack>


  );
}

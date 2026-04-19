import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';


export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name='index' options={{headerShown:false}}/>
        <Stack.Screen name='firstWelcomeScreen' />
        <Stack.Screen name='gameScreen'/>
        <Stack.Screen name='marketplace'/>
        <Stack.Screen name='nameChange'/>
        <Stack.Screen name='scoreboard'/>
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

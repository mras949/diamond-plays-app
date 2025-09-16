import 'expo-dev-client';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from './constants/theme';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'DMSans-Regular': require('@expo-google-fonts/dm-sans/static/DMSans-Regular.ttf'),
    'DMSans-Medium': require('@expo-google-fonts/dm-sans/static/DMSans-Medium.ttf'),
    'DMSans-Bold': require('@expo-google-fonts/dm-sans/static/DMSans-Bold.ttf'),
  });

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <Slot />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
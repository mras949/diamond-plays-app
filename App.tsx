import 'expo-dev-client'; // Enable development client for Expo Router
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'DM Sans': require('@expo-google-fonts/dm-sans/static/DMSans-Regular.ttf'),
    'DM Sans Medium': require('@expo-google-fonts/dm-sans/static/DMSans-Medium.ttf'),
    'DM Sans Bold': require('@expo-google-fonts/dm-sans/static/DMSans-Bold.ttf'),
  });

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack />
    </SafeAreaProvider>
  );
}
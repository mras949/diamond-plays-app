import { Stack, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GameDataProvider } from '../contexts/GameDataContext';
import { AuthProvider, useAuth } from '../providers/AuthProvider';

function AuthenticationGuard() {
  const { isAuthenticated, loading, logoutLoading } = useAuth();
  const router = useRouter();

  // Handle navigation based on auth state
  useEffect(() => {
    if (!loading && !logoutLoading) {
      if (isAuthenticated) {
        // Navigate to home when authenticated
        router.replace('/home');
      } else {
        // Navigate to login when not authenticated
        router.replace('/');
      }
    }
  }, [isAuthenticated, loading, logoutLoading, router]);

  if (loading || logoutLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f4f5' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  // Show appropriate stack based on auth state
  if (!isAuthenticated) {
    return <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  }

  // User is authenticated
  return (
    <GameDataProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="home" options={{ headerShown: false }} />
      </Stack>
    </GameDataProvider>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <AuthenticationGuard />
    </AuthProvider>
  );
}
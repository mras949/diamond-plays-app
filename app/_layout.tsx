import { Stack } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '../providers/AuthProvider';

function AuthenticationGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f4f5' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  // Once we've checked auth status and user is not authenticated, show login
  if (!isAuthenticated && !loading) {
    return <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Login' }} />
      <Stack.Screen name="register" options={{ title: 'Sign Up' }} />
    </Stack>
  }

  // User is authenticated, show protected routes
  return <Stack screenOptions={{ headerLeft: undefined }}>
    <Stack.Screen name="home" options={{ headerShown: false }} />
  </Stack>;
}

export default function Layout() {
  return (
    <AuthProvider>
      <AuthenticationGuard>
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Diamond Plays' }} />
          <Stack.Screen name="register" options={{ title: 'Sign Up' }} />
          <Stack.Screen name="home" options={{ title: 'Today\'s Games' }} />
        </Stack>
      </AuthenticationGuard>
    </AuthProvider>
  );
}
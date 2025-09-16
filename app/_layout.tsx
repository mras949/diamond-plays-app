import { Stack } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '../providers/AuthProvider';

function AuthenticationGuard() {
  const { isAuthenticated, loading, logoutLoading } = useAuth();

  if (loading || logoutLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f4f5' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  // Once we've checked auth status and user is not authenticated, show login
  if (!isAuthenticated && !loading && !logoutLoading) {
    return <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  }

  // User is authenticated, show protected routes
  return <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="home" options={{ headerShown: false }} />
  </Stack>;
}

export default function Layout() {
  return (
    <AuthProvider>
      <AuthenticationGuard />
    </AuthProvider>
  );
}
import { Redirect, Stack } from 'expo-router';
import React from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Layout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Diamond Plays' }} />
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="register" options={{ title: 'Sign Up' }} />
      <Stack.Screen name="home" options={{ title: 'Home' }} />
    </Stack>
  );
}
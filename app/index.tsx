import axios from 'axios';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { RegisterModal } from '../components/forms/RegisterModal';
import { API_BASE_URL } from '../constants/api';
import { useAuth } from '../providers/AuthProvider';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your Google Client ID
    scopes: ['openid', 'profile', 'email'],
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.idToken) {
        handleGoogleLogin(authentication.idToken);
      }
    }
  }, [response]);

  const handleGoogleLogin = async (idToken: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login/google`, { idToken });
      await login(response.data.token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google login failed.');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      await login(response.data.token);
      // Navigation will be handled by AuthenticationGuard in _layout.tsx
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    }
  };

  return (
    <>
      <View className="flex-1 justify-center px-6 bg-background">
        <Text className="text-3xl font-bold text-text text-center mb-8">Diamond Plays</Text>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          className="mb-4"
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="mb-4"
        />
        {error ? <Text className="text-error text-sm mb-4">{error}</Text> : null}
        <Button mode="contained" onPress={handleLogin} className="mb-4">
          Login
        </Button>
        <Button mode="outlined" onPress={() => promptAsync()} className="mb-4">
          Login with Google
        </Button>
        <Text className="text-primary text-center font-semibold" onPress={() => setRegisterModalVisible(true)}>
          Don’t have an account? Sign up
        </Text>
      </View>
      <RegisterModal
        visible={registerModalVisible}
        onClose={() => setRegisterModalVisible(false)}
        onSwitchToLogin={() => setRegisterModalVisible(false)}
      />
    </>
  );
};



export default LoginScreen;
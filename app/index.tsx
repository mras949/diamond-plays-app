import axios from 'axios';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
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
      <View>
        <Text>Diamond Plays</Text>
        <View>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>
        <View>
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        {error ? <Text>{error}</Text> : null}
        <View>
          <Button mode="contained" onPress={handleLogin}>
            Login
          </Button>
        </View>
        <View>
          <Button mode="outlined" onPress={() => promptAsync()}>
            Login with Google
          </Button>
        </View>
        <Text onPress={() => setRegisterModalVisible(true)}>
          Don't have an account? Sign up
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
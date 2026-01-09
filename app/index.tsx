import axios from 'axios';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { RegisterModal } from '../components/forms/RegisterModal';
import { API_BASE_URL } from '../constants/api';
import { useCustomTheme } from '../constants/theme';
import { useAuth } from '../providers/AuthProvider';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const { login } = useAuth();
  const theme = useCustomTheme();

  const [, response, promptAsync] = Google.useAuthRequest({
    clientId: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your Google Client ID
    scopes: ['openid', 'profile', 'email'],
  });

  const handleGoogleLogin = useCallback(async (idToken: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login/google`, { idToken });
      await login(response.data.token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google login failed.');
    }
  }, [login]);

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.idToken) {
        handleGoogleLogin(authentication.idToken);
      }
    }
  }, [response, handleGoogleLogin]);

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
      <View style={theme.styles.components.form.container}>
        <View style={theme.styles.components.form.header}>
          <Text style={[theme.styles.components.text.title, { color: theme.colors.primary }]}>
            Diamond Plays
          </Text>
        </View>

        <View style={theme.styles.components.form.content}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            mode="outlined"
            style={theme.styles.components.input}
            theme={{
              colors: {
                background: theme.colors.surface,
                onSurface: theme.colors.onSurface,
              }
            }}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            mode="outlined"
            style={theme.styles.components.input}
            theme={{
              colors: {
                background: theme.colors.surface,
                onSurface: theme.colors.onSurface,
              }
            }}
          />

          {error ? (
            <Text style={theme.styles.components.text.error}>
              {error}
            </Text>
          ) : null}

          <Button
            mode="contained"
            onPress={handleLogin}
            style={theme.styles.components.button}
            contentStyle={{ paddingVertical: 8 }}
          >
            Login
          </Button>

          <Button
            mode="outlined"
            onPress={() => promptAsync()}
            style={theme.styles.components.button}
            contentStyle={{ paddingVertical: 8 }}
            textColor={theme.colors.primary}
          >
            Login with Google
          </Button>

          <Text
            style={theme.styles.components.form.link}
            onPress={() => setRegisterModalVisible(true)}
          >
            Don&apos;t have an account? Sign up
          </Text>
        </View>
      </View>

      <RegisterModal
        visible={registerModalVisible}
        onClose={() => setRegisterModalVisible(false)}
        onSwitchToLogin={() => setRegisterModalVisible(false)}
      />
    </>
  );
};



// Styles are now defined in the theme

export default LoginScreen;
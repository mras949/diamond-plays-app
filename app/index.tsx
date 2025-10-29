import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { RegisterModal } from '../components/forms/RegisterModal';
import { API_BASE_URL } from '../constants/api';
import { theme } from '../constants/theme';
import { useAuth } from '../providers/AuthProvider';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

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
      <View style={styles.container}>
        <Text style={styles.title}>Diamond Plays</Text>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button mode="contained" onPress={handleLogin} style={styles.button}>
          Login
        </Button>
        <Text style={styles.link} onPress={() => setRegisterModalVisible(true)}>
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

const styles = StyleSheet.create({
  container: theme.components.loginContainer,
  title: theme.components.loginTitle,
  input: theme.components.loginInput,
  error: theme.components.loginError,
  button: theme.components.loginButton,
  link: theme.components.loginLink,
});

export default LoginScreen;
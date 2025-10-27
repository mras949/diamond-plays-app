import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { RegisterModal } from '../components/forms/RegisterModal';
import { API_BASE_URL } from '../constants/api';
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
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: '200',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    fontSize: 14,
    marginBottom: 15,
    backgroundColor: '#ffffff',
  },
  error: {
    color: '#ff0000',
    textAlign: 'center',
    marginBottom: 15,
  },
  button: {
    marginVertical: 10,
    backgroundColor: '#0066cc',
  },
  link: {
    color: '#0066cc',
    textAlign: 'center',
    marginTop: 15,
  },
});

export default LoginScreen;
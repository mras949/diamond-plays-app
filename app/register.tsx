import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { API_BASE_URL } from '../constants/api';
import { useAuth } from '../providers/AuthProvider';

const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleRegister = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, { email, password });
      await login(response.data.token); // Assume register returns a token
      router.push('/home');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Try a different email.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
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
      <Button mode="contained" onPress={handleRegister} style={styles.button}>
        Register
      </Button>
      <Text style={styles.link} onPress={() => router.push('/')}>
        Already have an account? Log in
      </Text>
    </View>
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
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
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

export default RegisterScreen;
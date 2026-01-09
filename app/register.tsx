import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
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
      // Navigation will be handled by AuthenticationGuard in _layout.tsx
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Try a different email.');
    }
  };

  return (
    <View>
      <Text>Sign Up</Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text>{error}</Text> : null}
      <Button mode="contained" onPress={handleRegister}>
        Register
      </Button>
      <Text onPress={() => router.push('/')}>
        Already have an account? Log in
      </Text>
    </View>
  );
};



export default RegisterScreen;
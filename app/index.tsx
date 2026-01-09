import axios from 'axios';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { LoginModal } from '../components/forms/LoginModal';
import { RegisterModal } from '../components/forms/RegisterModal';
import { API_BASE_URL } from '../constants/api';
import { useCustomTheme } from '../constants/theme';
import { useAuth } from '../providers/AuthProvider';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen: React.FC = () => {
  const [loginModalVisible, setLoginModalVisible] = useState(false);
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
      console.error('Google login failed:', err.response?.data?.message || 'Google login failed.');
    }
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.idToken) {
        handleGoogleLogin(authentication.idToken);
      }
    }
  }, [response, handleGoogleLogin]);

  return (
    <>
      <Image
        source={require('../assets/splash-bg.png')}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
        resizeMode="cover"
      />
      <View style={[theme.styles.components.form.container, { backgroundColor: 'transparent' }]}>
        <View style={theme.styles.components.form.header}>
          <Image
            source={require('../assets/diamond-plays-logo-1024.png')}
            style={{
              width: 75,
              height: 75,
              marginBottom: 16,
              alignSelf: 'center',
            }}
            resizeMode="contain"
          />
          <Text style={theme.styles.components.text.logothin}>
            Diamond <Text style={theme.styles.components.text.logo}>Plays</Text>
          </Text>
        </View>

        <View style={theme.styles.components.form.content}>
          <Button
            mode="contained"
            onPress={() => setLoginModalVisible(true)}
            style={theme.styles.components.button}
            contentStyle={{ paddingVertical: 8 }}
          >
            Login with Email
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

      <LoginModal
        visible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
        onSwitchToRegister={() => {
          setLoginModalVisible(false);
          setRegisterModalVisible(true);
        }}
      />
    </>
  );
};



// Styles are now defined in the theme

export default LoginScreen;
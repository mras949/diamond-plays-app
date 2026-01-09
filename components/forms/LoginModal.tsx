import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, KeyboardAvoidingView, Modal, PanResponder, Platform, TouchableOpacity, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { API_BASE_URL } from '../../constants/api';
import { useCustomTheme } from '../../constants/theme';
import { useAuth } from '../../providers/AuthProvider';

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  visible,
  onClose,
  onSwitchToRegister,
}) => {
  const theme = useCustomTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  // Animation values
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const modalTranslateY = useRef(new Animated.Value(300)).current;

  // Swipe handling
  const panY = useRef(new Animated.Value(0)).current;
  const handleScale = useRef(new Animated.Value(1)).current;
  const swipeStartY = useRef(0);

  // Create PanResponder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Be more permissive with gesture detection
        return Math.abs(gestureState.dy) > 5; // Reduced threshold
      },
      onPanResponderGrant: () => {
        swipeStartY.current = 0;
        panY.setValue(0);
        Animated.spring(handleScale, {
          toValue: 1.2,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0) {
          // Only allow downward swipes
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        Animated.spring(handleScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();

        // Check if swipe was sufficient to close modal
        if (gestureState.dy > 100) { // Increased threshold for closing
          // Animate modal out
          Animated.parallel([
            Animated.timing(backdropOpacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(modalTranslateY, {
              toValue: 300,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start(() => {
            handleClose();
          });
        } else {
          // Snap back to original position
          Animated.parallel([
            Animated.spring(modalTranslateY, {
              toValue: 0,
              useNativeDriver: true,
              tension: 100,
              friction: 8,
            }),
            Animated.spring(panY, {
              toValue: 0,
              useNativeDriver: true,
              tension: 100,
              friction: 8,
            }),
          ]).start();
        }
      },
    })
  ).current;

  // Handle modal animations
  useEffect(() => {
    if (visible) {
      // Reset animation values
      backdropOpacity.setValue(0);
      modalTranslateY.setValue(300);
      handleScale.setValue(1);
      panY.setValue(0);

      // Start animations
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(modalTranslateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, backdropOpacity, modalTranslateY, handleScale, panY]);

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setError('');
    setLoading(false);
    // Reset animations
    handleScale.setValue(1);
    panY.setValue(0);
    onClose();
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      await login(response.data.token);
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={theme.styles.components.modal.container}>
        <View pointerEvents="box-none" style={theme.styles.components.modal.backdrop}>
          <TouchableOpacity
            style={[
              theme.styles.components.modal.backdrop,
              { opacity: backdropOpacity, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
            ]}
            onPress={handleClose}
            activeOpacity={1}
          />
        </View>
        <View style={theme.styles.components.modal.wrapper}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={theme.styles.components.modal.keyboardAvoidingView}
          >
            <Animated.View
              style={[
                theme.styles.components.modal.content,
                {
                  backgroundColor: theme.colors.surface,
                  transform: [
                    { translateY: Animated.add(modalTranslateY, panY) },
                  ],
                },
              ]}
              {...panResponder.panHandlers}
            >
              <View style={[theme.styles.components.modal.handle, { backgroundColor: theme.colors.onSurfaceDisabled }]} />
              <Text style={[theme.styles.components.modal.title, { color: theme.colors.onSurface }]}>
                Login
              </Text>

              <TextInput
                style={theme.styles.components.modal.input}
                label="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                mode="outlined"
                theme={{
                  colors: {
                    primary: theme.colors.primary,
                    background: theme.colors.surface,
                  },
                }}
              />

              <TextInput
                style={theme.styles.components.modal.input}
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                mode="outlined"
                theme={{
                  colors: {
                    primary: theme.colors.primary,
                    background: theme.colors.surface,
                  },
                }}
              />

              {error ? (
                <Text style={[theme.styles.components.modal.errorText, { color: theme.colors.error }]}>
                  {error}
                </Text>
              ) : null}

              <Button
                style={theme.styles.components.modal.button}
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                buttonColor={theme.colors.primary}
                textColor={theme.colors.onPrimary}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>

              <TouchableOpacity style={theme.styles.components.modal.switchContainer} onPress={onSwitchToRegister}>
                <Text style={[theme.styles.components.modal.switchText, { color: theme.colors.onSurfaceVariant }]}>
                  Don&apos;t have an account?{' '}
                  <Text style={[theme.styles.components.modal.switchLink, { color: theme.colors.primary }]}>
                    Sign up
                  </Text>
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );
};

export default LoginModal;
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, KeyboardAvoidingView, Modal, PanResponder, Platform, TouchableOpacity, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { API_BASE_URL } from '../../constants/api';
import { useCustomTheme } from '../../constants/theme';
import { useAuth } from '../../providers/AuthProvider';

interface RegisterModalProps {
  visible: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  visible,
  onClose,
  onSwitchToLogin,
}) => {
  const theme = useCustomTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
          tension: 200,
          friction: 5,
        }).start();
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0) { // Only allow downward movement
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { dy, vy } = gestureState;

        // Reset handle scale
        Animated.spring(handleScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 200,
          friction: 5,
        }).start();

        // If swiped down with enough velocity or distance, dismiss modal
        if (dy > 100 || vy > 0.5) {
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

  // Real-time password validation
  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setError('Passwords do not match');
    } else if (confirmPassword && password === confirmPassword) {
      setError(''); // Clear error when passwords match
    }
  }, [password, confirmPassword]);

  const handleRegister = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Clear any validation errors since we're proceeding
    setError('');

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        email: email.trim(),
        password
      });
      await login(response.data.token);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setLoading(false);
    // Reset animations
    handleScale.setValue(1);
    panY.setValue(0);
    onClose();
  };



  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={theme.styles.components.modal.container}>
        <View pointerEvents="box-none" style={theme.styles.components.modal.backdrop}>
          <TouchableOpacity
            style={[
              theme.styles.components.modal.backdrop,
              { opacity: backdropOpacity, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
            ]}
            onPress={onClose}
            activeOpacity={1}
          />
        </View>
        <View style={theme.styles.components.modal.wrapper}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
                Create Account
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

              <TextInput
                style={theme.styles.components.modal.input}
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                mode="outlined"
                theme={{
                  colors: {
                    primary: theme.colors.primary,
                    background: theme.colors.surface,
                  },
                }}
              />

              {password && confirmPassword && password === confirmPassword ? (
                <Text style={[theme.styles.components.modal.successText, { color: theme.colors.primary }]}>
                  ✓ Passwords match
                </Text>
              ) : null}

              {error ? (
                <Text style={[theme.styles.components.modal.errorText, { color: theme.colors.error }]}>
                  {error}
                </Text>
              ) : null}

              <Button
                style={theme.styles.components.modal.button}
                mode="contained"
                onPress={handleRegister}
                loading={loading}
                disabled={loading}
                buttonColor={theme.colors.primary}
                textColor={theme.colors.onPrimary}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>

              <TouchableOpacity style={theme.styles.components.modal.switchContainer} onPress={onSwitchToLogin}>
                <Text style={[theme.styles.components.modal.switchText, { color: theme.colors.onSurfaceVariant }]}>
                  Already have an account?{' '}
                  <Text style={[theme.styles.components.modal.switchLink, { color: theme.colors.primary }]}>
                    Log in
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

export default RegisterModal;

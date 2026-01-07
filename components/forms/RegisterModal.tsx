import axios from 'axios';
import { BlurView } from 'expo-blur';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, KeyboardAvoidingView, Modal, PanResponder, Platform, TouchableOpacity, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { API_BASE_URL } from '../../constants/api';
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
        console.log('PanResponder grant - swipe started');
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
        console.log('PanResponder release - dy:', gestureState.dy, 'vy:', gestureState.vy);
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
          console.log('Dismissing modal via swipe');
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
          console.log('Snapping back - swipe not sufficient');
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
    console.log('Modal handleClose called');
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

  // Animated styles
  const animatedStyle = {
    opacity: backdropOpacity,
    transform: [
      {
        translateY: Animated.add(modalTranslateY, panY),
      },
    ],
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1">
        <BlurView className="absolute inset-0" intensity={20} />
        <TouchableOpacity className="absolute inset-0" onPress={onClose} />
        <View className="flex-1 justify-end">
          <KeyboardAvoidingView className="flex-1 justify-end" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <Animated.View className="bg-surface rounded-t-3xl p-6 pb-8" style={[animatedStyle]} {...panResponder.panHandlers}>
              <View className="items-center mb-4">
                <View className="w-12 h-1.5 bg-outline rounded-full" />
              </View>
              <Text className="text-xl font-bold text-text mb-6 text-center">Create Account</Text>

              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                className="mb-4"
              />

              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                className="mb-4"
              />

              <TextInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                className="mb-4"
              />

              {password && confirmPassword && password === confirmPassword ? (
                <Text className="text-success text-sm mb-4">✓ Passwords match</Text>
              ) : null}

              {error ? (
                <Text className={`text-sm mb-4 ${
                  password && confirmPassword && password !== confirmPassword ? 'text-warning' : 'text-error'
                }`}>
                  {error}
                </Text>
              ) : null}

              <Button
                mode="contained"
                onPress={handleRegister}
                className="mb-4"
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>

              <TouchableOpacity onPress={onSwitchToLogin} className="items-center">
                <Text className="text-secondary text-sm">
                  Already have an account? <Text className="text-primary font-semibold">Log in</Text>
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );
};

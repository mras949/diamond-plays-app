import axios from 'axios';
import { BlurView } from 'expo-blur';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, KeyboardAvoidingView, Modal, PanResponder, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { API_BASE_URL } from '../constants/api';
import { useAuth } from '../providers/AuthProvider';

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
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
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

  return (
    <Modal
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
      transparent={true}
    >
      <View style={styles.container}>
        {/* Backdrop Touchable - placed before blur for proper touch handling */}
        <TouchableOpacity
          style={styles.backdropTouchable}
          activeOpacity={1}
          onPress={() => {
            console.log('Backdrop pressed');
            handleClose();
          }}
        />

        {/* Animated Blurred Backdrop */}
        <Animated.View style={[styles.blurBackdrop, { opacity: backdropOpacity }]}>
          <BlurView
            style={StyleSheet.absoluteFill}
            intensity={20}
            tint="dark"
          />
        </Animated.View>

        {/* Animated Modal Content */}
        <Animated.View
          style={[
            styles.modalWrapper,
            {
              transform: [
                {
                  translateY: Animated.add(modalTranslateY, panY),
                },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <KeyboardAvoidingView
            style={styles.keyboardAvoidingView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={styles.modalContent}>
              <View style={styles.handleContainer}>
                <Animated.View
                  style={[
                    styles.handle,
                    {
                      transform: [{ scaleY: handleScale }],
                    },
                  ]}
                />
              </View>

              <Text style={styles.title}>Create Account</Text>

              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
              />

              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
              />

              <TextInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={styles.input}
              />

              {password && confirmPassword && password === confirmPassword ? (
                <Text style={styles.successText}>✓ Passwords match</Text>
              ) : null}

              {error ? (
                <Text style={[
                  styles.error,
                  password && confirmPassword && password !== confirmPassword ? styles.validationError : styles.serverError
                ]}>
                  {error}
                </Text>
              ) : null}

              <Button
                mode="contained"
                onPress={handleRegister}
                style={styles.button}
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>

              <TouchableOpacity onPress={onSwitchToLogin} style={styles.switchContainer}>
                <Text style={styles.switchText}>
                  Already have an account? <Text style={styles.switchLink}>Log in</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  blurBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  backdropTouchable: {
    flex: 1,
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: '100%',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  handleContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    alignSelf: 'center',
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
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },
  error: {
    color: '#ff0000',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 14,
  },
  successText: {
    color: '#4caf50', // Green for success
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 10,
    fontWeight: '500',
  },
  validationError: {
    color: '#ff6b35', // Orange for validation errors
  },
  serverError: {
    color: '#ff0000', // Red for server errors
  },
  button: {
    marginVertical: 10,
    backgroundColor: '#0066cc',
  },
  switchContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  switchText: {
    color: '#666666',
    fontSize: 14,
  },
  switchLink: {
    color: '#0066cc',
    fontWeight: '600',
  },
});

import React from 'react';
import { Animated, Dimensions, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { theme } from '../constants/theme';

const { width } = Dimensions.get('window');

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
  onLogout: () => void;
  logoutLoading: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isVisible,
  onClose,
  onLogout,
  logoutLoading,
}) => {
  const slideAnim = React.useRef(new Animated.Value(-width * 0.75)).current;
  const [isRendered, setIsRendered] = React.useState(false);

  React.useEffect(() => {
    if (isVisible) {
      setIsRendered(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width * 0.75,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsRendered(false);
      });
    }
  }, [isVisible, slideAnim]);

  if (!isRendered) return null;

  return (
    <>
      {/* Backdrop */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />

      {/* Sidebar */}
      <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Menu</Text>
        </View>

        <View style={styles.menuItems}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={onLogout}
            disabled={logoutLoading}
          >
            <Text style={[styles.menuText, logoutLoading && styles.disabledText]}>
              {logoutLoading ? 'Logging out...' : 'Logout'}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 2000,
  } as ViewStyle,
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: width * 0.75, // 75% of screen width
    backgroundColor: theme.colors.surface,
    zIndex: 2001,
    paddingTop: 50, // Account for status bar
  } as ViewStyle,
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  } as ViewStyle,
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
  } as TextStyle,
  menuItems: {
    flex: 1,
    padding: 10,
  } as ViewStyle,
  menuItem: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: theme.colors.surfaceVariant,
    marginBottom: 10,
  } as ViewStyle,
  menuText: {
    fontSize: 16,
    color: theme.colors.onSurface,
  } as TextStyle,
  disabledText: {
    color: theme.colors.onSurfaceDisabled,
  } as TextStyle,
});
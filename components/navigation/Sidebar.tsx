import React from 'react';
import { Animated, Dimensions, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useCustomTheme } from '../../constants/theme';

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
  const theme = useCustomTheme();
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
        style={theme.styles.components.navigation.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />

      {/* Sidebar */}
      <Animated.View
        style={[
          theme.styles.components.navigation.sidebar,
          {
            backgroundColor: theme.colors.surface,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <View style={theme.styles.components.navigation.header}>
          <Text style={[theme.styles.components.navigation.headerText, { color: theme.colors.onSurface }]}>
            Menu
          </Text>
        </View>

        <View style={theme.styles.components.navigation.content}>
          <TouchableOpacity
            style={[
              theme.styles.components.navigation.menuItem,
              {
                backgroundColor: logoutLoading
                  ? theme.colors.surfaceDisabled
                  : theme.colors.surfaceVariant,
                borderColor: theme.colors.outline,
              },
            ]}
            onPress={onLogout}
            disabled={logoutLoading}
            activeOpacity={0.7}
          >
            <Text
              style={[
                theme.styles.components.navigation.menuItemText,
                {
                  color: logoutLoading
                    ? theme.colors.onSurfaceDisabled
                    : theme.colors.onSurface,
                },
              ]}
            >
              {logoutLoading ? 'Logging out...' : 'Logout'}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
};

export default Sidebar;
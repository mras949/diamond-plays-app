import React from 'react';
import { Animated, Dimensions, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { theme } from '../../constants/theme';

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
        style={theme.components.sidebarBackdrop}
        activeOpacity={1}
        onPress={onClose}
      />

      {/* Sidebar */}
      <Animated.View style={[theme.components.sidebar, { transform: [{ translateX: slideAnim }] }]}>
        <View style={theme.components.sidebarHeader}>
          <Text style={theme.components.sidebarTitle}>Menu</Text>
        </View>

        <View style={theme.components.sidebarMenuItems}>
          <TouchableOpacity
            style={theme.components.sidebarMenuItem}
            onPress={onLogout}
            disabled={logoutLoading}
          >
            <Text style={[theme.components.sidebarMenuText, logoutLoading && theme.components.sidebarMenuTextDisabled]}>
              {logoutLoading ? 'Logging out...' : 'Logout'}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
};